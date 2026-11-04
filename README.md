# Ahmed & Sara — Wedding Invitation

A mobile-first React + Vite wedding invitation for December 10, 2026 at 7:00 PM Cairo time.

**Everything you edit lives in `src/wedding.config.js`** (names, date, venue, links, texts, images, music).

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

## Before publishing

1. **RSVP:** `wedding.rsvpFormUrl` in `src/wedding.config.js` points to an embedded Google Form. Test that it opens and saves responses.
2. **Photos:** The images use sample Unsplash photos. Put your own in `public/images/` and use the `local('file.jpg')` helper in `src/wedding.config.js`. 
3. **Preview image (WhatsApp/Facebook):** set `images.og` to a full `https://...` URL.
4. **Music:** Put a properly licensed audio file at `public/music.mp3` (or change `wedding.musicUrl`). Set `musicUrl: ''` to hide the music buttons. Browsers only allow audio after a tap, which is why it starts when the guest opens the envelope.
5. **Venue:** Confirm that `wedding.venue.mapUrl` opens the intended branch.
6. **Time:** Countdown and calendar use 10 December 2026, 7:00 PM Cairo time (UTC+2). The calendar event ends at 11:59 PM; change `wedding.endTime` if needed.

## Deploy to GitHub Pages

The Vite `base` comes from `wedding.basePath` in `src/wedding.config.js` and must match the repository name (default: `/ahmed-sara-wedding/`).

1. Create a GitHub repository named `ahmed-sara-wedding` (or change `basePath`).
2. Push this project to the `main` branch.
3. In repository **Settings → Pages**, select **GitHub Actions** as the source.
4. The workflow is already included at `.github/workflows/deploy.yml`.

For stricter supply-chain security, pin GitHub Actions to verified commit SHAs before production use.
