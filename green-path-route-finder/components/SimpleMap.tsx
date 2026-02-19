"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface RouteData {
  route_name: string;
  health_score: number;
  coordinates: [number, number][];
}

interface MapProps {
  routes: RouteData[];
  selectedIndex: number;
}

/* ================================
   🔥 STATIC POLLUTION ZONES (Lucknow Context)
================================ */
const pollutionZones = [
  {
    name: "Charbagh Metro Construction",
    lat: 26.8317,
    lng: 80.9200,
    radius: 600,
    level: "High",
  },
  {
    name: "Amausi Industrial Area",
    lat: 26.7606,
    lng: 80.8893,
    radius: 600,
    level: "High",
  },
  {
    name: "Transport Nagar Industrial",
    lat: 26.8200,
    lng: 80.9700,
    radius: 600,
    level: "Medium",
  },
  {
    name: "Alambagh Flyover Dust Zone",
    lat: 26.8000,
    lng: 80.9000,
    radius: 450,
    level: "Medium",
  },
  {
  name: "Talkatora Industrial Area",
  lat: 26.8615,
  lng: 80.8850,
  radius: 650,
  level: "High",
},
];

/* ================================
   Auto Fit Component
================================ */
function FitBounds({
  coordinates,
}: {
  coordinates: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      map.fitBounds(coordinates, { padding: [50, 50] });
    }
  }, [coordinates, map]);

  return null;
}

export default function SimpleMap({
  routes,
  selectedIndex,
}: MapProps) {
  if (!routes || routes.length === 0) return null;

  const selectedRoute = routes[selectedIndex];

  const source = selectedRoute.coordinates[0];
  const destination =
    selectedRoute.coordinates[
      selectedRoute.coordinates.length - 1
    ];

  /* ================================
     Custom Icons
  ================================= */
  const sourceIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const destIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const getColor = (index: number) => {
    const colors = [
      "#00FF7F",
      "#00BFFF",
      "#FF4500",
      "#FFD700",
      "#FF00FF",
    ];
    return colors[index % colors.length];
  };

  const getZoneColor = (level: string) => {
    switch (level) {
      case "High":
        return "red";
      case "Medium":
        return "orange";
      default:
        return "yellow";
    }
  };

  return (
    <MapContainer
      center={source}
      zoom={13}
      scrollWheelZoom={true}
      dragging={true}
      doubleClickZoom={true}
      zoomControl={true}
      touchZoom={true}
      keyboard={true}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Auto Fit When Route Changes */}
      <FitBounds coordinates={selectedRoute.coordinates} />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🔥 Pollution Risk Zones */}
      {pollutionZones.map((zone, index) => (
        <Circle
          key={index}
          center={[zone.lat, zone.lng]}
          radius={zone.radius}
          pathOptions={{
            color: getZoneColor(zone.level),
            fillColor: getZoneColor(zone.level),
            fillOpacity: 0.3,
          }}
        >
          <Popup>
            <strong>{zone.name}</strong>
            <br />
            Pollution Risk: {zone.level}
          </Popup>
        </Circle>
      ))}

      {/* Routes */}
      {routes.map((route, index) => {
        const isSelected = index === selectedIndex;

        return (
          <React.Fragment key={route.route_name}>
            {/* Glow Effect for Selected */}
            {isSelected && (
              <Polyline
                positions={route.coordinates}
                pathOptions={{
                  color: "#00FF7F",
                  weight: 14,
                  opacity: 0.25,
                }}
              />
            )}

            {/* Main Line */}
            <Polyline
              positions={route.coordinates}
              pathOptions={{
                color: getColor(index),
                weight: isSelected ? 8 : 4,
                opacity: isSelected ? 1 : 0.6,
              }}
            />
          </React.Fragment>
        );
      })}

      {/* Source Marker */}
      <Marker position={source} icon={sourceIcon}>
        <Popup>
          <b>Source</b>
        </Popup>
      </Marker>

      {/* Destination Marker */}
      <Marker position={destination} icon={destIcon}>
        <Popup>
          <b>Destination</b>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
