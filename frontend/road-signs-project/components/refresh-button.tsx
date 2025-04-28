"use client"

import { Button, CircularProgress } from "@mui/material"
import { RefreshCw } from "lucide-react"
import { useSigns } from "@/context/signs-context"

export default function RefreshButton() {
  const { updateSigns, loading } = useSigns()

  // Обработчик обновления данных
  const handleRefresh = async () => {
    try {
      await updateSigns()
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error)
    }
  }

  return (
    <Button
      variant="outlined"
      startIcon={loading ? <CircularProgress size={20} /> : <RefreshCw size={20} />}
      onClick={handleRefresh}
      disabled={loading}
    >
      {loading ? "Обновление..." : "Обновить данные"}
    </Button>
  )
}
