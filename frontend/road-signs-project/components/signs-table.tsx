"use client"

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
} from "@mui/material"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useSigns } from "@/context/signs-context"

type Order = "asc" | "desc"
type OrderBy = "name" | "source" | "status"

export default function SignsTable() {
  const { signs, filters } = useSigns()
  const [order, setOrder] = useState<Order>("asc")
  const [orderBy, setOrderBy] = useState<OrderBy>("name")
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

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
    if (filters.status.length > 0 && !filters.status.includes(sign.mergedStatus)) {
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
    }

    return order === "desc" ? -comparison : comparison
  })

  // Получение числового значения для сортировки по источнику
  const getSourceValue = (sign: any) => {
    if (sign.sourceGibdd && sign.sourceCommerce) return 3
    if (sign.sourceGibdd) return 2
    if (sign.sourceCommerce) return 1
    return 0
  }

  // Получение числового значения для сортировки по статусу
  const getStatusValue = (status: string) => {
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
  const getStatusColor = (status: string) => {
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
  const getStatusText = (status: string) => {
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
        return status
    }
  }

  // Обработчик раскрытия/скрытия детальной информации о знаке
  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Список дорожных знаков ({sortedSigns.length})
      </Typography>

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
              <TableCell>Координаты</TableCell>
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
            {sortedSigns.map((sign) => (
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
                    {sign.latitude.toFixed(6)}, {sign.longitude.toFixed(6)}
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
                    <Chip
                      size="small"
                      label={getStatusText(sign.mergedStatus)}
                      color={getStatusColor(sign.mergedStatus) as any}
                    />
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
                          <Box sx={{ mb: 2 }} key="gibdd">
                            <Typography variant="subtitle2" gutterBottom>
                              Данные ГИБДД:
                            </Typography>
                            <Typography variant="body2">{sign.descriptionGibdd || "Нет описания"}</Typography>
                            <Typography variant="caption" display="block">
                              Последнее обновление: {new Date(sign.lastUpdateGibdd).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}

                        {sign.sourceCommerce && (
                          <Box sx={{ mb: 2 }} key="commerce">
                            <Typography variant="subtitle2" gutterBottom>
                              Данные Коммерции:
                            </Typography>
                            <Typography variant="body2">{sign.descriptionCommerce || "Нет описания"}</Typography>
                            <Typography variant="caption" display="block">
                              Последнее обновление: {new Date(sign.lastUpdateCommerce).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}

            {sortedSigns.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Нет данных, соответствующих выбранным фильтрам
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
