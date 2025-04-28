"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { fetchSignsData, updateSignsData, type FrontendSign } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

// Типы для фильтров
interface Filters {
  source: "all" | "gibdd" | "commerce" | "both"
  status: string[]
  searchQuery: string
}

interface SignsContextType {
  signs: FrontendSign[]
  filters: Filters
  updateFilters: (newFilters: Partial<Filters>) => void
  fetchSigns: () => Promise<void>
  updateSigns: () => Promise<void>
  loading: boolean
}

// Создание контекста
const SignsContext = createContext<SignsContextType | undefined>(undefined)

// Провайдер контекста
export function SignsProvider({ children }: { children: ReactNode }) {
  const [signs, setSigns] = useState<FrontendSign[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [filters, setFilters] = useState<Filters>({
    source: "all",
    status: [],
    searchQuery: "",
  })

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchSigns()
  }, [])

  // Функция для обновления фильтров
  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  // Функция для загрузки данных с сервера
  const fetchSigns = async () => {
    setLoading(true)
    try {
      const data = await fetchSignsData()
      setSigns(data)
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error)
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить данные о дорожных знаках",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Функция для обновления данных
  const updateSigns = async () => {
    setLoading(true)
    try {
      const result = await updateSignsData()

      if (result.success) {
        toast({
          title: "Успешно",
          description: result.message,
          variant: "default",
        })

        // Перезагружаем данные после успешного обновления
        await fetchSigns()
      } else {
        toast({
          title: "Ошибка обновления",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error)
      toast({
        title: "Ошибка обновления",
        description: "Не удалось обновить данные о дорожных знаках",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SignsContext.Provider value={{ signs, filters, updateFilters, fetchSigns, updateSigns, loading }}>
      {children}
    </SignsContext.Provider>
  )
}

// Хук для использования контекста
export function useSigns() {
  const context = useContext(SignsContext)
  if (context === undefined) {
    throw new Error("useSigns must be used within a SignsProvider")
  }
  return context
}
