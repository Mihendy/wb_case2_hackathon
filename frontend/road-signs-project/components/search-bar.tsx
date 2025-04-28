"use client"

import type React from "react"

import { useState } from "react"
import { TextField, InputAdornment, IconButton } from "@mui/material"
import { Search, X } from "lucide-react"
import { useSigns } from "@/context/signs-context"

export default function SearchBar() {
  const { filters, updateFilters } = useSigns()
  const [inputValue, setInputValue] = useState(filters.searchQuery || "")

  // Обработчик изменения поискового запроса
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    updateFilters({ searchQuery: event.target.value })
  }

  // Очистка поискового запроса
  const handleClearSearch = () => {
    setInputValue("")
    updateFilters({ searchQuery: "" })
  }

  return (
    <TextField
      fullWidth
      placeholder="Поиск по названию знака..."
      value={inputValue}
      onChange={handleSearchChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search size={20} />
          </InputAdornment>
        ),
        endAdornment: inputValue ? (
          <InputAdornment position="end">
            <IconButton aria-label="clear search" onClick={handleClearSearch} edge="end" size="small">
              <X size={16} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{ maxWidth: { sm: 300 } }}
    />
  )
}
