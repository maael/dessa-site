import { useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerZoomLevelSize = {
  2: 80000,
  3: 60000,
  4: 50000,
  5: 40000,
  6: 30000,
  7: 20000,
}

export default function Map({ playerX = 0, playerY = 0 }: { playerX?: number; playerY?: number }) {
  return (
    <MapContainer
      center={[playerX, playerY]}
      zoom={3}
      minZoom={2}
      maxZoom={7}
      style={{ height: '100%', width: '100%', background: '#032A32' }}
    >
      <TileLayer
        url="https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg"
        subdomains={['1', '2', '3', '4']}
        noWrap={true}
      />
      <Setup />
      <Player x={playerX} y={playerY} />
    </MapContainer>
  )
}

function Setup() {
  const map = useMap()
  const unproject = useCallback((coord: any) => map.unproject(coord, map.getMaxZoom()), [map])
  useEffect(() => {
    const continent_dims = [49152, 49152]
    const mapbounds = new L.LatLngBounds(unproject([0, 0]), unproject(continent_dims)) // northwest, southeast
    map.setMaxBounds(mapbounds)

    // Set the default viewport position (in this case the midpoint) and zoom (in this case zoom level 1)
    map.setView(unproject([continent_dims[0] / 2, continent_dims[1] / 2]), 3)
  }, [unproject, map])
  return null
}

function Player({ x = 0, y = 0 }: { x?: number; y?: number }) {
  const map = useMap()
  const unproject = useCallback((coord: [number, number]) => map.unproject(coord, map.getMaxZoom()), [map])
  useEffect(() => {
    map.setView(unproject([x, y]), map.getZoom())
  }, [map, x, y, unproject])
  return (
    <Circle
      center={unproject([x, y])}
      radius={markerZoomLevelSize[map.getZoom()]}
      fillColor="#00FF00"
      fill
      fillOpacity={0}
    />
  )
}
