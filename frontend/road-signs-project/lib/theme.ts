import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Синий для ГИБДД
    },
    secondary: {
      main: "#9c27b0", // Фиолетовый для совмещенных источников
    },
    success: {
      main: "#2e7d32", // Зеленый для Коммерции
    },
    error: {
      main: "#d32f2f", // Красный для конфликтов
    },
    info: {
      main: "#0288d1", // Голубой для обновленных
    },
    warning: {
      main: "#ed6c02", // Оранжевый для удаленных
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
})
