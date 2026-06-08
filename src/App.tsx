import { useEffect, useState } from 'react'
import { initZoho, type WidgetContext } from './zoho'

type Status = 'loading' | 'embedded' | 'standalone'

export default function App() {
  const [status, setStatus] = useState<Status>('loading')
  const [ctx, setCtx] = useState<WidgetContext | null>(null)

  useEffect(() => {
    let active = true
    initZoho().then((context) => {
      if (!active) return
      setCtx(context)
      setStatus(context.raw ? 'embedded' : 'standalone')
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="flex min-h-full items-start justify-center p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-sm">
        <div className="flex items-center gap-3 border-b border-[var(--color-line)] px-5 py-4">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{
              background:
                status === 'embedded'
                  ? 'var(--color-accent)'
                  : status === 'standalone'
                    ? '#c6ccd6'
                    : '#f0c14b',
            }}
          />
          <h1 className="text-sm font-semibold tracking-tight text-[var(--color-ink)]">
            Zoho CRM Widget
          </h1>
          <span className="ml-auto text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
            {status === 'loading' ? 'initializing' : status}
          </span>
        </div>

        <div className="px-5 py-5">
          {status === 'loading' && (
            <p className="text-sm text-[var(--color-muted)]">
              Waiting for the PageLoad handshake from Zoho…
            </p>
          )}

          {status === 'standalone' && (
            <p className="text-sm leading-relaxed text-[var(--color-muted)]">
              Running outside the CRM iframe, so there is no record context. This
              is expected with <code className="font-mono text-[var(--color-ink)]">npm run dev</code>.
              Install the widget in a sandbox and open it from a record to see
              live data.
            </p>
          )}

          {status === 'embedded' && ctx && (
            <dl className="space-y-3 text-sm">
              <Row label="Module" value={ctx.entity ?? '—'} />
              <Row label="Record ID" value={ctx.entityId ?? '—'} mono />
              <p className="pt-1 text-xs text-[var(--color-muted)]">
                Next step: call{' '}
                <code className="font-mono text-[var(--color-ink)]">
                  ZOHO.CRM.API.getRecord
                </code>{' '}
                with these values to load the full record.
              </p>
            </dl>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[var(--color-muted)]">{label}</dt>
      <dd className={`text-right text-[var(--color-ink)] ${mono ? 'font-mono' : 'font-medium'}`}>
        {value}
      </dd>
    </div>
  )
}
