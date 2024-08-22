import { useState, useCallback, useEffect } from "react"
import { Button, Box, IconButton, Typography } from "@mui/material"
import Logo from "./images/Unmatched-logo.png"
import MenuImg from "./images/menu1.jpg"
import BattleMode from "./components/BattleMode"
import Settings from "./components/Settings"
import SettingsIcon from "@mui/icons-material/Settings"
import packageJson from "../package.json";
import TournamentMode from "./components/TournamentMode"
import VisualBracket from "./components/VisualBracket"

interface BracketPair {
  player1: string
  character1?: string
  player2: string
  character2?: string
}

const App = () => {
  const [mode, setMode] = useState<string>(() => {
    return localStorage.getItem("mode") || ""
  })

  const currentVersion = packageJson.version
  const [hasSelectedBoxes, setHasSelectedBoxes] = useState<boolean>(false)
  const [bracket, setBracket] = useState<{ pairs: BracketPair[], luckyPlayer?: string } | null>(null)

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

  const handleBracketGenerated = (newBracket: { pairs: BracketPair[], luckyPlayer?: string }) => {
    setBracket(newBracket)
  }

  useEffect(() => {
    const savedVersion = localStorage.getItem("appVersion")

    if (!savedVersion || savedVersion !== currentVersion) {
      localStorage.clear()
      localStorage.setItem("appVersion", currentVersion)
    }
  }, [currentVersion])

  useEffect(() => {
    const selectedBoxes = JSON.parse(localStorage.getItem("selectedBoxes") || "[]");
    setHasSelectedBoxes(selectedBoxes.length > 0)
  }, [mode])

  console.log("bracket = ", bracket)

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
            {hasSelectedBoxes && <Button
              variant="contained"
              color="primary"
              onClick={() => handleModeChange("tournament")}
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
              Tournament Mode
            </Button>}
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
        {mode === "tournament" && <TournamentMode onBack={ handleBack } onBracketGenerated={handleBracketGenerated} />}
      </Box>
      {mode === "tournament" && bracket && (
        <Box
          flex={2}
          display="flex"
          justifyContent="center"
        >
          <VisualBracket/>
        </Box>
      )}
      {(!mode || !bracket) && (
        <Box
          flex={2}
          sx={{
            background: `url(${MenuImg}) no-repeat center center`,
            backgroundSize: "cover",
          }}
        />
      )}
    </Box>
  )
}

export default App
