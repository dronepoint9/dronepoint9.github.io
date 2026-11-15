# DronePoint apps: working notes for Claude

Owner: Nick Seres, DronePoint LLC (Buffalo, NY). These are mobile-first apps used in the field on an iPhone.

## Repo map (all under github.com/dronepoint9, served by GitHub Pages)
- `dronepoint9.github.io` : the Hub, the home-screen launcher. One card per app. Owns pilot, aircraft and mission-type data.
- `flight-log` : Field Log. Mission and flight capture, exports a JSON file (export_version 2.2).
- `plans` : Plans. Pre-flight shot plans with animated camera paths. Data-driven by `sites.json` plus one plan JSON per site.
- `field-tracker` : Field Tracker.
- `docs` : Reference Library.

## Conventions
- Each app is a single `index.html` (HTML, CSS and JS in one file) plus `sw.js` and icons. No build step, no frameworks.
- Mobile first. Test every change at 390px wide before pushing.
- Deliver complete updated files, not partial patches.
- No em dashes in written documents and prose (emails, notes, reports, summaries). Dashes are fine as layout glyphs, for example the PDF builder's section title and empty weather boxes.
- Do not add dependencies unless asked.

## Storage (shared)
All apps live on the same origin, so localStorage is shared between them. Keys written by the Hub:
- `dp_pilot` (name, cert, phone, recurrent_training)
- `dp_aircraft` (array of {name, reg})
- `dp_mission_types` (array of strings)
Field Log draft key: `dp_field_log_draft_v2`.
iPhone home-screen icons each keep separate storage, so Field Log must be opened from the Hub to see the Hub's data.

## Service workers
Network-first with cache fallback, and fetches use `{cache:'no-cache'}` because GitHub Pages sends a 10 minute HTTP cache. A Hub service worker handles only the Hub's own paths so other repos are untouched. Bump the cache name only when the precache list changes.

## Deploying
Commit to `main`, push, wait a minute or two for GitHub Pages. Afterwards `git fetch` and compare the remote file against the tested file. The change cannot be seen live from the cloud workspace, so Nick checks on the phone.

## Field Log export (v2.2)
`flights[]` each have `lines[]` (chained missions with no landing in between). Each line: name, mode, commanded_alt_ft, alt_ref (AGL, ASL, ALT where ALT is relative to takeoff), rtk (Fix, Float, Single, None), notes. `mission.base_log` holds start, end, duration_min, minimum_min (240), under_minimum, under_minimum_confirmed. Export is blocked without a base start and end time; under four hours needs a confirmation checkbox. A "No base needed" checkbox skips all of that: the export carries `no_base: true` with empty start and end and no duration, and the entered times stay saved on the phone.

## Open items
- Plans: TBD rise heights on V3, V4, V1 (placeholder 250 ft); Linwood lot lines approximate; P4 at 390 ft AGL is close to the 400 ft limit.
- Office log builder (Python, builds the finished PDF from the JSON) needs updating for export v2.1 and v2.2 (nested lines, base log).
- New all-in-one app is planned in a separate private repo. Do not build it inside these repos.
