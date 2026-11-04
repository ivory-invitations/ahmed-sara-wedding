// =====================================================
// wedding.config.js  —  EVERYTHING you edit lives here
// New wedding = change this file only (+ assets in /public)
// =====================================================

export const wedding = {
  groom: 'Shehab',
  bride: 'Heba',

  // Date & time (local time at the venue)
  date: '2026-12-05',      // YYYY-MM-DD
  time: '19:00',           // 24h
  endTime: '23:00',        // used for the calendar file
  timeZone: 'Africa/Cairo',
  utcOffset: '+02:00',     // Cairo winter = +02:00, summer (DST) = +03:00

  venue: {
    name: 'Police Club',
    city: 'Cairo',
    country: 'Egypt',
    mapUrl: 'https://share.google/2Ec22XqKu1g1cFdIp',
  },

  rsvpFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSfI-vrSpK4PU6zUbfygTly0UqzYPXAfgJoa7A-Q-jR1aY96lw/viewform?embedded=true',

  // File inside /public, written WITHOUT a leading slash (public/music.mp3 -> 'music.mp3').
  // Empty string = music buttons are hidden.
  musicUrl: 'music.mp3',

  // Opening video (envelope). Files inside /public, no leading slash.
  // Empty introVideo = the old CSS envelope is used instead (also used if the video fails to load).
  introVideo: 'envelope-intro.mp4',
  introPoster: 'envelope-poster.jpg',   // first frame, shown instantly before the video loads

  // Must match the GitHub repo name: '/<repo-name>/'  (used by vite.config.js and local images)
  basePath: '/shehab-heba-wedding/',
}

// ---------- Derived (don't edit) ----------
export const startISO = `${wedding.date}T${wedding.time}:00${wedding.utcOffset}`
export const endISO = `${wedding.date}T${wedding.endTime}:00${wedding.utcOffset}`
const d = new Date(startISO)
const fmt = (o) => new Intl.DateTimeFormat('en-US', { timeZone: wedding.timeZone, ...o }).format(d)

export const display = {
  weekday: fmt({ weekday: 'long' }),
  day: fmt({ day: '2-digit' }),
  monthNum: fmt({ month: '2-digit' }),
  monthShort: fmt({ month: 'short' }).toUpperCase(),
  year: fmt({ year: 'numeric' }),
  time12: fmt({ hour: 'numeric', minute: '2-digit' }),
  dateLong: fmt({ month: 'long', day: 'numeric', year: 'numeric' }),
  where: `${wedding.venue.city}, ${wedding.venue.country}`,
}
display.numeric = `${display.day} · ${display.monthNum} · ${display.year}`
display.dotted = `${display.day}.${display.monthNum}.${display.year}`

