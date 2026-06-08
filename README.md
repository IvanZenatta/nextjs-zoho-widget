# Zoho CRM Widget Starter

A static, client-side Zoho CRM widget built with **Vite + React + TypeScript + Tailwind v4**,
wired into the **Zoho Extension Toolkit (ZET)** packaging flow.

## Why this stack (and not Next.js)

A Zoho widget is a static bundle. ZET serves the `app/` folder, you test locally on
port 5000, then `zet validate` / `zet pack` produce the zip you upload. There is no
server in that runtime, the widget loads `widget.html` plus a JS/CSS bundle and talks
to Zoho through the embedded app SDK on the client.

Next.js exists for the server side (SSR, server components, API routes). A static export
strips all of that out, leaving you carrying the framework's weight for none of its
benefit. Vite is purpose-built for static SPA bundles, so it drops straight into ZET.

## Prerequisites

- Node 18+ and npm
- ZET CLI installed globally:
  ```bash
  npm install -g zoho-extension-toolkit
  zet -v
  ```

## Install

```bash
npm install
```

## Develop (fast loop, Vite HMR)

```bash
npm run dev
```

Opens Vite on http://localhost:5173. This runs **outside** the CRM iframe, so
`window.ZOHO` is absent and the widget shows "standalone" mode (no record context).
Use this loop for building UI and component logic quickly.

## Build

```bash
npm run build
```

Type-checks, then bundles into `app/` as `app/widget.html` + `app/assets/...`.
Note the assets use **relative** paths (`./assets/...`) because `vite.config.ts`
sets `base: './'`. This is the single most common reason widgets render blank inside
Zoho, so do not change it.

## Test inside Zoho

```bash
npm run build      # produce the app/ folder first
zet run            # serves on port 5000
```

`zet run` serves the built widget at http://127.0.0.1:5000/app/widget.html. Load it
into your sandbox to see live `PageLoad` context (Module + Record ID populate the card).

## Validate and pack for upload

```bash
npm run validate   # build + zet validate
npm run pack       # build + zet pack -> produces the upload zip
```

## Key files

| File | Role |
| --- | --- |
| `widget.html` | Vite entry. Loads the Zoho SDK from CDN + the React bundle. Builds to `app/widget.html`. |
| `vite.config.ts` | `base: './'`, output to `app/`, entry kept as `widget.html`. |
| `plugin-manifest.json` | ZET extension config. Defines widget location, currently `crm.detailview.actions`. |
| `src/zoho.ts` | Wraps the SDK `PageLoad` + `init()` handshake into one `await initZoho()`. |
| `src/global.d.ts` | TypeScript types for the `window.ZOHO` namespace. Extend as you call more APIs. |
| `src/App.tsx` | Placeholder UI showing init status and the record context. |

## Changing the widget location

Edit the `location` field in `plugin-manifest.json` (e.g. `crm.detailview.rightpanel`,
`crm.relatedlist`, a button location, etc.). If Zoho updates the manifest schema, run
`zet init` in a scratch folder to see the current canonical format and reconcile.

## Next steps

In `src/App.tsx`, once you have `entity` and `entityId` from the context, call:

```ts
const res = await window.ZOHO!.CRM.API.getRecord({ Entity: entity, RecordID: entityId })
```

to load the full record, then build your UI around it.
