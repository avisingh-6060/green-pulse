"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const SimpleMap = dynamic(() => import("@/components/SimpleMap"), {
  ssr: false,
});

interface RouteData {
  route_name: string;
  distance: string;
  time: string;
  pollution: string;
  aqi: number;
  health_score: number;
  traffic: number;
  traffic_level: string;
  coordinates: [number, number][];
  is_peak_hour: boolean;
}

export default function RouteFinderPage() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!source.trim() || !destination.trim()) {
      setError("Please enter both source and destination.");
      return;
    }

    setLoading(true);
    setError("");
    setRoutes([]);

    try {
      const response = await fetch(
        `http://localhost:5000/api/routes?source=${encodeURIComponent(
          source
        )}&destination=${encodeURIComponent(destination)}`
      );

      if (!response.ok) {
        throw new Error("Server response not ok");
      }

      const data = await response.json();

      if (data?.success && Array.isArray(data.routes)) {
        setRoutes(data.routes);
        setSelectedIndex(0);

        // ✅ SAFE: Save last search for Overview sync
        localStorage.setItem(
          "lastSearch",
          JSON.stringify({
            source,
            destination,
            timestamp: new Date().toISOString(),
          })
        );
      } else {
        setError("No route found.");
      }
    } catch (err) {
      console.error("Route fetch error:", err);
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const getTrafficColor = (level?: string) => {
    switch (level) {
      case "Low":
        return "text-green-400";
      case "Moderate":
        return "text-yellow-400";
      case "High":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getHealthColor = (score?: number) => {
    if (!score) return "bg-gray-500";
    if (score > 75) return "bg-green-500";
    if (score > 50) return "bg-yellow-500";
    if (score > 30) return "bg-orange-500";
    return "bg-red-500";
  };

  const getAQIColor = (aqi: number) => {
    if (aqi < 50) return "text-green-400";
    if (aqi < 100) return "text-yellow-400";
    if (aqi < 200) return "text-orange-400";
    return "text-red-500";
  };

  const selectedRoute = routes[selectedIndex];

  const generateInsight = () => {
    if (!selectedRoute || routes.length < 2)
      return "This is currently the only available route.";

    const otherRoutes = routes.filter((_, i) => i !== selectedIndex);

    const avgTraffic =
      otherRoutes.reduce((sum, r) => sum + r.traffic, 0) /
      otherRoutes.length;

    const avgHealth =
      otherRoutes.reduce((sum, r) => sum + r.health_score, 0) /
      otherRoutes.length;

    const trafficDiff = Math.round(avgTraffic - selectedRoute.traffic);
    const healthDiff = Math.round(
      selectedRoute.health_score - avgHealth
    );

    let insight = "";

    if (trafficDiff > 5)
      insight += `${trafficDiff}% lower congestion compared to alternatives. `;

    if (healthDiff > 5)
      insight += `Health score is ${healthDiff} points better than other routes. `;

    if (selectedRoute.is_peak_hour)
      insight +=
        "Currently peak hour traffic may slightly increase travel time. ";

    if (!insight)
      insight =
        "This route provides a balanced combination of air quality and traffic conditions.";

    return insight;
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto text-white">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">
          🌿 Lucknow Smart Green Route
        </h1>
        <p className="text-slate-400 mt-2">
          Find the healthiest route based on predictive environmental analysis
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-emerald-500 outline-none"
          />

          <input
            type="text"
            placeholder="Enter Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-emerald-500 outline-none"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Analyzing Route..." : "Find Clean Route"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {routes.length > 0 && selectedRoute && (
        <>
          {/* Route Selector */}
          <div className="grid md:grid-cols-3 gap-4">
            {routes.map((route, index) => (
              <div
                key={`${route.route_name}-${index}`}
                onClick={() => setSelectedIndex(index)}
                className={`cursor-pointer p-4 rounded-lg border transition ${
                  selectedIndex === index
                    ? "border-emerald-500 bg-emerald-900/30"
                    : "border-slate-700 bg-slate-800"
                }`}
              >
                <p className="font-semibold">{route.route_name}</p>
                <p className="text-sm text-slate-400">
                  {route.distance} • {route.time}
                </p>
                <p className="text-sm">Health: {route.health_score}</p>
                <p className="text-sm text-slate-400">
                  Traffic: {route.traffic_level}
                </p>
              </div>
            ))}
          </div>

          {/* Route Details */}
          <div className="bg-slate-900 p-6 rounded-xl border border-emerald-600 shadow-lg mt-6">
            <h2 className="text-2xl font-semibold mb-4">
              🗺 Route Details
            </h2>

            <div className="grid md:grid-cols-5 gap-6 text-slate-300">
              <div>
                <p className="text-sm text-slate-500">AQI</p>
                <p
                  className={`text-lg font-semibold ${getAQIColor(
                    selectedRoute.aqi
                  )}`}
                >
                  {selectedRoute.aqi}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Distance</p>
                <p className="text-lg">{selectedRoute.distance}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Estimated Time</p>
                <p className="text-lg">{selectedRoute.time}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Traffic</p>
                <p
                  className={`text-lg font-semibold ${getTrafficColor(
                    selectedRoute.traffic_level
                  )}`}
                >
                  {selectedRoute.traffic_level} ({selectedRoute.traffic}%)
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Health Score</p>
                <p className="text-lg">{selectedRoute.health_score}</p>
                <div className="mt-2 w-full bg-slate-700 h-2 rounded-full">
                  <div
                    className={`h-2 rounded-full ${getHealthColor(
                      selectedRoute.health_score
                    )}`}
                    style={{ width: `${selectedRoute.health_score}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-r from-emerald-900/40 to-slate-900 p-6 rounded-xl border border-emerald-500 shadow-lg mt-6">
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">
              💡 AI Insight
            </h3>
            <p className="text-slate-300">{generateInsight()}</p>
          </div>

          {/* Map */}
          <div className="h-[450px] rounded-xl overflow-hidden border border-slate-800 shadow-lg mt-6">
            <SimpleMap routes={routes} selectedIndex={selectedIndex} />
          </div>
        </>
      )}
    </div>
  );
}
