import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    h2: {
      fontSize: "3rem",
      textAlign: "center",
      marginTop: "1rem",
    },
    h3: {
      fontSize: "2.5rem"
    },
    h4: {
      fontSize: "2rem",
      color: "#656565"
    },
    h5: {
      fontSize: "1.5rem",
      margin: 5
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "10px 20px",
          textTransform: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            fontSize: "1.2rem",
          },
          "& .MuiInputBase-root": {
            fontSize: "1.2rem",
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "1.8rem",
          marginBottom: 5,
        },
      },
    },
  },
})

export default theme