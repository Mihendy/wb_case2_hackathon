"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RefreshButtonProps {
  onRefresh: () => Promise<void>
  isLoading: boolean
}

export function RefreshButton({ onRefresh, isLoading }: RefreshButtonProps) {
  return (
    <Button onClick={onRefresh} disabled={isLoading} className="h-10">
      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
      Refresh Data
    </Button>
  )
}
