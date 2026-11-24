import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'deepspace'
import type { RecordData } from 'deepspace'
import { Seo } from '../../components/Seo'
import { HackAtlasMap } from '../../components/HackAtlasMap'
import {
  eventTopics,
  filterEvents,
  formatDateRange,
  formatEventFormat,
  formatEventLocation,
} from '../../lib/events'
import { seo } from '../../seo'
import { EVENT_FORMATS, type EventFormat, type HackathonEvent } from '../../types/events'

const ALL = 'all'

export default function HackAtlasPage() {
  const { records, status, error } = useQuery<HackathonEvent>('events', {
    orderBy: 'startsAt',
    orderDir: 'asc',
    limit: 100,
  })
  const [query, setQuery] = useState('')
  const [format, setFormat] = useState<EventFormat | typeof ALL>(ALL)
  const [topic, setTopic] = useState(ALL)
  const [selectedId, setSelectedId] = useState<string>()

  const topics = useMemo(() => eventTopics(records), [records])
  const filtered = useMemo(
    () => filterEvents(records, { query, format, topic }),
    [records, query, format, topic],
  )
  const selected = filtered.find((event) => event.recordId === selectedId) ?? filtered[0]
  const cityCount = new Set(records.filter(({ data }) => data.format !== 'online').map(({ data }) => data.city)).size

  useEffect(() => {
    if (selectedId && !filtered.some((event) => event.recordId === selectedId)) {
      setSelectedId(filtered[0]?.recordId)
    }
  }, [filtered, selectedId])

  function resetFilters() {
    setQuery('')
    setFormat(ALL)
    setTopic(ALL)
  }

  function selectEvent(recordId: string) {
    setSelectedId(recordId)
  }

  return (
    <>
      <Seo {...seo} path="/" />
      <div className="atlas-page" data-testid="hackatlas-page">
        <header className="atlas-hero">
          <div className="atlas-hero-card atlas-reveal" data-ui>
            <nav aria-label="Primary">
              <a className="atlas-wordmark" href="#top" aria-label="HackAtlas home">HackAtlas</a>
              <a href="#register">Event register</a>
              <a href="/about">About the data</a>
            </nav>
            <div className="atlas-hero-title" id="top">
              <span>Hack</span>
              <span>Atlas</span>
            </div>
            <div className="atlas-hero-copy atlas-reveal">
              <p className="atlas-hero-facts">Eight demo field notes<br />January—August 2027<br />Public to browse</p>
              <p>Search the register, trace the map, then continue to the source.</p>
            </div>
            <div className="atlas-hero-actions atlas-reveal">
              <span>Synthetic launch catalog</span>
              <a className="atlas-button" href="#atlas">Open the atlas</a>
              <a href="#method">Read the method</a>
            </div>
          </div>
        </header>

        <main>
          <section className="atlas-intro atlas-reveal" id="method">
            <div>
              <h1>One field.<br />Fewer tabs.</h1>
            </div>
            <p>
              HackAtlas keeps date, place, format, topic, and source in one public view. This first
              edition uses clearly marked synthetic records to prove the workflow without inventing real listings.
            </p>
            <div className="atlas-facts" aria-label="Catalog facts">
              <Fact value={status === 'ready' ? String(records.length) : '—'} label="demo listings" />
              <Fact value={status === 'ready' ? String(cityCount) : '—'} label="mapped cities" />
              <Fact value="3" label="event formats" />
              <Fact value="1" label="shared dataset" />
            </div>
          </section>

          <section className="atlas-explorer" id="atlas">
            <div className="atlas-explorer-heading atlas-reveal">
              <h2>Trace the next build.</h2>
              <p>The live legend updates the map, register, count, and selected field note together.</p>
            </div>

            <div className="atlas-controls atlas-reveal" data-ui>
              <label className="atlas-search">
                <span>Search place, topic, or title</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try climate or Berlin"
                />
              </label>
              <fieldset>
                <legend>Format</legend>
                <div className="atlas-choice-row">
                  <Choice active={format === ALL} onClick={() => setFormat(ALL)}>All</Choice>
                  {EVENT_FORMATS.map((value) => (
                    <Choice key={value} active={format === value} onClick={() => setFormat(value)}>
                      {formatEventFormat(value)}
                    </Choice>
                  ))}
                </div>
              </fieldset>
              <label className="atlas-topic">
                <span>Topic</span>
                <select value={topic} onChange={(event) => setTopic(event.target.value)}>
                  <option value={ALL}>All topics</option>
                  {topics.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <p className="atlas-result-count" aria-live="polite">
                {status === 'ready' ? `${filtered.length} of ${records.length} field notes` : 'Opening the register…'}
              </p>
            </div>

            {status === 'error' ? (
              <div className="atlas-state" role="alert">
                <h3>The register did not open.</h3>
                <p>{error ?? 'The realtime record connection could not be established.'}</p>
              </div>
            ) : (
              <div className="atlas-map-detail">
                <HackAtlasMap events={filtered} selectedId={selected?.recordId} onSelect={selectEvent} />
                <EventDetail event={selected} loading={status === 'loading'} onReset={resetFilters} />
              </div>
            )}
          </section>

          <section className="atlas-register" id="register">
            <div className="atlas-register-sheet atlas-reveal" data-ui>
              <h2>The event register.</h2>
              <p className="atlas-register-note">Synthetic entries · ordered by opening date</p>
              {status === 'loading' && <p className="atlas-state-copy">Reading DeepSpace records…</p>}
              {status === 'ready' && filtered.length === 0 && (
                <div className="atlas-empty">
                  <h3>No field notes match.</h3>
                  <p>Clear the legend and take a wider view.</p>
                  <button type="button" onClick={resetFilters}>Reset the atlas</button>
                </div>
              )}
              <div className="atlas-event-list">
                {filtered.map((event) => (
                  <EventRow
                    key={event.recordId}
                    event={event}
                    selected={event.recordId === selected?.recordId}
                    onSelect={selectEvent}
                  />
                ))}
              </div>
              <p className="atlas-register-close">Edition zero · Replace demo records with verified imports before public launch.</p>
            </div>
          </section>

          <section className="atlas-closing atlas-reveal">
            <p>Follow the source.</p>
            <a className="atlas-button" href="#atlas">Choose a field note</a>
          </section>
        </main>

        <footer className="atlas-footer">
          <div className="atlas-footer-mark" aria-hidden="true">
            <span>Hack</span><span>Atlas</span>
          </div>
          <div className="atlas-footer-copy">
            <p>Built on DeepSpace with public records and server-enforced write controls.</p>
            <p>Map tiles © OpenStreetMap contributors via MapLibre demo tiles.</p>
            <a href="#top">Return to the cover</a>
          </div>
        </footer>
      </div>
    </>
  )
}

function Fact({ value, label }: { value: string; label: string }) {
  return <div><strong>{value}</strong><span>{label}</span></div>
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className={active ? 'is-active' : undefined} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  )
}

