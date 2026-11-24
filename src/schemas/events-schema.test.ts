import { describe, expect, it } from 'vitest'
import { DEMO_EVENTS } from '../data/demo-events'
import { eventsSchema } from './events-schema'

describe('events collection contract', () => {
  it('allows public reads but denies every public write', () => {
    expect(eventsSchema.permissions['*']).toEqual({
      read: true,
      create: false,
      update: false,
      delete: false,
    })
    expect(eventsSchema.permissions.member?.create).toBe(false)
    expect(eventsSchema.permissions.admin).toEqual({
      read: true,
      create: true,
      update: true,
      delete: true,
    })
  })

  it('keeps demo ids and slugs unique and source URLs explicit', () => {
    expect(new Set(DEMO_EVENTS.map(({ recordId }) => recordId)).size).toBe(DEMO_EVENTS.length)
    expect(new Set(DEMO_EVENTS.map(({ data }) => data.slug)).size).toBe(DEMO_EVENTS.length)
    for (const { data } of DEMO_EVENTS) {
      expect(data.isDemo).toBe(true)
      expect(data.sourceLabel).toMatch(/synthetic/i)
      expect(() => new URL(data.sourceUrl)).not.toThrow()
    }
  })
})
