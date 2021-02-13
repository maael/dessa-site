import { useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ObservatoryCharacterData } from '../../types/observatory'

const markerZoomLevelSize = {
  2: 80000,
  3: 60000,
  4: 50000,
  5: 40000,
  6: 30000,
  7: 20000,
}

export default function Map({ players, selected }: { players: ObservatoryCharacterData[]; selected?: string }) {
  return (
    <MapContainer
      center={[0, 0]}
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
      {players.map((p) => (
        <Player key={p.charName} x={p.player.x} y={p.player.y} isSelected={selected === p.charName} />
      ))}
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

function Player({ x = 0, y = 0, isSelected }: { x?: number; y?: number; isSelected: boolean }) {
  const map = useMap()
  const unproject = useCallback((coord: [number, number]) => map.unproject(coord, map.getMaxZoom()), [map])
  useEffect(() => {
    map.setView(unproject([x, y]), map.getZoom())
  }, [map, x, y, unproject])
  return x === 0 && y === 0 ? null : (
    <Circle
      center={unproject([x, y])}
      radius={markerZoomLevelSize[map.getZoom()]}
      //This doesn't work
      fillColor={isSelected ? '#00FFFF' : '#00FF00'}
      fill
      fillOpacity={0}
    />
  )
}
