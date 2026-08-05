import { useEffect, useRef, useState, type FormEvent } from 'react'

const INQUIRY_EMAIL = 'concierge@onepacificbythebay.com'
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${INQUIRY_EMAIL}`
const MIN_FILL_MS = 3500

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

function freshChallenge() {
  return {
    a: 2 + Math.floor(Math.random() * 6),
    b: 1 + Math.floor(Math.random() * 5),
  }
}

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [spamAnswer, setSpamAnswer] = useState('')
  const [challenge, setChallenge] = useState(freshChallenge)
  const [copied, setCopied] = useState(false)
  const openedAt = useRef(Date.now())
  const copyResetRef = useRef<number | null>(null)

  useEffect(() => {
    openedAt.current = Date.now()
    return () => {
      if (copyResetRef.current) window.clearTimeout(copyResetRef.current)
    }
  }, [])

  async function copyInquiryEmail() {
    try {
      await navigator.clipboard.writeText(INQUIRY_EMAIL)
      setCopied(true)
      if (copyResetRef.current) window.clearTimeout(copyResetRef.current)
      copyResetRef.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const expectedSpam = challenge.a + challenge.b

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const honeypot = String(data.get('company_website') ?? '').trim()
    if (honeypot) {
      setStatus('success')
      form.reset()
      return
    }

    if (Date.now() - openedAt.current < MIN_FILL_MS) {
      setStatus('error')
      setErrorMessage(
        'Please take a moment to review your message, then try again.',
      )
      return
    }

    const answer = Number(String(data.get('spam_check') ?? '').trim())
    if (!Number.isFinite(answer) || answer !== expectedSpam) {
      setStatus('error')
      setErrorMessage(
        'Anti-spam check failed. Please solve the simple math question.',
      )
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      message: String(data.get('message') ?? ''),
      _subject: 'One Pacific by the Bay — Website Inquiry',
      _template: 'table',
      _replyto: String(data.get('email') ?? ''),
    }

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      setStatus('success')
      form.reset()
      setSpamAnswer('')
      setChallenge(freshChallenge())
      openedAt.current = Date.now()
    } catch {
      setStatus('error')
      setErrorMessage(
        `Unable to send right now. Email us directly at ${INQUIRY_EMAIL}.`,
      )
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-form contact-form-success reveal is-visible">
        <h3>Message sent</h3>
        <p>
          Thank you. Your inquiry has been directed to{' '}
          <strong>{INQUIRY_EMAIL}</strong>. Our team will be in touch shortly.
        </p>
        <button
          type="button"
          className="contact-submit"
          onClick={() => {
            setStatus('idle')
            openedAt.current = Date.now()
            setChallenge(freshChallenge())
          }}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form className="contact-form reveal" onSubmit={handleSubmit}>
      <input
        className="hp-field"
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="form-field">
        <label htmlFor="name">
          Name<span aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="John Smith"
          autoComplete="name"
        />
      </div>

      <div className="form-field">
        <label htmlFor="email">
          Email<span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="johnsmith@gmail.com"
          autoComplete="email"
        />
      </div>

      <div className="form-field">
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+44789 123456"
          autoComplete="tel"
        />
      </div>

      <div className="form-field">
        <label htmlFor="message">
          Message<span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Hello, I'd like to enquire about..."
        />
      </div>

      <div className="form-field form-field--spam">
        <label htmlFor="spam_check">
          Anti-spam: What is {challenge.a} + {challenge.b}?
          <span aria-hidden="true">*</span>
        </label>
        <input
          id="spam_check"
          name="spam_check"
          type="text"
          inputMode="numeric"
          required
          placeholder="Your answer"
          autoComplete="off"
          value={spamAnswer}
          onChange={(event) => setSpamAnswer(event.target.value)}
        />
      </div>

      <button
        className="contact-submit"
        type="submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>

      {status === 'error' ? (
        <p className="form-status form-status--error" role="alert">
          {errorMessage}
        </p>
      ) : (
        <p className="form-status">
          Inquiries are sent to{' '}
          <button
            type="button"
            className={`form-email-copy${copied ? ' is-copied' : ''}`}
            onClick={copyInquiryEmail}
            aria-label={`Copy ${INQUIRY_EMAIL} to clipboard`}
            title="Click to copy"
          >
            {INQUIRY_EMAIL}
          </button>
          {copied ? <span className="form-copied-cue">Copied email!</span> : '.'}
        </p>
      )}
    </form>
  )
}
