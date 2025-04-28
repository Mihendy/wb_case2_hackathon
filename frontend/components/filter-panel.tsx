"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FilterPanelProps {
  onSourceChange: (source: string) => void
  onStatusChange: (status: string) => void
  sourceFilter: string
  statusFilter: string
}

export function FilterPanel({ onSourceChange, onStatusChange, sourceFilter, statusFilter }: FilterPanelProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-10">
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
          {(sourceFilter !== "all" || statusFilter !== "all") && (
            <span className="ml-1 rounded-full bg-primary w-2 h-2"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-[9999]">
        <DropdownMenuLabel>Фильтр по источнику</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sourceFilter} onValueChange={onSourceChange}>
          <DropdownMenuRadioItem value="all">Все источники</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="gibdd">ГИБДД</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="commerce">Коммерция</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Фильтр по статусу</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={statusFilter} onValueChange={onStatusChange}>
          <DropdownMenuRadioItem value="all">Все статусы</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="new">Новый</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="updated">Обновлен</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="conflict">Конфликт</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="removed">Удален</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
