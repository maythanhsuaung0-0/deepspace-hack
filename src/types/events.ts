export const EVENT_FORMATS = ['in-person', 'hybrid', 'online'] as const

export type EventFormat = (typeof EVENT_FORMATS)[number]

export interface HackathonEvent {
  title: string
  slug: string
  organizer: string
  startsAt: string
  endsAt: string
  city: string
  country: string
  format: EventFormat
  topics: string[]
  summary: string
  sourceLabel: string
  sourceUrl: string
  registrationUrl: string
  latitude?: number
  longitude?: number
  isDemo: boolean
}

export interface EventFixture {
  recordId: string
  data: HackathonEvent
}
