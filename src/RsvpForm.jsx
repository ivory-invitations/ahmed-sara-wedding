import { useState } from 'react'
import { Check, Send } from 'lucide-react'

import { wedding, rsvp, text } from './wedding.config.js'

// The custom form is used only when every field has a real Google Form entry id
// and no option value is still a REPLACE placeholder.
const optionValue = (o) => String(o?.value ?? o)
const configured = rsvp.fields.every(
  (f) => /^entry\.\d+$/.test(f.entry) && (f.options ?? []).every((o) => !optionValue(o).includes('REPLACE')),
)

const emptyValues = () => Object.fromEntries(rsvp.fields.map((f) => [f.key, '']))

export default function RsvpForm() {
  const [values, setValues] = useState(emptyValues)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  // Safe fallback: the embedded Google Form
  if (!configured) {
    return (
      <div className="rsvp-embed-wrap">
        <iframe className="rsvp-embed" src={wedding.rsvpFormUrl} title={`${wedding.groom} and ${wedding.bride} wedding RSVP form`} loading="lazy">
          {text.rsvpLoading}
        </iframe>
      </div>
    )
  }

  const setValue = (key, value) => setValues((prev) => ({ ...prev, [key]: value }))

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')

    const body = new URLSearchParams()
    rsvp.fields.forEach((f) => {
      const v = String(values[f.key] ?? '').trim()
      if (v) body.append(f.entry, v)
    })

    try {
      // Google Forms doesn't allow reading the response from another site, so we send in
      // "no-cors" mode. A network failure throws; otherwise we treat it as delivered.
      await fetch(rsvp.action, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
      setStatus('sent')
    } catch (err) {
      console.error('RSVP failed to send:', err)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rsvp-sent" role="status">
        <div className="detail-icon"><Check size={22} /></div>
        <h3>{text.rsvpSentTitle}</h3>
        <p>{text.rsvpSentText}</p>
        <button
          type="button"
          className="text-link"
          onClick={() => { setValues(emptyValues()); setStatus('idle') }}
        >
          {text.rsvpSendAnother}
        </button>
      </div>
    )
  }

  return (
    <form className="rsvp-form" onSubmit={submit}>
      {rsvp.fields.map((f) => {
        const id = `rsvp-${f.key}`
        const value = values[f.key]

        if (f.type === 'choice') {
          return (
            <fieldset key={f.key}>
              <legend>{f.label}</legend>
              <div className="choice-group">
                {f.options.map((o) => (
                  <label className="choice" key={o.value}>
                    <input
                      type="radio"
                      name={id}
                      value={o.value}
                      checked={value === o.value}
                      required={f.required}
                      onChange={() => setValue(f.key, o.value)}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )
        }

        return (
          <label key={f.key} htmlFor={id}>
            {f.label}
            {f.type === 'select' ? (
              <select id={id} value={value} required={f.required} onChange={(e) => setValue(f.key, e.target.value)}>
                <option value="">—</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea id={id} rows={4} value={value} placeholder={f.placeholder} required={f.required} onChange={(e) => setValue(f.key, e.target.value)} />
            ) : (
              <input id={id} type="text" value={value} placeholder={f.placeholder} required={f.required} onChange={(e) => setValue(f.key, e.target.value)} />
            )}
          </label>
        )
      })}

      {status === 'error' && <p className="form-error" role="alert">{text.rsvpError}</p>}

      <button className="submit-button" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? text.rsvpSending : text.rsvpSubmit} <Send size={15} />
      </button>
    </form>
  )
}
