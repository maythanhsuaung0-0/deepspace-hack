import { describe, expect, it } from 'vitest'
import type { RecordData } from 'deepspace'
import { DEMO_EVENTS } from '../data/demo-events'
import type { HackathonEvent } from '../types/events'
import { eventSearchFeedback, eventTopics, filterEvents, formatDateRange } from './events'

const records = DEMO_EVENTS.map(({ recordId, data }, index) => ({
  recordId,
  data,
  createdBy: 'owner',
  createdAt: new Date(index).toISOString(),
  updatedAt: new Date(index).toISOString(),
})) as RecordData<HackathonEvent>[]

describe('HackAtlas event helpers', () => {
  it('matches free text across location and topics', () => {
    expect(filterEvents(records, { query: 'climate', format: 'all', topic: 'all' })).toHaveLength(4)
    expect(filterEvents(records, { query: 'berlin', format: 'all', topic: 'all' })[0]?.data.slug)
      .toBe('relay-open-source-weekender')
  })

  it('combines format and topic filters', () => {
    const filtered = filterEvents(records, { query: '', format: 'hybrid', topic: 'Climate' })
    expect(filtered.map(({ data }) => data.slug)).toEqual([
      'northstar-build-weekend',
      'cascade-civic-lab',
    ])
  })

  it('derives a unique sorted legend and stable UTC date range', () => {
    expect(eventTopics(records)).toEqual([...eventTopics(records)].sort())
    expect(formatDateRange('2027-01-16T23:00:00.000Z', '2027-01-18T01:00:00.000Z'))
      .toBe('Jan 16–Jan 18, 2027')
  })

  it('explains every search lifecycle state', () => {
    const base = { pending: false, query: '', resultCount: 8, totalCount: 8 }

    expect(eventSearchFeedback({ ...base, status: 'loading' })).toEqual({
      state: 'loading',
      message: 'Loading events before search…',
    })
    expect(eventSearchFeedback({ ...base, status: 'ready', pending: true })).toEqual({
      state: 'searching',
      message: 'Searching events…',
    })
    expect(eventSearchFeedback({ ...base, status: 'error' })).toEqual({
      state: 'error',
      message: 'Search unavailable. Event data could not be loaded.',
    })
  })

  it('reports search matches, no matches, and an empty source', () => {
    expect(eventSearchFeedback({
      status: 'ready', pending: false, query: 'Berlin', resultCount: 1, totalCount: 8,
    }).message).toBe('1 match for “Berlin”.')
    expect(eventSearchFeedback({
      status: 'ready', pending: false, query: 'Mars', resultCount: 0, totalCount: 8,
    }).message).toBe('No matches for “Mars”. Try another search.')
    expect(eventSearchFeedback({
      status: 'ready', pending: false, query: '', resultCount: 0, totalCount: 0,
    })).toEqual({ state: 'empty', message: 'No events are available to search.' })
  })
})
