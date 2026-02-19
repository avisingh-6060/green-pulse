import { Request, Response } from "express";
import axios from "axios";
import { calculateHealthScore } from "../services/healthScoreService";
import { supabase } from "../config/supabaseClient";

/* ================================
   Types
================================ */

interface Coordinates {
  lat: number;
  lon: number;
}

interface OSRMRoute {
  distance: number;
  geometry: {
    coordinates: [number, number][];
  };
}

interface ProcessedRoute {
  route_name: string;
  distance: string;
  rawDistance: number;
  pollution: string;
  aqi: number;
  health_score: number;
  traffic: number;
  coordinates: [number, number][];
  is_peak_hour: boolean;
}

/* ================================
   Helper: Geocode Location (FIXED)
================================ */

const geocodeLocation = async (place: string): Promise<Coordinates> => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: `${place}, Lucknow, India`,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "green-path-hackathon-app",
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("Location not found");
    }

    return {
      lat: parseFloat(response.data[0].lat),
      lon: parseFloat(response.data[0].lon),
    };
  } catch (error) {
    console.error("Geocode Error:", error);
    throw new Error("Invalid location");
  }
};

/* ================================
   Time-Based Traffic Model
================================ */

const getTimeBasedTraffic = (): { base: number; peak: boolean } => {
  const hour = new Date().getHours();

  if (hour >= 8 && hour <= 11) return { base: 75, peak: true };
  if (hour >= 17 && hour <= 21) return { base: 85, peak: true };
  if (hour >= 22 || hour <= 6) return { base: 20, peak: false };

  return { base: 45, peak: false };
};

/* ================================
   Speed Based On Traffic
================================ */

const getSpeedFromTraffic = (traffic: number): number => {
  if (traffic < 35) return 40;
  if (traffic < 65) return 28;
  return 18;
};

/* ================================
   Main Controller
================================ */

export const getRoutes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    /* ✅ Accept both styles */
    const rawSource =
      (req.query.source as string) ||
      (req.query.from as string);

    const rawDestination =
      (req.query.destination as string) ||
      (req.query.to as string);

    if (!rawSource || !rawDestination) {
      return res.status(400).json({
        success: false,
        message: "Source and Destination required",
      });
    }

    /* ✅ Normalize (case-insensitive) */
    const normalize = (value: string) =>
      value.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

    const source = normalize(rawSource);
    const destination = normalize(rawDestination);

    /* 1️⃣ Geocode */
    const sourceCoords = await geocodeLocation(source);
    const destCoords = await geocodeLocation(destination);

    /* 2️⃣ Get Multiple Routes */
    const routeResponse = await axios.get(
      `http://router.project-osrm.org/route/v1/driving/${sourceCoords.lon},${sourceCoords.lat};${destCoords.lon},${destCoords.lat}`,
      {
        params: {
          overview: "full",
          geometries: "geojson",
          alternatives: true,
        },
      }
    );

    const routesData: OSRMRoute[] = routeResponse.data.routes;

    if (!routesData || routesData.length === 0) {
      return res.json({
        success: true,
        routes: [],
      });
    }

    const WAQI_TOKEN = process.env.WAQI_TOKEN;

    if (!WAQI_TOKEN) {
      return res.status(500).json({
        success: false,
        message: "WAQI token missing in .env",
      });
    }

    /* 3️⃣ Fetch AQI */
    const aqiResponse = await axios.get(
      `https://api.waqi.info/feed/geo:${sourceCoords.lat};${sourceCoords.lon}/`,
      { params: { token: WAQI_TOKEN } }
    );

    const aqi: number =
      aqiResponse.data?.data?.aqi &&
      aqiResponse.data.status === "ok"
        ? aqiResponse.data.data.aqi
        : 100;

    /* 4️⃣ Traffic Base */
    const { base: baseTraffic, peak } = getTimeBasedTraffic();

    /* 5️⃣ Process Routes */
    let processedRoutes: ProcessedRoute[] = routesData.map(
      (route: OSRMRoute, index: number): ProcessedRoute => {
        const distanceKm = route.distance / 1000;

        const coordinates: [number, number][] =
          route.geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]]
          );

        let traffic = baseTraffic + distanceKm * 2 + aqi / 6;
        traffic = Math.min(100, Math.max(10, Math.round(traffic)));

        let pollution: string;
        if (aqi < 50) pollution = "Low";
        else if (aqi < 100) pollution = "Moderate";
        else if (aqi < 200) pollution = "High";
        else pollution = "Critical";

        const healthScore = calculateHealthScore({
          aqi,
          traffic,
          construction: false,
          industrial: false,
        });

        return {
          route_name: `Route ${index + 1}`,
          distance: `${distanceKm.toFixed(1)} km`,
          rawDistance: distanceKm,
          pollution,
          aqi,
          health_score: healthScore,
          traffic,
          coordinates,
          is_peak_hour: peak,
        };
      }
    );

    /* 6️⃣ Sort Cleanest First */
    processedRoutes.sort((a, b) => a.aqi - b.aqi);

    /* 7️⃣ Adjust Traffic + Recalculate Time */
    const finalRoutes = processedRoutes.map((route, index) => {
      const adjustedTraffic = Math.max(
        10,
        route.traffic - 10 * (processedRoutes.length - index)
      );

      const trafficLevel =
        adjustedTraffic < 35
          ? "Low"
          : adjustedTraffic < 65
          ? "Moderate"
          : "High";

      const avgSpeed = getSpeedFromTraffic(adjustedTraffic);
      const durationHours = route.rawDistance / avgSpeed;
      const updatedMinutes = Math.round(durationHours * 60);

      return {
        route_name: route.route_name,
        distance: route.distance,
        rawDistance: route.rawDistance,
        time: `${updatedMinutes} mins`,
        pollution: route.pollution,
        aqi: route.aqi,
        health_score: route.health_score,
        traffic: adjustedTraffic,
        traffic_level: trafficLevel,
        coordinates: route.coordinates,
        is_peak_hour: route.is_peak_hour,
      };
    });

    return res.json({
      success: true,
      routes: finalRoutes,
      recommended: finalRoutes[0],
    });

  } catch (error: unknown) {
    console.error("Route Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
