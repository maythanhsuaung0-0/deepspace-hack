import type { RecordData } from 'deepspace'
import type { EventFormat, HackathonEvent } from '../types/events'

export interface EventFilters {
  query: string
  format: EventFormat | 'all'
  topic: string
}

export function filterEvents(
  records: RecordData<HackathonEvent>[],
  filters: EventFilters,
): RecordData<HackathonEvent>[] {
  const query = filters.query.trim().toLocaleLowerCase()

  return records.filter(({ data }) => {
    if (filters.format !== 'all' && data.format !== filters.format) return false
    if (filters.topic !== 'all' && !data.topics.includes(filters.topic)) return false
    if (!query) return true

    return [
      data.title,
      data.organizer,
      data.city,
      data.country,
      data.summary,
      ...data.topics,
    ].some((value) => value.toLocaleLowerCase().includes(query))
  })
}

export function eventTopics(records: RecordData<HackathonEvent>[]): string[] {
  return [...new Set(records.flatMap(({ data }) => data.topics))].sort((a, b) => a.localeCompare(b))
}

const dateFormat = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

export function formatDateRange(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  const year = end.getUTCFullYear()
  return `${dateFormat.format(start)}–${dateFormat.format(end)}, ${year}`
}

export function formatEventLocation(event: HackathonEvent): string {
  return event.format === 'online' ? 'Online · Worldwide' : `${event.city}, ${event.country}`
}

export function formatEventFormat(format: EventFormat): string {
  if (format === 'in-person') return 'In person'
  return format.charAt(0).toUpperCase() + format.slice(1)
}
