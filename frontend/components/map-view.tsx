"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { Sign } from "@/types/sign"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })

const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })

const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

interface MapViewProps {
  signs: Sign[]
}

export function MapView({ signs }: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [center, setCenter] = useState<[number, number]>([55.7558, 37.6173]) // Default to Moscow

  useEffect(() => {
    setIsMounted(true)

    // If we have signs, center the map on the first sign
    if (signs.length > 0) {
      const firstSign = signs[0]
      if (firstSign.latitude && firstSign.longitude) {
        setCenter([Number.parseFloat(firstSign.latitude), Number.parseFloat(firstSign.longitude)])
      }
    }
  }, [signs])

  // Custom icon function based on sign source and status
  const getMarkerIcon = (sign: Sign) => {
    // This will be implemented when the component is mounted
    if (typeof window === "undefined") return null

    const L = require("leaflet")

    // Define colors based on source and status
    let color = "#3B82F6" // Default blue

    if (sign.source === "gibdd") {
      color = "#10B981" // Green for GIBDD
    } else if (sign.source === "commerce") {
      color = "#F59E0B" // Amber for Commerce
    }

    if (sign.status === "removed") {
      color = "#EF4444" // Red for removed
    } else if (sign.status === "conflict") {
      color = "#8B5CF6" // Purple for conflict
    }

    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
      className: "",
      iconSize: [12, 12],
    })
  }

  if (!isMounted) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Map View</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">Loading map...</CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Map View</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[450px]">
        <div className="h-full w-full">
          <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {signs.map((sign) => {
              // Skip signs without valid coordinates
              if (!sign.latitude || !sign.longitude) return null

              const lat = Number.parseFloat(sign.latitude)
              const lng = Number.parseFloat(sign.longitude)

              // Skip invalid coordinates
              if (isNaN(lat) || isNaN(lng)) return null

              return (
                <Marker key={sign.id} position={[lat, lng]} icon={getMarkerIcon(sign)}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold">{sign.name}</h3>
                      <p className="text-sm">ID: {sign.id}</p>
                      {sign.gibdd_unical_id && <p className="text-sm">GIBDD ID: {sign.gibdd_unical_id}</p>}
                      {sign.commerce_internal_id && <p className="text-sm">Commerce ID: {sign.commerce_internal_id}</p>}
                      <p className="text-sm capitalize">
                        Source:{" "}
                        <span className={sign.source === "gibdd" ? "text-green-600" : "text-amber-600"}>
                          {sign.source}
                        </span>
                      </p>
                      <p className="text-sm capitalize">
                        Status:{" "}
                        <span
                          className={
                            sign.status === "removed"
                              ? "text-red-600"
                              : sign.status === "conflict"
                                ? "text-purple-600"
                                : "text-blue-600"
                          }
                        >
                          {sign.status}
                        </span>
                      </p>
                      <p className="text-sm">
                        Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
