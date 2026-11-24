import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { seo } from '../seo'

export default function AboutPage() {
  return (
    <>
      <Seo {...seo} title="About HackAtlas" path="/about" />
      <main className="atlas-about" data-testid="static-about">
        <Link to="/">HackAtlas</Link>
        <h1>A truthful atlas starts with its sources.</h1>
        <p>
          HackAtlas is a DeepSpace demonstration of a public, storage-backed hackathon catalog.
          The launch edition contains synthetic events only, visibly labeled throughout the interface.
        </p>
        <p>
          The records live in DeepSpace&apos;s SQLite-backed record room. Public visitors may read them;
          schema permissions deny public creation, edits, and deletion. A verified importer can replace
          the demo edition later without changing the discovery interface.
        </p>
        <Link className="atlas-button" to="/">Open the atlas</Link>
      </main>
    </>
  )
}
