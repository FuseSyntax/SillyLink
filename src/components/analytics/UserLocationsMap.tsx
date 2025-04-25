"use client";

import { SectionCard } from "./SectionCard";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { ResponsiveContainer } from "recharts";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface LocationData {
  name: string;
  coordinates: [number, number];
  clicks: number;
  urlId: string;
}

interface UserLocationsMapProps {
  userLocations: LocationData[];
}

export const UserLocationsMap: React.FC<UserLocationsMapProps> = ({ userLocations }) => (
  <SectionCard title="User Locations" icon={<GlobeAltIcon />}>
    <div className="h-64">
      {userLocations.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No location data available. Click some URLs to see locations!</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 120,
              rotate: [-10, 0, 0],
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#E5E7EB"
                    stroke="#D1D5DB"
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#BFDBFE", outline: "none" },
                      pressed: { fill: "#93C5FD", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {userLocations.map((location) => (
              <Marker key={`${location.urlId}-${location.name}`} coordinates={location.coordinates}>
                <g fill="#4B8FFB" stroke="#3B82F6" strokeWidth="1">
                  <circle cx="12" cy="10" r={6} />
                  <text
                    x="12"
                    y="22"
                    textAnchor="middle"
                    className="text-[10px] font-semibold fill-primary"
                  >
                    {location.name} ({location.clicks})
                  </text>
                </g>
              </Marker>
            ))}
          </ComposableMap>
        </ResponsiveContainer>
      )}
    </div>
  </SectionCard>
);
