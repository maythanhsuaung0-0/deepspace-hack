import type { CollectionSchema } from 'deepspace/schema'
import { EVENT_FORMATS } from '../types/events'

const readOnly = { read: true, create: false, update: false, delete: false } as const

export const eventsSchema: CollectionSchema = {
  name: 'events',
  columns: [
    { name: 'title', storage: 'text', interpretation: 'plain', required: true, maxLength: 100 },
    { name: 'slug', storage: 'text', interpretation: 'plain', required: true, maxLength: 120, immutable: true },
    { name: 'organizer', storage: 'text', interpretation: 'plain', required: true, maxLength: 100 },
    { name: 'startsAt', storage: 'text', interpretation: { kind: 'datetime' }, required: true },
    { name: 'endsAt', storage: 'text', interpretation: { kind: 'datetime' }, required: true },
    { name: 'city', storage: 'text', interpretation: 'plain', required: true, maxLength: 80 },
    { name: 'country', storage: 'text', interpretation: 'plain', required: true, maxLength: 80 },
    { name: 'format', storage: 'text', interpretation: { kind: 'select', options: [...EVENT_FORMATS] }, required: true },
    { name: 'topics', storage: 'text', interpretation: { kind: 'json' }, required: true },
    { name: 'summary', storage: 'text', interpretation: 'plain', required: true, maxLength: 320 },
    { name: 'sourceLabel', storage: 'text', interpretation: 'plain', required: true, maxLength: 100 },
    { name: 'sourceUrl', storage: 'text', interpretation: { kind: 'url' }, required: true },
    { name: 'registrationUrl', storage: 'text', interpretation: { kind: 'url' }, required: true },
    { name: 'latitude', storage: 'number', interpretation: 'plain' },
    { name: 'longitude', storage: 'number', interpretation: 'plain' },
    { name: 'isDemo', storage: 'number', interpretation: { kind: 'boolean' }, required: true },
  ],
  uniqueOn: ['slug'],
  permissions: {
    '*': readOnly,
    viewer: readOnly,
    member: readOnly,
    admin: { read: true, create: true, update: true, delete: true },
  },
}
