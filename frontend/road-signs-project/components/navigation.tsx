"use client"

import type React from "react"

import { Box, Tabs, Tab } from "@mui/material"
import { Map, Table2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    router.push(newValue)
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
      <Tabs value={pathname} onChange={handleChange} aria-label="navigation tabs">
        <Tab icon={<Map size={16} />} iconPosition="start" label="Карта" value="/" />
        <Tab icon={<Table2 size={16} />} iconPosition="start" label="Таблица" value="/table" />
      </Tabs>
    </Box>
  )
}
