// API service for fetching and updating road signs data

// Define the backend sign structure
export interface BackendSign {
  id: number
  gibdd_unical_id: string | null
  commerce_internal_id: string | null
  name: string
  latitude: string
  longitude: string
  gibdd_description: string | null
  commerce_description: string | null
  source: "gibdd" | "commerce" | "both"
  status: "new" | "updated" | "conflict" | "removed" | null
}

// Define the frontend sign structure (used in the app)
export interface FrontendSign {
  id: number
  name: string
  latitude: number
  longitude: number
  descriptionGibdd: string | null
  descriptionCommerce: string | null
  sourceGibdd: boolean
  sourceCommerce: boolean
  lastUpdateGibdd: string
  lastUpdateCommerce: string
  mergedStatus: "new" | "updated" | "conflict" | "removed" | null
}

// Transform backend sign data to frontend format
function transformSignData(backendSign: BackendSign): FrontendSign {
  return {
    id: backendSign.id,
    name: backendSign.name,
    latitude: Number.parseFloat(backendSign.latitude),
    longitude: Number.parseFloat(backendSign.longitude),
    descriptionGibdd: backendSign.gibdd_description,
    descriptionCommerce: backendSign.commerce_description,
    sourceGibdd: backendSign.source === "gibdd" || backendSign.source === "both",
    sourceCommerce: backendSign.source === "commerce" || backendSign.source === "both",
    // Since we don't have last update timestamps in the backend data,
    // we'll use current date as a placeholder
    lastUpdateGibdd: new Date().toISOString(),
    lastUpdateCommerce: new Date().toISOString(),
    mergedStatus: backendSign.status,
  }
}

// API base URL - replace with your actual API URL
const API_BASE_URL = "http://backend:8000/api/v1"

// Fetch all signs
export async function fetchSignsData(): Promise<FrontendSign[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/signs/`)

    if (!response.ok) {
      throw new Error(`Error fetching signs: ${response.status} ${response.statusText}`)
    }

    const data: BackendSign[] = await response.json()
    return data.map(transformSignData)
  } catch (error) {
    console.error("Failed to fetch signs:", error)
    throw error
  }
}

// Update signs data
export async function updateSignsData(): Promise<{ message: string; success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/signs/force_load`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (response.status === 201) {
      return { message: data.detail || "Созданы новые знаки", success: true }
    } else if (response.status === 200) {
      return { message: data.detail || "Знаки обновлены", success: true }
    } else {
      throw new Error(data.detail || "Ошибка при обновлении данных")
    }
  } catch (error) {
    console.error("Failed to update signs:", error)
    return { message: error instanceof Error ? error.message : "Неизвестная ошибка", success: false }
  }
}

// Mock data for development when API is not available
export const mockSignsData: FrontendSign[] = [
  {
    id: 1,
    name: "Знак 'Главная дорога' на перекрестке ул. Ленина",
    latitude: 55.751244,
    longitude: 37.618423,
    descriptionGibdd: "Знак 2.1 'Главная дорога'. Установлен на перекрестке ул. Ленина и ул. Пушкина.",
    descriptionCommerce: "Знак приоритета 2.1, металлический, светоотражающая пленка тип B, состояние хорошее.",
    sourceGibdd: true,
    sourceCommerce: true,
    lastUpdateGibdd: "2024-03-15T00:00:00Z",
    lastUpdateCommerce: "2024-04-01T00:00:00Z",
    mergedStatus: "updated",
  },
  // ... other mock data
]
