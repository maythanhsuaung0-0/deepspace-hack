import { useEffect, useRef, useState } from 'react'
import {
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  setWorkerUrl,
} from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import type { RecordData } from 'deepspace'
import type { HackathonEvent } from '../types/events'

interface HackAtlasMapProps {
  events: RecordData<HackathonEvent>[]
  selectedId?: string
  onSelect: (recordId: string) => void
}

const MAP_STYLE = 'https://demotiles.maplibre.org/style.json'

setWorkerUrl(mapWorkerUrl)

export function HackAtlasMap({ events, selectedId, onSelect }: HackAtlasMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef<Marker[]>([])
  const [mapFailed, setMapFailed] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    let styleLoaded = false
    const map = new MapLibreMap({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [-31, 38],
      zoom: 1.1,
      minZoom: 0.7,
      attributionControl: { compact: true },
    })
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right')
    map.once('load', () => {
      styleLoaded = true
      setMapFailed(false)
    })
    map.on('error', () => {
      if (!styleLoaded) setMapFailed(true)
    })
    mapRef.current = map

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    const plotted = events.filter(
      ({ data }) => typeof data.longitude === 'number' && typeof data.latitude === 'number',
    )
    const bounds = new LngLatBounds()

    for (const event of plotted) {
      const markerButton = document.createElement('button')
      markerButton.type = 'button'
      markerButton.className = `atlas-marker${event.recordId === selectedId ? ' is-selected' : ''}`
      markerButton.setAttribute('aria-label', `Select ${event.data.title}`)
      markerButton.title = event.data.title
      markerButton.addEventListener('click', () => onSelect(event.recordId))

      const longitude = event.data.longitude as number
      const latitude = event.data.latitude as number
      const marker = new Marker({ element: markerButton, anchor: 'center' })
        .setLngLat([longitude, latitude])
        .addTo(map)
      markersRef.current.push(marker)
      bounds.extend([longitude, latitude])
    }

    if (plotted.length === 1) {
      map.easeTo({
        center: [plotted[0].data.longitude as number, plotted[0].data.latitude as number],
        zoom: 5,
        duration: 700,
      })
    } else if (plotted.length > 1) {
      map.fitBounds(bounds, { padding: 72, maxZoom: 4, duration: 700 })
    }
  }, [events, onSelect, selectedId])

  return (
    <div className="atlas-map-shell" data-ui data-testid="atlas-map">
      <div ref={containerRef} className="atlas-map" aria-label="Map of filtered hackathons" />
      {mapFailed && (
        <div className="atlas-map-fallback" role="status">
          <p>Map tiles are unavailable.</p>
          <span>The event register below is still complete.</span>
        </div>
      )}
      <p className="atlas-map-note">Online-only events stay in the register and are not pinned.</p>
    </div>
  )
}
