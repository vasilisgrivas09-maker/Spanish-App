# Español Course (Next.js)

Πιστή μεταφορά του standalone HTML Español Course σε **Next.js App Router + TypeScript**.

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
| `npm run build` | Production build + PWA (webpack) |
| `npm run start` | Production server |
| `npm test` | Unit tests |
| `npm run lint` | ESLint |

## Αρχιτεκτονική

- `src/app` — App Router shell, metadata, CSS
- `src/components/SpanishCourseApp.tsx` — client mount
- `src/lib/course/data.ts` — λεξιλόγιο / γραμματική / διάλογοι
- `src/lib/course/mount-app.ts` — πιστή λογική UI/quiz
- `src/lib/course/utils.ts` + `backup.ts` — typed helpers + Zod validation
- `public/manifest.webmanifest` + icons — PWA

## Σημειώσεις

- Η πρόοδος μένει στο `localStorage` με τα ίδια keys όπως το HTML.
- Speech recognition καλύτερα σε Chrome/Edge.
- Το PWA ενεργοποιείται στο production build (`npm run build` && `npm start`).
