import { useState, useEffect } from "react"
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, FormControlLabel, FormLabel, Checkbox } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import useSelectedCharacters from "../hooks/useSelectedCharacters"

interface BracketPair {
  player1: string
  character1?: string
  player2: string
  character2?: string
}

interface TournamentModeProps {
  onBack: () => void
  onBracketGenerated: (bracket: { pairs: BracketPair[], luckyPlayer?: string }) => void
}

const TournamentMode = ({ onBack, onBracketGenerated }: TournamentModeProps) => {
  const characters = useSelectedCharacters()

  const [step, setStep] = useState<number>(() => {
    const savedState = localStorage.getItem("tournamentModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.step
    }
    return 1
  })

  const [numPlayers, setNumPlayers] = useState<number>(() => {
    const savedState = localStorage.getItem("tournamentModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.numPlayers
    }
    return 2
  })

  const [playerNames, setPlayerNames] = useState<string[]>(() => {
    const savedState = localStorage.getItem("tournamentModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.playerNames
    }
    return Array(2).fill("")
  })

  const [tournamentType, setTournamentType] = useState<string>(() => {
    const savedState = localStorage.getItem("tournamentModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.tournamentType
    }
    return "single-elimination"
  })

  const [randomField, setRandomField] = useState<boolean>(() => {
    const savedState = localStorage.getItem("tournamentModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.randomField
    }
    return true
  })

  const [randomCharacters, setRandomCharacters] = useState<boolean>(() => {
    const savedState = localStorage.getItem("tournamentModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.randomCharacters
    }
    return true
  })

  const [oneCharacter, setOneCharacter] = useState<boolean>(() => {
    const savedState = localStorage.getItem("tournamentModeState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return parsedState.oneCharacter
    }
    return true
  })

  const [nameErrors, setNameErrors] = useState<boolean[]>(Array(2).fill(false))

  const [bracket, setBracket] = useState<{ pairs: BracketPair[], luckyPlayer?: string }>(() => {
    const savedState = localStorage.getItem("tournamentModeBracket")
    if (savedState) {
      return JSON.parse(savedState)
    }
    return { pairs: [] }
  })

  const handlePlayerNameChange = (index: number, name: string) => {
    const updatedNames = [...playerNames]
    updatedNames[index] = name
    setPlayerNames(updatedNames)
  
    const duplicateIndices = findDuplicateIndices(updatedNames)
    const updatedErrors = updatedNames.map((_, idx) => duplicateIndices.includes(idx))
    setNameErrors(updatedErrors)
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

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      const duplicateIndices = findDuplicateIndices(playerNames)
      if (duplicateIndices.length > 0) {
        const updatedErrors = playerNames.map((_, index) => duplicateIndices.includes(index))
        setNameErrors(updatedErrors)
      } else {
        handleGenerateBracket()
      }
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      localStorage.removeItem("tournamentModeState")
      localStorage.removeItem("tournamentModeBracket")
      onBack()
    }
  }

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array;
  }

  const handleGenerateBracket = () => {
    const shuffledNames = shuffleArray([...playerNames])
    const assignedCharacters = randomCharacters ? shuffleArray([...characters]).slice(0, numPlayers) : []

    const pairs: BracketPair[] = []
    let luckyPlayer: string | undefined

    for (let i = 0; i < shuffledNames.length - 1; i += 2) {
      pairs.push({
        player1: shuffledNames[i],
        character1: randomCharacters ? assignedCharacters[i] : undefined,
        player2: shuffledNames[i + 1],
        character2: randomCharacters ? assignedCharacters[i + 1] : undefined,
      })
    }

    if (shuffledNames.length % 2 !== 0) {
      luckyPlayer = shuffledNames[shuffledNames.length - 1]
    }

    const newBracket = { pairs, luckyPlayer }
    setBracket(newBracket)
    localStorage.setItem("tournamentModeBracket", JSON.stringify(newBracket))
    setStep(3)
    onBracketGenerated(newBracket)
  }

  useEffect(() => {
    const stateToSave = {
      step,
      numPlayers,
      playerNames,
      tournamentType,
      randomField,
      randomCharacters,
      oneCharacter
    }
    localStorage.setItem("tournamentModeState", JSON.stringify(stateToSave))
  }, [step, numPlayers, playerNames, tournamentType, randomField, randomCharacters, oneCharacter])

  useEffect(() => {
    setPlayerNames(Array(numPlayers).fill(""))
    setNameErrors(Array(numPlayers).fill(false))
  }, [numPlayers])

  const hasDuplicates = findDuplicateIndices(playerNames).length > 0

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="90%">
      <Box flex={1} display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center">
        {step !== 3 && (
          <Typography variant="h3" gutterBottom>
          Tournament Mode Setup
          </Typography>
        )}
        {step === 1 && (
          <Box display="flex" flexDirection="column">
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Tournament Type</FormLabel>
              <Select
                value={tournamentType}
                onChange={(e) => setTournamentType(e.target.value)}
              >
                <MenuItem value="single-elimination">Single Elimination</MenuItem>
                <MenuItem value="long-tournament" disabled>Long Tournament (coming soon)</MenuItem>
              </Select>
            </FormControl>

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Number of Players</FormLabel>
              <TextField
                type="number"
                value={numPlayers}
                onChange={(e) => setNumPlayers(Number(e.target.value))}
                inputProps={{ min: 2, max: 16 }}
                error={numPlayers < 2 || numPlayers > 16}
              />
            </FormControl>

            <FormControl component="fieldset">
              <FormLabel component="legend">Game Settings</FormLabel>
              <FormControlLabel
                control={<Checkbox checked={randomCharacters} onChange={(e) => setRandomCharacters(e.target.checked)} />}
                label={<Typography variant="h5">Choose Random Characters</Typography>}
              />
              <FormControlLabel
                control={<Checkbox checked={randomField} onChange={(e) => setRandomField(e.target.checked)} />}
                label={<Typography variant="h5">Choose Random Field</Typography>}
              />
              <FormControlLabel
                control={<Checkbox checked={oneCharacter} onChange={(e) => setOneCharacter(e.target.checked)} />}
                label={<Typography variant="h5">One character for the whole tournament</Typography>}
              />
            </FormControl>
          </Box>
        )}

        {step === 2 && (
          <Box display="flex" flexDirection="column" justifyContent="flex-start">
            <FormLabel sx={{ mb: 1 }}>Enter Player Names</FormLabel>
            
            <Box
              maxHeight="430px"
              sx={{
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: '8px',
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: '#c0c0c0',
                  borderRadius: '4px',
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: 'transparent',
                },
              }}
            >
            {Array.from({ length: numPlayers }).map((_, index) => (
              <Box key={index} sx={{ mt: 1, mb: 1, height: "80px" }}>
                <TextField
                  key={index}
                  label={`Player ${index + 1} Name`}
                  error={nameErrors[index]}
                  helperText={nameErrors[index] ? "Duplicate name" : ""}
                  value={playerNames[index]}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  sx={{ 
                    mb: 1,
                    width: "98%",
                    "& .MuiInputLabel-root": { fontSize: "1.2rem" }, 
                    "& .MuiInputBase-root": { fontSize: "1.2rem" },
                  }}
                />
              </Box>
            ))}
            </Box>
          </Box>
        )}

        {step === 3 && (
          <Box width="100%" display="flex" flexDirection="column">
            <Typography display="flex" justifyContent="center" variant="h4" mb={2}>Tournament Bracket</Typography>
              <Box
                maxHeight="470px"
                sx={{
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: '8px',
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: '#c0c0c0',
                    borderRadius: '4px',
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {bracket.pairs.map((pair, index) => (
                  <Box display="flex" justifyContent="space-around" alignItems="center" mb={2}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Typography key={index} variant="h6">
                        {pair.player1}
                      </Typography>
                      {randomCharacters && (
                        <Typography key={index} variant="h6" sx={{ fontFamily: "Roboto", fontWeight: 600 }}>
                          {pair.character1}
                        </Typography>
                      )}
                    </Box>

                    <Typography key={index} variant="h6">
                      vs
                    </Typography>

                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Typography key={index} variant="h6">
                        {pair.player2}
                      </Typography>
                      {randomCharacters && (
                        <Typography key={index} variant="h6" sx={{ fontFamily: "Roboto", fontWeight: 600 }}>
                          {pair.character2}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
                {bracket.luckyPlayer && (
                  <Typography variant="h6" color="error" display="flex" justifyContent="center" mt={1}>
                    {bracket.luckyPlayer} is the lucky player!
                  </Typography>
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
            disabled={(step === 2 && (playerNames.some(name => name.trim() === "") || hasDuplicates)) || (numPlayers < 2 || numPlayers > 16) || (randomCharacters && characters.length < numPlayers)}
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
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setStep(1)
              localStorage.removeItem("tournamentModeState")
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
        )}
      </Box>
    </Box>
  )
}

export default TournamentMode
