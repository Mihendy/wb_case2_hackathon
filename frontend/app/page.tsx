"use client"

import { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { MapView } from "@/components/map-view"
import { SignsTable } from "@/components/signs-table"
import { FilterPanel } from "@/components/filter-panel"
import { SearchBar } from "@/components/search-bar"
import { RefreshButton } from "@/components/refresh-button"
import { fetchSigns, forceLoadSigns } from "@/lib/api"
import type { Sign } from "@/types/sign"

export default function Home() {
  const [signs, setSigns] = useState<Sign[]>([])
  const [filteredSigns, setFilteredSigns] = useState<Sign[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const loadSigns = async () => {
    setIsLoading(true)
    try {
      const data = await fetchSigns()
      setSigns(data)
      applyFilters(data, sourceFilter, statusFilter, searchQuery)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные о знаках",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const result = await forceLoadSigns()
      toast({
        title: "Успешно",
        description: result.detail,
      })
      await loadSigns()
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные о знаках",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = (data: Sign[], source: string, status: string, query: string) => {
    let filtered = [...data]

    // Apply source filter
    if (source !== "all") {
      filtered = filtered.filter((sign) => sign.source === source)
    }

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((sign) => sign.status === status)
    }

    // Apply search query
    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        (sign) =>
          sign.name.toLowerCase().includes(lowerQuery) ||
          (sign.gibdd_unical_id && sign.gibdd_unical_id.toLowerCase().includes(lowerQuery)) ||
          (sign.commerce_internal_id && sign.commerce_internal_id.toLowerCase().includes(lowerQuery)),
      )
    }

    setFilteredSigns(filtered)
  }

  const handleSourceFilterChange = (source: string) => {
    setSourceFilter(source)
    applyFilters(signs, source, statusFilter, searchQuery)
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status)
    applyFilters(signs, sourceFilter, status, searchQuery)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    applyFilters(signs, sourceFilter, statusFilter, query)
  }

  useEffect(() => {
    loadSigns()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Панель управления дорожными знаками</h1>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearchChange} />
          </div>
          <div className="flex gap-2">
            <FilterPanel
              onSourceChange={handleSourceFilterChange}
              onStatusChange={handleStatusFilterChange}
              sourceFilter={sourceFilter}
              statusFilter={statusFilter}
            />
            <RefreshButton onRefresh={handleRefresh} isLoading={isLoading} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card rounded-lg shadow h-[500px]">
            <MapView signs={filteredSigns} />
          </div>
          <div className="bg-card rounded-lg shadow overflow-hidden">
            <SignsTable signs={filteredSigns} isLoading={isLoading} />
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}
