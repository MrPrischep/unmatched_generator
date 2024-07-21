import { useState, useEffect } from "react"
import { Box, Button, Typography, Checkbox, FormControlLabel, Divider } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import boxes from "../data/boxes"

const Settings = ({ onBack }: { onBack: () => void }) => {
  const [selectedBoxes, setSelectedBoxes] = useState<string[]>(() => {
    const savedBoxes = localStorage.getItem("selectedBoxes")
    return savedBoxes ? JSON.parse(savedBoxes) : []
  })

  const areAllSelected = boxes.length > 0 && selectedBoxes.length === boxes.length

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedBoxes(boxes)
    } else {
      setSelectedBoxes([])
    }
  }

  const handleCheckboxChange = (box: string) => {
    setSelectedBoxes((prev) =>
      prev.includes(box) ? prev.filter((b) => b !== box) : [...prev, box]
    )
  }

  useEffect(() => {
    localStorage.setItem("selectedBoxes", JSON.stringify(selectedBoxes))
  }, [selectedBoxes])


  useEffect(() => {
    localStorage.setItem("selectedBoxes", JSON.stringify(selectedBoxes))
  }, [selectedBoxes])

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box flex={1} display="flex" flexDirection="column" justifyContent="flex-start" p={3}>
        <Typography variant="h4" gutterBottom>
          Set your boxes
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={areAllSelected}
              onChange={handleSelectAllChange}
            />
          }
          label={<Typography variant="h5">Select All</Typography>}
        />

        <Divider sx={{ mb: 2 }} />

        <Box 
          display="flex"
          flexDirection="column"
          maxHeight="400px"
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
          {boxes.map((box) => (
            <FormControlLabel
              key={box}
              control={
                <Checkbox
                  checked={selectedBoxes.includes(box)}
                  onChange={() => handleCheckboxChange(box)}
                />
              }
              label={<Typography variant="h5">{box}</Typography>}
            />
          ))}
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center" mt="auto">
        <Button onClick={onBack} startIcon={<ArrowBackIcon />} sx={{ fontSize: "1.5rem" }}>
          Back
        </Button>
      </Box>
    </Box>
    
  )
}

export default Settings