// ---------- Texts ----------
export const text = {
  // Header navigation
  navStory: 'Our Story',
  navDetails: 'The Day',
  navGallery: 'Gallery',
  navRsvp: 'RSVP',
  musicOn: 'Music on',
  musicOff: 'Music off',

  // Cover
  skipIntro: 'Skip',
  introAria: 'Tap to open the invitation',
  coverEyebrow: 'A SPECIAL INVITATION',
  openHint: 'Touch to open',

  // Hero
  heroEyebrow: 'TOGETHER WITH THEIR FAMILIES',
  heroInvite: 'invite you to celebrate their wedding',
  heroCaption: 'A new chapter begins',

  // Intro  (array = [normal line, italic line])
  introEyebrow: 'A LITTLE NOTE FROM US',
  introTitle: ['Two hearts,', 'one beautiful journey.'],
  introCopy:
    'With full hearts and so much joy, we invite you to be part of the beginning of our forever. Your presence will make our day even more meaningful.',

  // Countdown
  countdownEyebrow: 'THE BIG DAY',
  countdownTitle: ['Counting down to', 'forever'],
  countdownUntil: 'Until our wedding',
  countdownDone: 'Today is the day!',
  days: 'days',
  hours: 'hours',
  minutes: 'minutes',
  seconds: 'seconds',

  // Details
  detailsEyebrow: 'SAVE THE DATE',
  detailsTitle: ['The day', 'we become us.'],
  detailsSub: 'We can’t wait to celebrate with you.',
  when: 'WHEN',
  where: 'WHERE',
  addToCalendar: 'Add to calendar',
  openLocation: 'Open location',
  venueNote: 'We look forward to seeing you there.',
  venuePhotoLabel: 'THE CELEBRATION',
  venuePhotoTitle: ['One evening.', 'A lifetime of memories.'],

  // Gallery
  galleryEyebrow: 'MOMENTS WE LOVE',
  galleryTitle: ['Our little', 'collection.'],
  gallerySub: 'A few romantic details to set the mood for our day.',
  galleryNote:
    'These are sample photographs for the design. Replace them with Shehab and Heba’s own photos whenever ready.', // set to '' to hide
  viewPhoto: 'View photo',
  closePhoto: 'Close photo',
  photoViewer: 'Photo viewer',

  // RSVP
  rsvpEyebrow: 'KINDLY REPLY',
  rsvpTitle: ['Will you join', 'our forever?'],
  rsvpIntro: 'Please let us know if you can make it. We’d love to celebrate with you.',
  rsvpFoot: 'Thank you for being part of our story.',
  rsvpLoading: 'Loading RSVP form…',

  // Footer
  footerEyebrow: 'WITH LOVE, ALWAYS',
  footerThanks: 'We can’t wait to celebrate with you.',

  // Calendar file (.ics)
  icsSummary: `${wedding.groom} & ${wedding.bride} Wedding`,
  icsDescription: `Join us to celebrate the wedding of ${wedding.groom} and ${wedding.bride}.`,

  // Accessibility labels
  altHero: 'Romantic garden wedding reception illuminated by warm lights',
  altCountdown: 'Garden wedding dinner with glowing string lights',
  altVenue: 'Elegant outdoor event venue at twilight',
  altRsvp: 'Soft white flowers in warm evening light',
}

// ---------- Images ----------
// Option A (current): Unsplash sample photos.
// Option B: your own photos -> put them in /public/images/ and use local('name.jpg')
const local = (file) => `${wedding.basePath}images/${file}`
const u = (id, w, q = 85) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`

export const images = {
  cover: u('photo-1490750967868-88aa4486c946', 1800, 90),
  hero: u('photo-1519741497674-611481863552', 2200, 90),
  countdown: u('photo-1478146896981-b80fe463b330', 2000),
  venue: u('photo-1519167758481-83f550bb49b3', 1800),
  rsvp: u('photo-1529636798458-92182e662485', 1200),

  // WhatsApp / Facebook preview image. MUST be a full https:// URL (not local()).
  // After deploy you can use: 'https://<username>.github.io/shehab-heba-wedding/images/og.jpg'
  og: u('photo-1519741497674-611481863552', 1200, 85),
}

// Example with your own photos:
// export const images = { cover: local('cover.jpg'), hero: local('hero.jpg'), ... og: 'https://...' }
void local // silences "unused" warnings until you use it

// className: '' | 'photo-tall' | 'photo-wide'
export const photos = [
  { src: u('photo-1519741497674-611481863552', 1000), alt: 'Romantic wedding table with warm lights', className: 'photo-tall' },
  { src: u('photo-1523438885200-e635ba2c371e', 900), alt: 'Elegant wedding flowers and details', className: '' },
  { src: u('photo-1511285560929-80b456fea0bc', 900), alt: 'Wedding celebration with guests', className: '' },
  { src: u('photo-1519225421980-715cb0215aed', 900), alt: 'Romantic floral wedding arrangement', className: 'photo-wide' },
  { src: u('photo-1537633552985-df8429e8048b', 900), alt: 'Wedding couple holding hands', className: '' },
  { src: u('photo-1465495976277-4387d4b0e4a6', 900), alt: 'Outdoor wedding dinner under lights', className: '' },
]
