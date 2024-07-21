import { useEffect, useState } from "react"
import mapsByBox
 from "../data/maps"
const useSelectedMaps = () => {
  const [maps, setMaps] = useState<string[]>([])

  useEffect(() => {
    const getSelectedMaps = (): string[] => {
      const selectedBoxes = JSON.parse(localStorage.getItem("selectedBoxes") || "[]")
      let maps: string[] = []

      selectedBoxes.forEach((box: string) => {
        if (mapsByBox[box]) {
          maps = [...maps, ...mapsByBox[box].map(map => `${map} (${box})`)]
        }
      })

      return maps
    }

    setMaps(getSelectedMaps())
  }, [])

  return maps
}

export default useSelectedMaps