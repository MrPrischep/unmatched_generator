import { useState, useEffect, useCallback } from "react"
import { Box, Button, Typography, TextField, RadioGroup, FormControlLabel, Radio, Checkbox, FormControl, FormLabel } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import useSelectedCharacters from "../hooks/useSelectedCharacters"
import useSelectedMaps from "../hooks/useSelectedMaps"
import RefreshIcon from "@mui/icons-material/Refresh"

interface GameData {
  teams: { teamName: string; members: { name: string; character: string }[] }[]
  field: string
  isTeamMode: boolean
}

const BattleMode = ({ onBack }: { onBack: () => void }) => {
  const characters = useSelectedCharacters()
  const maps = useSelectedMaps()

  const [step, setStep] = useState<number>(() => {
    const savedState = localStorage.getItem("battleModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.step
    }
    return 1
  })

  const [numPlayers, setNumPlayers] = useState<number>(() => {
    const savedState = localStorage.getItem("battleModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.numPlayers
    }
    return 2
  })
  
  const [playerNames, setPlayerNames] = useState<string[]>(() => {
    const savedState = localStorage.getItem("battleModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.playerNames
    }
    return Array(2).fill("")
  })

  const [isTeamMode, setIsTeamMode] = useState<boolean>(() => {
    const savedState = localStorage.getItem("battleModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.isTeamMode
    }
    return false
  })

  const [randomField, setRandomField] = useState<boolean>(() => {
    const savedState = localStorage.getItem("battleModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.randomField
    }
    return true
  })

  const [gameData, setGameData] = useState<GameData | null>(() => {
    const savedState = localStorage.getItem("battleModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.gameData
    }
    return null
  })

  const [nameErrors, setNameErrors] = useState<boolean[]>(Array(2).fill(false))

  const handlePlayerNameChange = (index: number, name: string) => {
    const updatedNames = [...playerNames]
    updatedNames[index] = name
    setPlayerNames(updatedNames)
  
    const duplicateIndices = findDuplicateIndices(updatedNames)
    const updatedErrors = updatedNames.map((_, idx) => duplicateIndices.includes(idx))
    setNameErrors(updatedErrors)
  }

  const handleGenerate = useCallback(() => {
    const shuffledNames = shuffleArray([...playerNames])
    const shuffledMaps = shuffleArray([...maps])
    const shuffledCharacters = shuffleArray([...characters])
    const assignedCharacters = shuffledCharacters.slice(0, numPlayers)

    const field = randomField ? shuffledMaps[Math.floor(Math.random() * shuffledMaps.length)] : "No Field"

    const players = shuffledNames.map((name, index) => ({
      name,
      character: assignedCharacters[index],
    }));

    const teamPlayers = isTeamMode ? [
      { teamName: "Team 1", members: players.slice(0, numPlayers / 2) },
      { teamName: "Team 2", members: players.slice(numPlayers / 2) },
    ] : [{ teamName: "Players", members: players }]

    const data = {
      teams: teamPlayers,
      field,
      isTeamMode,
    }

    setGameData(data)
    setStep(3)
  }, [playerNames, maps, characters, numPlayers, isTeamMode, randomField])

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      const duplicateIndices = findDuplicateIndices(playerNames)
      if (duplicateIndices.length > 0) {
        const updatedErrors = playerNames.map((_, index) => duplicateIndices.includes(index))
        setNameErrors(updatedErrors)
      } else {
        handleGenerate()
      }
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      localStorage.removeItem("battleModeState")
      onBack()
    }
  }

  const findDuplicateIndices = (arr: string[]) => {
    const duplicates: number[] = []
    const nameCount = arr.reduce((acc, name) => {
      acc[name] = (acc[name] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
  
    arr.forEach((name, index) => {
      if (name.trim() && nameCount[name] > 1) {
        duplicates.push(index)
      }
    })
    return duplicates
  }

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array;
  }

  useEffect(() => {
    const stateToSave = {
      step,
      numPlayers,
      playerNames,
      isTeamMode,
      randomField,
      gameData,
    }
    localStorage.setItem("battleModeState", JSON.stringify(stateToSave))
  }, [step, numPlayers, playerNames, isTeamMode, randomField, gameData])

  useEffect(() => {
    if(isTeamMode) {
      setNumPlayers(4)
      setPlayerNames(Array(4).fill(""))
      setNameErrors(Array(4).fill(false))
    } else {
      setPlayerNames(Array(numPlayers).fill(""))
      setNameErrors(Array(numPlayers).fill(false))
    }
  }, [isTeamMode, numPlayers])

  const hasDuplicates = findDuplicateIndices(playerNames).length > 0

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100%" padding="0px 10px">
      <Box flex={1} display="flex" flexDirection="column" justifyContent="flex-start" >
        <Typography variant="h3" gutterBottom>
          Battle Mode Setup
        </Typography>
        {step === 1 && (
          <Box display="flex" flexDirection="column">
            <FormControl component="fieldset" sx={{ mb: 1 }}>
              <FormLabel component="legend">Game Mode</FormLabel>
              <RadioGroup
                value={isTeamMode ? "team" : "deathmatch"}
                onChange={(e) => setIsTeamMode(e.target.value === "team")}
              >
                <FormControlLabel value="deathmatch" control={<Radio />} label={<Typography variant="h5">Deathmatch</Typography>} />
                <FormControlLabel value="team" control={<Radio />} label={<Typography variant="h5">Team Mode</Typography>} />
              </RadioGroup>
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Number of Players</FormLabel>
              <RadioGroup
                value={numPlayers}
                onChange={(e) => setNumPlayers(Number(e.target.value))}
              >
                {!isTeamMode && <FormControlLabel value={2} control={<Radio />} label={<Typography variant="h5">2 Players</Typography>} />}
                {!isTeamMode && <FormControlLabel value={3} control={<Radio />} label={<Typography variant="h5">3 Players</Typography>} />}
                <FormControlLabel value={4} control={<Radio />} label={<Typography variant="h5">4 Players</Typography>} />
                {!isTeamMode && <FormControlLabel value={5} control={<Radio />} label={<Typography variant="h5">5 Players</Typography>} />}
              </RadioGroup>
            </FormControl>

            <FormLabel component="legend">Random Field</FormLabel>
            <FormControlLabel
              control={<Checkbox checked={randomField} onChange={(e) => setRandomField(e.target.checked)} />}
              label={<Typography variant="h5">Choose Random Field</Typography>}
            />
          </Box>
        )}

        {step === 2 && (
          <Box display="flex" flexDirection="column" justifyContent="flex-start">
            <FormLabel sx={{ mb: 1 }}>Enter Player Names</FormLabel>

            {Array.from({ length: numPlayers }).map((_, index) => (
              <Box key={index} sx={{ mb: 1, width: "300px", height: "80px" }}>
                <TextField
                  key={index}
                  label={`Player ${index + 1} Name`}
                  error={nameErrors[index]}
                  helperText={nameErrors[index] ? "Duplicate name" : ""}
                  value={playerNames[index]}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  sx={{ 
                    mb: 1, 
                    "& .MuiInputLabel-root": { fontSize: "1.2rem" }, 
                    "& .MuiInputBase-root": { fontSize: "1.2rem" },
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        {step === 3 && gameData && (
          <Box display="flex" flexDirection="column">
            <Box>
              {gameData.teams.map((team: any, teamIndex: number) => (
                <Box key={teamIndex} mb={3}>
                <Typography variant="h4" sx={{ mb: 1, mt: 1}}>{team.teamName}</Typography>
                {team.members.map((player: any, index: number) => (
                  <Box key={index} display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h5">{index + 1}. {player.name}</Typography>
                    <Typography variant="h5" sx={{ fontFamily: "Roboto", fontWeight: 600 }}>{player.character}</Typography>
                  </Box>
                ))}
              </Box>
              ))}
              {randomField && (
                <>
                <Typography variant="h4" sx={{ mb: 1, mt: 1}}>Field</Typography>
                <Typography variant="h5">{gameData.field}</Typography>
                </>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center" mt="auto" gap={10}>
        {step !== 3 && <Button onClick={handleBack} startIcon={<ArrowBackIcon />} sx={{ fontSize: "1.5rem" }}>
          Back
        </Button>}
        {step !== 3 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={step === 2 && (playerNames.some(name => name.trim() === "") || hasDuplicates)}
            sx={{
              width: "200px",
              height: "60px",
              fontSize: "1.5rem",
            }}
          >
            {step === 1 ? "Next" : "Confirm"}
          </Button>
        )}
        {step === 3 && (
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleGenerate}
              sx={{
                width: "60px",
                height: "60px",
                fontSize: "1.5rem",
                backgroundColor: "white",
                color: "primary.main",
                ":hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                }
              }}
            >
              <RefreshIcon />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setStep(1)
                localStorage.removeItem("battleModeState")
                onBack()
              }}
              sx={{
                width: "200px",
                height: "60px",
                fontSize: "1.5rem",
              }}
            >
              Finish
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default BattleMode