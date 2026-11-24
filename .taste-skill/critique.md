# HackAtlas visual critique

ROUND 1

Seen in one second: a giant HACKATLAS title printed on a bone atlas cover.

Idea (one sentence): HackAtlas's shared event coordinates and dates become a folded two-ink atlas plate and printed event register.

Live thing: the search, format, and topic legend changes the count, map, selected detail, and register from one filtered record set.

Layout words by section: hero=object cover / intro=split facts / explorer=control band and split plate / register=printed sheet / close=statement / footer=block mark.

Scores: design 6.5 · usability 8.0 · creativity 8.0 · content 7.5 → overall 7.4.

Caps applied: design is capped at 6.5 because the launch edition intentionally uses no photographs or footage. Adding venue or participant imagery to synthetic events could falsely imply that those places or people belong to the demo listings. The working map and real product interface are the honest visual material.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. `desktop-fold.jpg`: the long cover wordmark presses beyond the paper edge and pulls the right-hand navigation with it. Constrain every cover child, clip the title to the paper, and reduce the desktop title from 168px to about 150px.
2. `desktop-page-02.jpg`: the register is underfilled in local inspection because production records have not been seeded. Invoke the owner-only seed tool after the first deploy, then inspect the live catalog at its real density.
3. `desktop-page-01.jpg`: the local map shows its outage fallback because the browser sandbox cannot load external demo tiles. Keep the explicit register fallback, then verify the MapLibre style and markers on the public URL before handoff.

The mobile composition is distinct rather than compressed: the atlas cover stacks, facts become two columns, controls become thumb-sized rows, the map/detail stack, and the printed register stays full width. No measured failures remain after the title collision and closing-line fixes.
