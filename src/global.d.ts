export {}

// Minimal typings for the Zoho Embedded App SDK surface this starter uses.
// Extend these as you call more of the ZOHO.CRM.* API.
declare global {
  interface ZohoPageLoadData {
    Entity?: string
    EntityId?: string | string[]
    ButtonPosition?: string
    [key: string]: unknown
  }

  interface ZohoEmbeddedApp {
    init: () => Promise<void>
    on: (event: 'PageLoad' | string, handler: (data: ZohoPageLoadData) => void) => void
  }

  interface ZohoCrmApi {
    getRecord: (args: {
      Entity: string
      RecordID: string | string[] | number
    }) => Promise<{ data: Array<Record<string, unknown>> }>
    updateRecord: (args: {
      Entity: string
      RecordID: string | number
      APIData: Record<string, unknown>
    }) => Promise<unknown>
    [key: string]: unknown
  }

  interface ZohoCrmUi {
    // Resizes the widget popup. height/width accept pixel ("600") or
    // percentage ("70%") strings; percentages are relative to the viewport.
    Resize: (args: { height: string; width: string }) => Promise<unknown>
    [key: string]: unknown
  }

  interface ZohoNamespace {
    embeddedApp: ZohoEmbeddedApp
    CRM: {
      API: ZohoCrmApi
      UI: ZohoCrmUi
      [key: string]: unknown
    }
  }

  interface Window {
    ZOHO?: ZohoNamespace
  }
}
