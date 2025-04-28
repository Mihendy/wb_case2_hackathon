"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ChevronRight, AlertTriangle, RefreshCw } from "lucide-react"
import type { Sign } from "@/types/sign"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SignsTableProps {
  signs: Sign[]
  isLoading: boolean
}

export function SignsTable({ signs, isLoading }: SignsTableProps) {
  const [sortField, setSortField] = useState<keyof Sign>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})

  const toggleSort = (field: keyof Sign) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const toggleRowExpand = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const sortedSigns = [...signs].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue === null) return sortDirection === "asc" ? 1 : -1
    if (bValue === null) return sortDirection === "asc" ? -1 : 1

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    // For numeric values
    const numA = Number(aValue)
    const numB = Number(bValue)

    if (!isNaN(numA) && !isNaN(numB)) {
      return sortDirection === "asc" ? numA - numB : numB - numA
    }

    return 0
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-green-500">New</Badge>
      case "updated":
        return <Badge className="bg-blue-500">Updated</Badge>
      case "conflict":
        return <Badge className="bg-purple-500">Conflict</Badge>
      case "removed":
        return <Badge className="bg-red-500">Removed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "gibdd":
        return <Badge className="bg-green-600">GIBDD</Badge>
      case "commerce":
        return <Badge className="bg-amber-600">Commerce</Badge>
      default:
        return <Badge>{source}</Badge>
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Signs Table</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-auto h-[450px]">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="w-14">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center p-0 h-auto font-semibold"
                  onClick={() => toggleSort("id")}
                >
                  ID
                  {sortField === "id" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center p-0 h-auto font-semibold"
                  onClick={() => toggleSort("name")}
                >
                  Name
                  {sortField === "name" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center p-0 h-auto font-semibold"
                  onClick={() => toggleSort("source")}
                >
                  Source
                  {sortField === "source" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center p-0 h-auto font-semibold"
                  onClick={() => toggleSort("status")}
                >
                  Status
                  {sortField === "status" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p>Loading signs data...</p>
                </TableCell>
              </TableRow>
            ) : sortedSigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                  <p>No signs found</p>
                </TableCell>
              </TableRow>
            ) : (
              sortedSigns.map((sign) => (
                <>
                  <TableRow
                    key={sign.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleRowExpand(sign.id)}
                  >
                    <TableCell className="p-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        {expandedRows[sign.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{sign.id}</TableCell>
                    <TableCell>{sign.name}</TableCell>
                    <TableCell>{getSourceBadge(sign.source)}</TableCell>
                    <TableCell>{getStatusBadge(sign.status)}</TableCell>
                  </TableRow>
                  {expandedRows[sign.id] && (
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={5} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Basic Information</h4>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Name:</span> {sign.name}
                              </p>
                              <p>
                                <span className="font-medium">ID:</span> {sign.id}
                              </p>
                              <p>
                                <span className="font-medium">Source:</span> {sign.source}
                              </p>
                              <p>
                                <span className="font-medium">Status:</span> {sign.status}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Additional Details</h4>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">GIBDD ID:</span> {sign.gibdd_unical_id || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">Commerce ID:</span> {sign.commerce_internal_id || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">Coordinates:</span> {sign.latitude}, {sign.longitude}
                              </p>
                              <p>
                                <span className="font-medium">GIBDD Description:</span>{" "}
                                {sign.gibdd_description || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">Commerce Description:</span>{" "}
                                {sign.commerce_description || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
