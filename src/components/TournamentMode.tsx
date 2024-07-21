import React, { useState, useEffect } from "react"
import { Button, Typography, Container } from "@mui/material"

const TournamentMode = () => {
  const [tournamentType, setTournamentType] = useState<string | null>(null)

  useEffect(() => {
    const savedType = localStorage.getItem("tournamentType")
    if (savedType) {
      setTournamentType(savedType)
    }
  }, [])

  useEffect(() => {
    if (tournamentType) {
      localStorage.setItem("tournamentType", tournamentType)
    }
  }, [tournamentType])

  return (
    <Container>
      <Typography variant="h4">Tournament Mode</Typography>
      {!tournamentType && (
        <div>
          <Button variant="contained" onClick={() => setTournamentType("knockout")}>Knockout</Button>
          <Button variant="contained" onClick={() => setTournamentType("kingOfTheHill")}>King of the Hill</Button>
        </div>
      )}
      {tournamentType === "knockout" && <div>Knockout Mode Setup</div>}
      {tournamentType === "kingOfTheHill" && <div>King of the Hill Setup</div>}
    </Container>
  )
}

export default TournamentMode
