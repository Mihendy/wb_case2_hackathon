"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Box, Typography, Divider, Chip, CircularProgress } from "@mui/material"
import { useSigns } from "@/context/signs-context"

// Исправление проблемы с иконками Leaflet в Next.js
const fixLeafletIcon = () => {
  // Only run this in browser environment
  if (typeof window === "undefined") return

  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

// Создаем иконки для разных типов маркеров
const createCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

export default function MapView() {
  const { signs, filters, loading } = useSigns()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Fix Leaflet icon issue only on the client side
    if (typeof window !== "undefined") {
      fixLeafletIcon()
    }
  }, [])

  // Фильтрация знаков согласно выбранным фильтрам
  const filteredSigns = signs.filter((sign) => {
    // Фильтр по источнику
    if (
      (filters.source === "gibdd" && !sign.sourceGibdd) ||
      (filters.source === "commerce" && !sign.sourceCommerce) ||
      (filters.source === "both" && (!sign.sourceGibdd || !sign.sourceCommerce))
    ) {
      return false
    }

    // Фильтр по статусу
    if (filters.status.length > 0 && !filters.status.includes(sign.mergedStatus || "")) {
      return false
    }

    // Фильтр по поисковому запросу
    if (filters.searchQuery && !sign.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  // Определение иконки маркера в зависимости от источника данных
  const getMarkerIcon = (sign: any) => {
    if (sign.sourceGibdd && sign.sourceCommerce) {
      return createCustomIcon("violet")
    } else if (sign.sourceGibdd) {
      return createCustomIcon("blue")
    } else {
      return createCustomIcon("green")
    }
  }

  // Получение текста источника данных
  const getSourceText = (sign: any) => {
    if (sign.sourceGibdd && sign.sourceCommerce) {
      return "ГИБДД и Коммерция"
    } else if (sign.sourceGibdd) {
      return "ГИБДД"
    } else {
      return "Коммерция"
    }
  }

  // Получение цвета чипа статуса
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "new":
        return "success"
      case "updated":
        return "info"
      case "conflict":
        return "error"
      case "removed":
        return "warning"
      default:
        return "default"
    }
  }

  // Получение текста статуса на русском
  const getStatusText = (status: string | null) => {
    switch (status) {
      case "new":
        return "Новый"
      case "updated":
        return "Обновлен"
      case "conflict":
        return "Конфликт"
      case "removed":
        return "Удален"
      default:
        return "Без статуса"
    }
  }

  if (!isClient) {
    return (
      <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        Загрузка карты...
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <MapContainer
        center={[55.7558, 37.6173]} // Москва по умолчанию
        zoom={10}
        style={{ height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredSigns.map((sign) => (
          <Marker key={sign.id} position={[sign.latitude, sign.longitude]} icon={getMarkerIcon(sign)}>
            <Popup>
              <Typography variant="subtitle1" fontWeight="bold">
                {sign.name}
              </Typography>

              <Box sx={{ display: "flex", gap: 0.5, my: 1, flexWrap: "wrap" }}>
                <Chip
                  size="small"
                  label={getSourceText(sign)}
                  color={
                    sign.sourceGibdd && sign.sourceCommerce ? "secondary" : sign.sourceGibdd ? "primary" : "success"
                  }
                />
                {sign.mergedStatus && (
                  <Chip
                    size="small"
                    label={getStatusText(sign.mergedStatus)}
                    color={getStatusColor(sign.mergedStatus) as any}
                  />
                )}
              </Box>

              {sign.sourceGibdd && sign.descriptionGibdd && (
                <>
                  <Typography variant="body2" fontWeight="bold">
                    Данные ГИБДД:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {sign.descriptionGibdd || "Нет описания"}
                  </Typography>
                </>
              )}

              {sign.sourceCommerce && sign.descriptionCommerce && (
                <>
                  <Typography variant="body2" fontWeight="bold">
                    Данные Коммерции:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {sign.descriptionCommerce || "Нет описания"}
                  </Typography>
                </>
              )}

              <Divider sx={{ my: 1 }} />

              <Typography variant="caption" display="block">
                {sign.sourceGibdd && sign.gibdd_unical_id && <div>ID ГИБДД: {sign.gibdd_unical_id}</div>}
                {sign.sourceCommerce && sign.commerce_internal_id && (
                  <div>ID Коммерции: {sign.commerce_internal_id}</div>
                )}
              </Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          right: 10,
          zIndex: 1000,
          backgroundColor: "white",
          p: 1,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="caption" display="block">
          <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "primary.main" }} /> ГИБДД
          </Box>
          <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "success.main" }} /> Коммерция
          </Box>
          <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "secondary.main" }} /> Оба источника
          </Box>
        </Typography>
      </Box>
    </Box>
  )
}
