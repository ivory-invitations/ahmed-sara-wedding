import { useEffect, useRef, useState } from 'react'
import { CalendarDays, MapPin, Music2, VolumeX, Heart, ArrowDown, ExternalLink } from 'lucide-react'

import { wedding, photos, images, text, display, startISO, endISO } from './wedding.config.js'
import RsvpForm from './RsvpForm.jsx'

function getCountdown() {
  const target = new Date(startISO).getTime()
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    done: diff === 0,
  }
}

// ICS helpers
const toUtcStamp = (date) => new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
const icsEscape = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

function makeCalendarFile() {
  const ymd = wedding.date.replaceAll('-', '')
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:${ymd}-${wedding.groom}-${wedding.bride}@invitation`.toLowerCase(),
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(startISO)}`,
    `DTEND:${toUtcStamp(endISO)}`,
    `SUMMARY:${icsEscape(text.icsSummary)}`,
    `LOCATION:${icsEscape(`${wedding.venue.name}, ${display.where}`)}`,
    `DESCRIPTION:${icsEscape(`${text.icsDescription} Map: ${wedding.venue.mapUrl}`)}`,
    `URL:${wedding.venue.mapUrl}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${wedding.groom}-${wedding.bride}-wedding.ics`.toLowerCase()
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function App() {
  const [opened, setOpened] = useState(false)
  const [countdown, setCountdown] = useState(getCountdown)
  const [muted, setMuted] = useState(true)
  const [galleryImage, setGalleryImage] = useState(null)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const leavingRef = useRef(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [introPhase, setIntroPhase] = useState('idle') // idle | playing | leaving
  const hasVideo = Boolean(wedding.introVideo) && !videoFailed
  const assetUrl = (file) => `${import.meta.env.BASE_URL}${file}`

  // CSS-envelope fallback (no video)
  const openInvitation = () => { setOpened(true); audioRef.current?.play().catch(() => {}) }

  // Video intro: tap -> video plays (envelope opens) -> fade out -> invitation
  const startIntro = () => {
    if (introPhase !== 'idle') return
    audioRef.current?.play().catch(() => {}) // the tap is the user gesture browsers require for audio
    const v = videoRef.current
    if (!v) { setOpened(true); return }
    setIntroPhase('playing')
    v.play().catch(() => setOpened(true))
  }
  const endIntro = () => {
    if (leavingRef.current) return
    leavingRef.current = true
    setIntroPhase('leaving')
    setTimeout(() => setOpened(true), 900) // matches the CSS fade duration
  }
  const onIntroTime = (e) => {
    const v = e.currentTarget
    if (v.duration && v.duration - v.currentTime < 0.5) endIntro()
  }
  const toggleMusic = async () => {
    const a = audioRef.current
    if (!a) return
    try { if (a.paused) await a.play(); else a.pause() }
    catch (e) { console.error('Music failed to play:', e) }
  }

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown()), 1000)
    return () => clearInterval(timer)
  }, [])

  // lock page scroll while the opening screen is showing
  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [opened])

  const countdownItems = [
    [text.days, countdown.days],
    [text.hours, countdown.hours],
    [text.minutes, countdown.minutes],
    [text.seconds, countdown.seconds],
  ]

  return <main>
    {!opened && hasVideo && <div className={`intro-screen ${introPhase}`}>
      <video
        ref={videoRef}
        className="intro-video"
        src={assetUrl(wedding.introVideo)}
        poster={wedding.introPoster ? assetUrl(wedding.introPoster) : undefined}
        playsInline
        preload="auto"
        onTimeUpdate={onIntroTime}
        onEnded={endIntro}
        onError={() => setVideoFailed(true)}
      />
      {introPhase === 'idle' && <button className="intro-hit" onClick={startIntro} aria-label={text.introAria} />}
      {introPhase === 'playing' && <button className="intro-skip" onClick={() => { videoRef.current?.pause(); endIntro() }}>{text.skipIntro}</button>}
    </div>}

    {!opened && !hasVideo && <div className="envelope-screen" aria-label="Invitation cover">
      <div className="cover-photo" style={{ backgroundImage: `url(${images.cover})` }} />
      <div className="cover-vignette" />
      <p className="eyebrow cover-eyebrow">{text.coverEyebrow}</p>
      <button className="envelope-button" onClick={openInvitation} aria-label="Open wedding invitation">
        <div className="envelope-paper"><span className="paper-leaf leaf-one">✿</span><span className="paper-leaf leaf-two">❧</span><span className="wax-seal">{wedding.groom[0]}<span>&</span>{wedding.bride[0]}</span></div>
      </button>
      <p className="script cover-names">{wedding.groom} <span>&</span> {wedding.bride}</p>
      <button className="open-hint" onClick={openInvitation}>{text.openHint} <ArrowDown size={16} /></button>
      <span className="cover-bottom-note">{display.numeric} <i /> {display.where.toUpperCase()}</span>
    </div>}

    <header className="site-header">
      <a className="brand" href="#home" aria-label={`${wedding.groom} and ${wedding.bride} home`}>{wedding.groom[0]} <span>&</span> {wedding.bride[0]}</a>
      <nav><a href="#story">{text.navStory}</a><a href="#details">{text.navDetails}</a><a href="#gallery">{text.navGallery}</a><a href="#rsvp">{text.navRsvp}</a></nav>
      {wedding.musicUrl && <button className="music-toggle" onClick={toggleMusic} aria-label={muted ? text.musicOn : text.musicOff}>{muted ? <VolumeX size={17}/> : <Music2 size={17}/>}<span>{muted ? text.musicOff : text.musicOn}</span></button>}
    </header>

    <section className="hero" id="home">
      <img className="hero-image" src={images.hero} alt={text.altHero} />
      <div className="hero-overlay" />
      <div className="hero-content reveal">
        <p className="eyebrow">{text.heroEyebrow}</p>
        <h1><span>{wedding.groom}</span><em>&</em><span>{wedding.bride}</span></h1>
        <p className="hero-invite">{text.heroInvite}</p>
        <div className="hero-date"><span>{display.weekday}</span><strong>{display.day} <small>{display.monthShort}</small></strong><span>{display.year} · {display.time12}</span></div>
        <p className="hero-place"><MapPin size={15}/> {display.where}</p>
        <a href="#details" className="round-link" aria-label="Explore invitation"><ArrowDown size={19}/></a>
      </div>
      <div className="hero-caption">{text.heroCaption} <span>✦</span> {display.dotted}</div>
    </section>

    <section className="intro section-pad" id="story">
      <div className="floral-mark">❧</div><p className="eyebrow">{text.introEyebrow}</p>
      <h2>{text.introTitle[0]}<br/><em>{text.introTitle[1]}</em></h2>
      <p className="intro-copy">{text.introCopy}</p>
      <div className="signature script">{wedding.groom} <span>&</span> {wedding.bride}</div>
    </section>

    <section className="countdown-section">
      <img src={images.countdown} alt={text.altCountdown} />
      <div className="countdown-shade" />
      <div className="countdown-content"><p className="eyebrow">{text.countdownEyebrow}</p><h2>{text.countdownTitle[0]} <em>{text.countdownTitle[1]}</em></h2>
        <div className="countdown-grid">{countdownItems.map(([label, value]) => <div className="count-box" key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>
        <p className="countdown-foot">{countdown.done ? text.countdownDone : `${text.countdownUntil} · ${display.dateLong}`}</p>
      </div>
    </section>

    <section className="details section-pad" id="details">
      <div className="section-heading"><p className="eyebrow">{text.detailsEyebrow}</p><h2>{text.detailsTitle[0]} <em>{text.detailsTitle[1]}</em></h2><p>{text.detailsSub}</p></div>
      <div className="details-grid">
        <article className="detail-card"><div className="detail-icon"><CalendarDays size={22}/></div><p className="eyebrow">{text.when}</p><h3>{display.weekday}</h3><p className="detail-date">{display.dateLong}</p><p>{display.time12} · {wedding.venue.city} time</p><button className="text-link" onClick={makeCalendarFile}>{text.addToCalendar} <ExternalLink size={14}/></button></article>
        <article className="detail-card venue-card"><div className="detail-icon"><MapPin size={22}/></div><p className="eyebrow">{text.where}</p><h3>{wedding.venue.name}</h3><p className="detail-date">{display.where}</p><p>{text.venueNote}</p><a className="text-link" href={wedding.venue.mapUrl} target="_blank" rel="noreferrer">{text.openLocation} <ExternalLink size={14}/></a></article>
      </div>
      <div className="venue-photo-wrap"><img src={images.venue} alt={text.altVenue}/><div className="venue-photo-label"><span>{text.venuePhotoLabel}</span><strong>{text.venuePhotoTitle[0]}<br/><em>{text.venuePhotoTitle[1]}</em></strong></div></div>
    </section>

    <section className="gallery-section section-pad" id="gallery">
      <div className="section-heading"><p className="eyebrow">{text.galleryEyebrow}</p><h2>{text.galleryTitle[0]} <em>{text.galleryTitle[1]}</em></h2><p>{text.gallerySub}</p></div>
      <div className="gallery-grid">{photos.map((photo, i) => <button className={`gallery-item ${photo.className}`} key={photo.src} onClick={() => setGalleryImage(photo)} aria-label={`${text.viewPhoto}: ${photo.alt}`}><img src={photo.src} alt={photo.alt} loading="lazy"/><span className="gallery-number">0{i + 1}</span></button>)}</div>
      {text.galleryNote && <p className="gallery-note">{text.galleryNote}</p>}
    </section>

    <section className="rsvp-section" id="rsvp">
      <div className="rsvp-photo"><img src={images.rsvp} alt={text.altRsvp}/></div>
      <div className="rsvp-panel"><p className="eyebrow">{text.rsvpEyebrow}</p><h2>{text.rsvpTitle[0]} <em>{text.rsvpTitle[1]}</em></h2><p className="rsvp-intro">{text.rsvpIntro}</p>
        <RsvpForm />
        <p className="rsvp-foot">{text.rsvpFoot}</p>
      </div>
    </section>

    <footer className="footer"><div className="footer-flower">✿</div><p className="eyebrow">{text.footerEyebrow}</p><p className="script footer-names">{wedding.groom} <span>&</span> {wedding.bride}</p><p className="footer-date">{display.numeric} <span>—</span> {display.where.toUpperCase()}</p><p className="footer-thanks">{text.footerThanks}</p><Heart size={15} strokeWidth={1.2}/></footer>

    {wedding.musicUrl && <>
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}${wedding.musicUrl}`} loop preload="auto" onPlay={() => { setMuted(false); setPlaying(true) }} onPause={() => { setMuted(true); setPlaying(false) }} onError={e => console.error('Music file not found or unsupported:', e.currentTarget.src)} />
      <button className={`floating-music ${playing && !muted ? 'is-playing' : ''}`} onClick={toggleMusic} aria-label={muted ? text.musicOn : text.musicOff}>{muted ? <VolumeX size={18}/> : <Music2 size={18}/>}</button>
    </>}

    {galleryImage && <div className="lightbox" role="dialog" aria-modal="true" aria-label={text.photoViewer} onClick={() => setGalleryImage(null)}><button className="lightbox-close" onClick={() => setGalleryImage(null)} aria-label={text.closePhoto}>×</button><img src={galleryImage.src} alt={galleryImage.alt} onClick={e => e.stopPropagation()}/><p>{galleryImage.alt}</p></div>}
  </main>
}

export default App
