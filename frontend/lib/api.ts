import type { Sign } from "@/types/sign"

const API_BASE_URL = "http://localhost:8000/api/v1"

export async function fetchSigns(): Promise<Sign[]> {
  const response = await fetch(`${API_BASE_URL}/signs/`)

  if (!response.ok) {
    throw new Error(`Failed to fetch signs: ${response.status}`)
  }

  return response.json()
}

export async function forceLoadSigns(): Promise<{ detail: string }> {
  const response = await fetch(`${API_BASE_URL}/signs/force_load/`, {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error(`Failed to force load signs: ${response.status}`)
  }

  return response.json()
}
