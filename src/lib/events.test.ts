import { describe, expect, it } from 'vitest'
import type { RecordData } from 'deepspace'
import { DEMO_EVENTS } from '../data/demo-events'
import type { HackathonEvent } from '../types/events'
import { eventTopics, filterEvents, formatDateRange } from './events'

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
})
