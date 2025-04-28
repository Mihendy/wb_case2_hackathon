"use client"

import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  type SelectChangeEvent,
} from "@mui/material"
import { useSigns } from "@/context/signs-context"

// Опции для статусов
const statusOptions = [
  { value: "new", label: "Новый", color: "success" },
  { value: "updated", label: "Обновлен", color: "info" },
  { value: "conflict", label: "Конфликт", color: "error" },
  { value: "removed", label: "Удален", color: "warning" },
]

export default function FilterPanel() {
  const { filters, updateFilters } = useSigns()

  // Обработчик изменения источника данных
  const handleSourceChange = (event: SelectChangeEvent) => {
    updateFilters({ source: event.target.value })
  }

  // Обработчик изменения статуса
  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    updateFilters({ status: typeof value === "string" ? value.split(",") : value })
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Фильтры
      </Typography>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
        <FormControl fullWidth sx={{ minWidth: 200 }}>
          <InputLabel id="source-filter-label">Источник данных</InputLabel>
          <Select
            labelId="source-filter-label"
            id="source-filter"
            value={filters.source}
            label="Источник данных"
            onChange={handleSourceChange}
          >
            <MenuItem value="all">Все источники</MenuItem>
            <MenuItem value="gibdd">Только ГИБДД</MenuItem>
            <MenuItem value="commerce">Только Коммерция</MenuItem>
            <MenuItem value="both">ГИБДД и Коммерция</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Статус</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            multiple
            value={filters.status}
            onChange={handleStatusChange}
            input={<OutlinedInput id="select-multiple-chip" label="Статус" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => {
                  const option = statusOptions.find((opt) => opt.value === value)
                  return (
                    <Chip
                      key={value}
                      label={option?.label || value}
                      color={(option?.color as any) || "default"}
                      size="small"
                    />
                  )
                })}
              </Box>
            )}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Chip label={option.label} color={option.color as any} size="small" sx={{ mr: 1 }} />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}
