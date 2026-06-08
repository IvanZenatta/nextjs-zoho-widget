// Thin wrapper around the Zoho Embedded App SDK lifecycle.
//
// The CRM passes record context through the "PageLoad" event, which fires once
// the widget is mounted inside Zoho. You must register the handler BEFORE
// calling init(). This helper folds that handshake into a single promise so the
// React layer can just `await initZoho()`.

export interface WidgetContext {
  /** Module name, e.g. "Deals", "Contacts". null when running standalone. */
  entity: string | null
  /** The record id the widget was opened from. null when running standalone. */
  entityId: string | null
  /** Raw PageLoad payload, for fields this wrapper does not model yet. */
  raw: ZohoPageLoadData | null
}

const STANDALONE: WidgetContext = { entity: null, entityId: null, raw: null }

// The PageLoad handshake is a one-shot global side effect: init() can only run
// once per page, and the SDK fires PageLoad a single time. We cache the promise
// at module scope so repeat callers (notably React StrictMode mounting the tree
// twice in dev) share one handshake instead of registering a second handler and
// calling init() again, which the SDK ignores, leaving the second promise to
// hang forever.
let handshake: Promise<WidgetContext> | null = null

export function initZoho(): Promise<WidgetContext> {
  if (handshake) return handshake

  handshake = new Promise((resolve) => {
    const ZOHO = window.ZOHO

    if (!ZOHO?.embeddedApp) {
      resolve(STANDALONE)
      return
    }

    ZOHO.embeddedApp.on('PageLoad', (data) => {
      void ZOHO.CRM.UI.Resize({ width: '80%', height: '85%' })

      const rawId = data?.EntityId
      const entityId = Array.isArray(rawId) ? rawId[0] ?? null : rawId ?? null
      resolve({
        entity: data?.Entity ?? null,
        entityId,
        raw: data,
      })
    })

    // Tell Zoho the widget is ready to receive events.
    void ZOHO.embeddedApp.init()
  })

  return handshake
}
