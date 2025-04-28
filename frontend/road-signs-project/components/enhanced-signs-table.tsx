"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  Typography,
  Collapse,
  IconButton,
  TablePagination,
  Tooltip,
  Button,
  CircularProgress,
} from "@mui/material"
import { ChevronDown, ChevronUp, Download, Copy } from "lucide-react"
import { useSigns } from "@/context/signs-context"

type Order = "asc" | "desc"
type OrderBy = "name" | "source" | "status" | "coordinates"

export default function EnhancedSignsTable() {
  const { signs, filters, loading } = useSigns()
  const [order, setOrder] = useState<Order>("asc")
  const [orderBy, setOrderBy] = useState<OrderBy>("name")
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

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

  // Сортировка данных
  const sortedSigns = [...filteredSigns].sort((a, b) => {
    let comparison = 0

    if (orderBy === "name") {
      comparison = a.name.localeCompare(b.name)
    } else if (orderBy === "source") {
      const sourceA = getSourceValue(a)
      const sourceB = getSourceValue(b)
      comparison = sourceA - sourceB
    } else if (orderBy === "status") {
      const statusA = getStatusValue(a.mergedStatus)
      const statusB = getStatusValue(b.mergedStatus)
      comparison = statusA - statusB
    } else if (orderBy === "coordinates") {
      comparison = a.latitude - b.latitude || a.longitude - b.longitude
    }

    return order === "desc" ? -comparison : comparison
  })

  // Пагинация
  const paginatedSigns = sortedSigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Получение числового значения для сортировки по источнику
  const getSourceValue = (sign: any) => {
    if (sign.sourceGibdd && sign.sourceCommerce) return 3
    if (sign.sourceGibdd) return 2
    if (sign.sourceCommerce) return 1
    return 0
  }

  // Получение числового значения для сортировки по статусу
  const getStatusValue = (status: string | null) => {
    switch (status) {
      case "new":
        return 4
      case "updated":
        return 3
      case "conflict":
        return 2
      case "removed":
        return 1
      default:
        return 0
    }
  }

  // Обработчик изменения сортировки
  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
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

  // Обработчик раскрытия/скрытия детальной информации о знаке
  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  // Обработчики пагинации
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Копирование координат в буфер обмена
  const handleCopyCoordinates = (lat: number, lng: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    }
  }

  // Экспорт данных в CSV
  const handleExportCSV = () => {
    if (typeof window === "undefined") return

    const headers = ["Название", "Координаты", "Источник", "Статус"]
    const csvContent = [
      headers.join(","),
      ...filteredSigns.map((sign) => {
        return [
          `"${sign.name.replace(/"/g, '""')}"`,
          `"${sign.latitude.toFixed(6)}, ${sign.longitude.toFixed(6)}"`,
          `"${getSourceText(sign)}"`,
          `"${getStatusText(sign.mergedStatus)}"`,
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "дорожные_знаки.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Список дорожных знаков ({filteredSigns.length})</Typography>
        <Button startIcon={<Download size={16} />} variant="outlined" onClick={handleExportCSV}>
          Экспорт CSV
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="таблица дорожных знаков">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  Название
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "coordinates"}
                  direction={orderBy === "coordinates" ? order : "asc"}
                  onClick={() => handleRequestSort("coordinates")}
                >
                  Координаты
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "source"}
                  direction={orderBy === "source" ? order : "asc"}
                  onClick={() => handleRequestSort("source")}
                >
                  Источник
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Статус
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSigns.map((sign) => (
              <>
                <TableRow
                  key={sign.id}
                  hover
                  onClick={() => handleRowClick(sign.id)}
                  sx={{ cursor: "pointer", "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <IconButton size="small">
                      {expandedRow === sign.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {sign.name}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body2">
                        {sign.latitude.toFixed(6)}, {sign.longitude.toFixed(6)}
                      </Typography>
                      <Tooltip title="Копировать координаты">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyCoordinates(sign.latitude, sign.longitude)
                          }}
                          sx={{ ml: 1 }}
                        >
                          <Copy size={14} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={getSourceText(sign)}
                      color={
                        sign.sourceGibdd && sign.sourceCommerce ? "secondary" : sign.sourceGibdd ? "primary" : "success"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {sign.mergedStatus ? (
                      <Chip
                        size="small"
                        label={getStatusText(sign.mergedStatus)}
                        color={getStatusColor(sign.mergedStatus) as any}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Без статуса
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow key={`expanded-row-${sign.id}`}>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={expandedRow === sign.id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Подробная информация
                        </Typography>

                        {sign.sourceGibdd && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Данные ГИБДД:
                            </Typography>
                            <Typography variant="body2">{sign.descriptionGibdd || "Нет описания"}</Typography>
                            {sign.gibdd_unical_id && (
                              <Typography variant="caption" display="block">
                                ID ГИБДД: {sign.gibdd_unical_id}
                              </Typography>
                            )}
                          </Box>
                        )}

                        {sign.sourceCommerce && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Данные Коммерции:
                            </Typography>
                            <Typography variant="body2">{sign.descriptionCommerce || "Нет описания"}</Typography>
                            {sign.commerce_internal_id && (
                              <Typography variant="caption" display="block">
                                ID Коммерции: {sign.commerce_internal_id}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}

            {paginatedSigns.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Нет данных, соответствующих выбранным фильтрам
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredSigns.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
      />
    </Box>
  )
}
