import { useEffect, useState } from "react"
import charactersByBox from "../data/characters"

const useSelectedCharacters = () => {
  const [characters, setCharacters] = useState<string[]>([])

  useEffect(() => {
    const getSelectedCharacters = (): string[] => {
      const selectedBoxes = JSON.parse(localStorage.getItem("selectedBoxes") || "[]")
      let characters: string[] = []

      selectedBoxes.forEach((box: string) => {
        if (charactersByBox[box]) {
          characters = [...characters, ...charactersByBox[box]]
        }
      })

      return characters
    }

    setCharacters(getSelectedCharacters())
  }, [])

  return characters
}

export default useSelectedCharacters