// =====================================================
// wedding.config.js  —  EVERYTHING you edit lives here
// New wedding = change this file only (+ assets in /public)
// =====================================================

export const wedding = {
  groom: 'Ahmed',
  bride: 'Sara',

  // Date & time (local time at the venue)
  date: '2026-12-10',      // YYYY-MM-DD
  time: '19:00',           // 24h
  endTime: '23:59',        // used for the calendar file
  timeZone: 'Africa/Cairo',
  utcOffset: '+02:00',     // Cairo winter = +02:00, summer (DST) = +03:00

  venue: {
    name: 'VENUE LOTUS ballrooms Police Club',
    city: 'Alexandria',
    country: 'Egypt',
    mapUrl: 'https://share.google/2Ec22XqKu1g1cFdIp',
  },

  rsvpFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSfI-vrSpK4PU6zUbfygTly0UqzYPXAfgJoa7A-Q-jR1aY96lw/viewform?embedded=true',

  // File inside /public, written WITHOUT a leading slash (public/music.mp3 -> 'music.mp3').
  // Empty string = music buttons are hidden.
  musicUrl: '',

  // Opening video (envelope). Files inside /public, no leading slash.
  // Empty introVideo = the old CSS envelope is used instead (also used if the video fails to load).
  introVideo: 'envelope-intro.mp4',
  introPoster: 'envelope-poster.jpg',   // first frame, shown instantly before the video loads

  // Must match the GitHub repo name: '/<repo-name>/'  (used by vite.config.js and local images)
  basePath: '/ahmed-sara-wedding/',
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

// ---------- RSVP form ----------
// A custom form that submits straight to YOUR Google Form, so replies still land in the
// form's "Responses" tab / Google Sheet. The URL is derived from wedding.rsvpFormUrl.
//
// 1) Each `entry` must be the real id of the matching Google Form question (looks like entry.1234567890).
//    How to get them: Google Form -> ⋮ menu -> "Get pre-filled link" -> fill dummy answers
//    -> "Get link" -> paste the link into the chat (or read the entry.XXXX=... parts yourself).
// 2) For `choice` and `select` fields, each `value` must match the option text in the Google Form EXACTLY.
// 3) Until every entry id is real and no option value says REPLACE, the site safely falls back to the embedded Google Form.
export const rsvp = {
  action: wedding.rsvpFormUrl.replace(/\/viewform.*$/, '/formResponse'),
  fields: [
    { key: 'name', type: 'text', label: 'Your name', placeholder: 'Full name', entry: 'entry.1498135098', required: true },
    {
      key: 'attending', type: 'choice', label: 'Will you attend?', entry: 'entry.877086558', required: true,
      options: [
        // label = what guests see | value = EXACT option text in the Google Form (note: it has two spaces after the comma)
        { label: 'Yes, I’ll be there', value: "Yes,  I'll be there" },
        // TODO: paste the exact text of the "No" option from your Google Form into `value`.
        // While it still says REPLACE, the site keeps showing the embedded Google Form (so nothing gets lost).
        { label: 'Sorry, I can’t make it', value: "Sorry, can't make it" },
      ],
    },
    { key: 'guests', type: 'select', label: 'Number of guests (including you)', entry: 'entry.1424661284', required: true, options: ['1', '2', '3', '4', '5'] },
    { key: 'message', type: 'textarea', label: 'A message for the couple (optional)', placeholder: 'Write something sweet…', entry: 'entry.2606285' },
  ],
}

// ---------- Order of the Day ----------
// time  = الوقت | title = العنوان الرئيسي | lines = أسطر إضافية تحت العنوان (اختياري)
export const schedule = [
  { time: '6:00 PM',  title: 'RECEPTION',             lines: ['WELCOME DRINKS & GUEST ARRIVAL'] },
  { time: '7:00 PM',  title: 'ZAFFA & ENTERTAINMENT', lines: ['& MARRIAGE CEREMONY'] },
  { time: '9:30 PM',  title: 'DINNER' },
  { time: '10:00 PM', title: 'PARTY & ENTERTAINMENT' },
]

// ---------- Designer credit (footer strip) ----------
// Set any link to '' to hide that icon.
export const credit = {
  name: 'MoDESIGNATION',
  instagram: 'https://www.instagram.com/lvory.invitations/',
  whatsapp: 'https://wa.me/201113005575',
  telegram: 'https://t.me/+201113005575',
}

// ---------- Texts ----------
export const text = {
  // Designer credit
  creditBy: 'DESIGNED BY',
  creditRights: 'All rights reserved',

  // Header navigation
  navStory: 'Our Story',
  navDetails: 'The Day',
  navGallery: 'Schedule',
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

  // Order of the Day
  galleryTitle: ['Order of the Day'],
  gallerySub: 'WHAT WE HAVE PLANNED FOR YOU',

  // RSVP
  rsvpEyebrow: 'KINDLY REPLY',
  rsvpTitle: ['Will you join', 'our forever?'],
  rsvpIntro: 'Please let us know if you can make it. We’d love to celebrate with you.',
  rsvpFoot: 'Thank you for being part of our story.',
  rsvpLoading: 'Loading RSVP form…',
  rsvpSubmit: 'Send RSVP',
  rsvpSending: 'Sending…',
  rsvpError: 'Something went wrong. Please check your connection and try again.',
  rsvpSentTitle: 'Thank you!',
  rsvpSentText: 'Your reply has been received. We can’t wait to celebrate with you.',
  rsvpSendAnother: 'Send another reply',

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
  venue: `${wedding.basePath}venue.jpeg`,
  rsvp: u('photo-1529636798458-92182e662485', 1200),

  // WhatsApp / Facebook preview image. MUST be a full https:// URL (not local()).
  // After deploy you can use: 'https://<username>.github.io/ahmed-sara-wedding/images/og.jpg'
  og: u('photo-1519741497674-611481863552', 1200, 85),
}

// Example with your own photos:
// export const images = { cover: local('cover.jpg'), hero: local('hero.jpg'), ... og: 'https://...' }
void local // silences "unused" warnings until you use it
