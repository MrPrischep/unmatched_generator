import { useState, useCallback, useEffect } from "react"
import { Button, Box, IconButton } from "@mui/material"
import Logo from "./images/Unmatched-logo.png"
import MenuImg from "./images/menu1.jpg"
import BattleMode from "./components/BattleMode"
import Settings from "./components/Settings"
import SettingsIcon from "@mui/icons-material/Settings"
// import TournamentMode from "./components/TournamentMode"

const App = () => {
  const [mode, setMode] = useState<string>(() => {
    return localStorage.getItem("mode") || ""
  })

  const [hasSelectedBoxes, setHasSelectedBoxes] = useState<boolean>(false)

  const handleModeChange = useCallback((newMode: string) => {
    setMode(newMode)
    if (newMode) {
      localStorage.setItem("mode", newMode)
    } else {
      localStorage.removeItem("mode")
    }
  }, [])

  const handleBack = () => {
    handleModeChange("")
  }

  useEffect(() => {
    const selectedBoxes = JSON.parse(localStorage.getItem("selectedBoxes") || "[]");
    setHasSelectedBoxes(selectedBoxes.length > 0)
  }, [mode])

  return (
    <Box display="flex" height="100vh">
      <Box
        flex={1}
        bgcolor="white"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        sx={{ position: "relative" }} 
      >
        <Box
          component="img"
          src={Logo}
          alt="Logo"
          sx={{ width: "90%" }}
        />
        {hasSelectedBoxes && !mode && <div style={{ 
          width: "100%",
          display: "flex",
          justifyContent: "end",
          marginRight: "70px"
          }}
        >
          <IconButton
            onClick={() => handleModeChange("settings")}
            sx={{
              display: "flex",
              alignItems: "end",
              color: "primary.main",
              fontSize: "40px"
            }}
          >
            <SettingsIcon fontSize="inherit" />
          </IconButton>
        </div>}

        {!mode && (
          <Box 
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            flexGrow={1}
          >
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => setMode("tournament")}
              sx={{
                mb: 5,
                width: "400px",
                height: "100px",
                borderRadius: "10px",
                fontSize: "1.8rem",
                ":hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Tournament Mode
            </Button> */}
            {hasSelectedBoxes && <Button
              variant="contained"
              color="secondary"
              onClick={() => handleModeChange("battle")}
              sx={{
                mb: 5,
                width: "400px",
                height: "100px",
                borderRadius: "10px",
                fontSize: "1.8rem",
                ":hover": {
                  backgroundColor: "secondary.dark",
                },
                boxShadow: 3,
                transition: "all 0.3s ease",
              }}
            >
              Battle Mode
            </Button>}
            {!hasSelectedBoxes && <Button
              variant="contained"
              color="primary"
              onClick={() => handleModeChange("settings")}
              sx={{
                mb: 5,
                width: "400px",
                height: "100px",
                borderRadius: "10px",
                fontSize: "1.8rem",
                ":hover": {
                  backgroundColor: "primary.dark",
                },
                boxShadow: 3,
                transition: "all 0.3s ease",
              }}
            >
              First set your boxes
            </Button>}
          </Box>
        )}
        {mode === "battle" && <BattleMode onBack={ handleBack } />}
        {mode === "settings" && <Settings onBack={ handleBack } />}
        {/* {mode === "tournament" && <TournamentMode />} */}
      </Box>
      <Box
        flex={2}
        sx={{
          background: `url(${MenuImg}) no-repeat center center`,
          backgroundSize: "cover",
        }}
      >
      </Box>
    </Box>
  )
}

export default App
