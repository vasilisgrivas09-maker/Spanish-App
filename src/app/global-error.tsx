"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="el">
      <body style={{ margin: 0, background: "#070714", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ padding: 24, maxWidth: 480 }}>
          <h1>Σφάλμα εφαρμογής</h1>
          <p>Προέκυψε μη αναμενόμενο σφάλμα. Δοκίμασε ξανά.</p>
          <button type="button" onClick={reset} style={{ padding: "12px 16px", borderRadius: 12, border: 0 }}>
            Επαναφόρτωση
          </button>
        </main>
      </body>
    </html>
  );
}
