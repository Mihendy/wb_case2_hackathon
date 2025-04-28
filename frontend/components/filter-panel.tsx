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
          Filters
          {(sourceFilter !== "all" || statusFilter !== "all") && (
            <span className="ml-1 rounded-full bg-primary w-2 h-2"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by Source</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sourceFilter} onValueChange={onSourceChange}>
          <DropdownMenuRadioItem value="all">All Sources</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="gibdd">GIBDD</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="commerce">Commerce</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={statusFilter} onValueChange={onStatusChange}>
          <DropdownMenuRadioItem value="all">All Statuses</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="new">New</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="updated">Updated</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="conflict">Conflict</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="removed">Removed</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