function EventDetail({
  event,
  loading,
  onReset,
}: {
  event?: RecordData<HackathonEvent>
  loading: boolean
  onReset: () => void
}) {
  if (loading) {
    return <article className="atlas-detail atlas-state" data-ui><p>Reading the selected field note…</p></article>
  }
  if (!event) {
    return (
      <article className="atlas-detail atlas-state" data-ui>
        <h3>Nothing is pinned.</h3>
        <p>The current legend has no matching records.</p>
        <button type="button" onClick={onReset}>Reset the atlas</button>
      </article>
    )
  }

  return (
    <article className="atlas-detail" data-ui aria-live="polite">
      <div className="atlas-detail-meta">
        <span>{event.data.isDemo ? 'Demo event' : 'Verified listing'}</span>
        <span>{formatEventFormat(event.data.format)}</span>
      </div>
      <h3>{event.data.title}</h3>
      <p className="atlas-detail-date">{formatDateRange(event.data.startsAt, event.data.endsAt)}</p>
      <p>{formatEventLocation(event.data)}</p>
      <p className="atlas-detail-summary">{event.data.summary}</p>
      <ul aria-label="Topics">
        {event.data.topics.map((value) => <li key={value}>{value}</li>)}
      </ul>
      <p className="atlas-source-note">{event.data.sourceLabel}. This fixture is not a real event listing.</p>
      <div className="atlas-detail-actions">
        <a className="atlas-button" href={event.data.registrationUrl} target="_blank" rel="noreferrer">View demo source</a>
        <a href={event.data.sourceUrl} target="_blank" rel="noreferrer">Source note</a>
      </div>
    </article>
  )
}

function EventRow({
  event,
  selected,
  onSelect,
}: {
  event: RecordData<HackathonEvent>
  selected: boolean
  onSelect: (recordId: string) => void
}) {
  return (
    <article className={selected ? 'atlas-event-row is-selected' : 'atlas-event-row'}>
      <button type="button" onClick={() => onSelect(event.recordId)} aria-pressed={selected}>
        <span className="atlas-event-date">{formatDateRange(event.data.startsAt, event.data.endsAt)}</span>
        <strong>{event.data.title}</strong>
        <span>{formatEventLocation(event.data)}</span>
        <span>{formatEventFormat(event.data.format)} · {event.data.topics.join(', ')}</span>
      </button>
      <a href={event.data.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Open demo source for ${event.data.title}`}>Source</a>
    </article>
  )
}
