# Español Course (Next.js)

Πιστή μεταφορά του standalone HTML Español Course σε **Next.js App Router + TypeScript**.

**Production:** δες το deployment στο Vercel project που είναι linked με το repo  
[`vasilisgrivas09-maker/Spanish-App`](https://github.com/vasilisgrivas09-maker/Spanish-App)  
(συνήθως `https://spanish-app-….vercel.app` — επιβεβαίωσε στο Vercel Dashboard → Domains).

## Εκκίνηση

```bash
npm install
npm run dev
```

Άνοιξε [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Περιγραφή |
|---------|-----------|
| `npm run dev` | Development (Turbopack) |
| `npm run build` | Production build + Serwist PWA |
| `npm run start` | Production server |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E (Playwright) |
| `npm run lint` | ESLint |

## Αρχιτεκτονική

- `src/app` — App Router shell, metadata, CSS, Serwist route, error boundaries
- `src/components/SpanishCourseApp.tsx` — client mount + loading skeleton
- `src/lib/course/data.ts` — λεξιλόγιο / γραμματική / διάλογοι
- `src/lib/course/quiz-generators.ts` — genMC / genMatch / sentence από λεξιλόγιο
- `src/lib/course/mount-app.ts` — πιστή λογική UI/quiz
- `src/lib/course/utils.ts` + `backup.ts` — typed helpers + Zod validation
- `public/manifest.webmanifest` + icons — PWA
- Serwist (`@serwist/turbopack`) — service worker χωρίς webpack-only next-pwa

## Troubleshooting

### Favicon (Safari tab δείχνει Vercel icon)

1. Επιβεβαίωσε στο production ότι ανοίγουν με **200**: `/favicon.ico`, `/favicon.png`, `/icons/icon-32.png`.
2. Hard refresh ή private window στο Safari (τα tab icons cache-άρονται πολύ επιθετικά).
3. Μην μπερδεύεις το **Vercel project avatar** (dashboard) με το browser favicon.
4. Τα static icons ζουν στο `public/` — όχι `src/app/favicon.ico` (Next metadata pipeline).

### PWA / Service Worker

1. Το SW καταχωρείται μόνο σε production build (`npm run build` && `npm run start` ή Vercel).
2. Στο DevTools → Application → Service Workers: URL `/serwist/sw.js`.
3. Αν δεις παλιό Workbox/`sw.js` από next-pwa: Unregister + Clear site data, μετά refresh.
4. Manifest: `/manifest.webmanifest`. Offline fallback: `/~offline`.

### Scroll / ροδέλα ποντικιού

Το scroll γίνεται στο `.scroll` μέσα σε κάθε οθόνη (`height: 100dvh` + `min-height: 0`). Αν κολλήσει, hard refresh μετά από deploy.

## Σημειώσεις

- Η πρόοδος μένει στο `localStorage` με τα ίδια keys όπως το HTML (+ `spanish_analytics_v1` για quizzes/ημέρα).
- Θέμα προεπιλογής: `prefers-color-scheme` (ρύθμιση «Σύστημα»).
- Speech recognition καλύτερα σε Chrome/Edge.
