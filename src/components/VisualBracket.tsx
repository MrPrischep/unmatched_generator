import { useState, useEffect } from "react"
import { Box, Button, Typography, Checkbox, FormControlLabel, Divider } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import boxes from "../data/boxes"

const VisualBracket = () => {
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
    <Box display="flex" flexDirection="column" justifyContent="center" height="100vh">
        <Typography>Bracket</Typography>
    </Box>    
  )
}

export default VisualBracket
