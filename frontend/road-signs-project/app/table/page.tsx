"use client"

import { useState } from "react"
import { Container, Box, Typography, Paper, Button } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

import { SignsProvider } from "@/context/signs-context"
import { theme } from "@/lib/theme"
import RefreshButton from "@/components/refresh-button"
import SearchBar from "@/components/search-bar"

const FilterPanel = dynamic(() => import("@/components/filter-panel"), { ssr: false })
const EnhancedSignsTable = dynamic(() => import("@/components/enhanced-signs-table"), { ssr: false })

export default function TablePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: 2,
        }}
      >
        <Alert severity="error" sx={{ width: "100%", maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SignsProvider>
        <Container maxWidth={false} sx={{ py: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Link href="/" passHref>
              <Button startIcon={<ArrowLeft size={16} />} variant="outlined" sx={{ mr: 2 }}>
                Вернуться на карту
              </Button>
            </Link>
            <Typography variant="h4" component="h1">
              Таблица дорожных знаков
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <SearchBar />
            <RefreshButton />
          </Box>

          <Paper sx={{ p: 2, mb: 3 }}>
            <FilterPanel />
          </Paper>

          <Paper sx={{ p: 2 }}>
            <EnhancedSignsTable />
          </Paper>
        </Container>
      </SignsProvider>
    </ThemeProvider>
  )
}
