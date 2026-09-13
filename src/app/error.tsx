"use client";

import { useEffect } from "react";

interface CourseErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CourseError({ error, reset }: CourseErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="app">
      <section className="screen">
        <div className="scroll">
          <div className="content">
            <div className="lesson-card">
              <h1>Κάτι πήγε στραβά</h1>
              <p>Η εφαρμογή δεν μπόρεσε να φορτώσει αυτή τη σελίδα. Η πρόοδός σου στο localStorage παραμένει ασφαλή.</p>
              <button className="big-button" type="button" onClick={reset}>
                <span>
                  <span className="big-button-title">Δοκίμασε ξανά</span>
                  <span className="big-button-sub">Επαναφόρτωση της οθόνης</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
