export function AppSkeleton() {
  return (
    <main className="app app-skeleton" aria-label="Φόρτωση εφαρμογής" aria-busy="true">
      <section className="screen">
        <header className="header skeleton-header">
          <div>
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-sub" />
          </div>
          <div className="header-right">
            <div className="skeleton-line skeleton-xp" />
            <div className="skeleton-line skeleton-meta" />
          </div>
        </header>
        <div className="tabs">
          <div className="skeleton-pill" />
          <div className="skeleton-pill" />
        </div>
        <div className="scroll">
          <div className="content">
            <div className="skeleton-card skeleton-card-lg" />
            <div className="skeleton-card" />
            <div className="skeleton-card" />
            <div className="skeleton-card" />
            <div className="skeleton-card" />
          </div>
        </div>
      </section>
    </main>
  );
}
