# HackAtlas

HackAtlas is a public hackathon discovery demo built on DeepSpace. Visitors can search by place or topic, filter by format, select an event from a MapLibre map or printed-style register, and continue to its source.

The launch catalog is intentionally synthetic. Every fixture is labeled as a demo event and links to `example.com`; replace it with a verified importer before presenting listings as real.

## Stack

- DeepSpace `0.44.2` on Cloudflare Workers
- React 19, Vite, and TypeScript
- SQLite-backed DeepSpace records in a Durable Object
- MapLibre GL JS with MapLibre demo tiles
- Tailwind v4 utilities plus a custom olive-on-bone editorial theme

## Data and access

The `events` collection allows public reads and denies creates, updates, and deletes for anonymous, viewer, and member roles. Only admins may write. The local agent surface is further restricted to the app owner.

`seed_demo_events` is an owner-only agent tool. It uses fixed record IDs and updates existing fixtures, so repeated runs do not create duplicates.

## Local development

```bash
npm install
npx deepspace auth whoami
npx deepspace dev start
```

## Checks

```bash
npm run type-check
npm run lint
npm run test:unit
npx deepspace test run all
```

## Deploy and seed

Commit the worktree before deploying under DeepSpace source control.

```bash
npx deepspace deploy
npx deepspace agent tools hackatlas --json
npx deepspace agent invoke hackatlas seed_demo_events --input-file seed-input.json --json
```

The invocation input is an empty JSON object. Discover the tool first and follow the returned schema; do not assume a stale command contract.
