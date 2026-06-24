<template>
  <section class="container section about-page">
    <div class="glass-card hero-panel about-hero">
      <div class="about-copy">
        <p class="eyebrow">About Agora</p>
        <h1>A safer marketplace for campus trading.</h1>
        <p class="lead">
          Agora helps verified students buy, sell, and exchange items within a trusted campus
          community. Every account is tied to student verification so buyers and sellers can trade
          with more confidence.
        </p>
      </div>
      <div class="creator-card">
        <span class="creator-label">Built by</span>
        <strong>Serge</strong>
        <a href="https://github.com/CarmineAkanabe" target="_blank" rel="noreferrer">
          github.com/CarmineAkanabe
        </a>
      </div>
    </div>

    <div class="value-grid">
      <div class="card value-card">
        <span class="value-icon">ID</span>
        <h2>Verified identity</h2>
        <p>Profiles are reviewed before students can fully transact.</p>
      </div>
      <div class="card value-card">
        <span class="value-icon">OK</span>
        <h2>Secure requests</h2>
        <p>Buyers can request items and sellers can approve or decline them.</p>
      </div>
      <div class="card value-card">
        <span class="value-icon">FCFA</span>
        <h2>Escrow support</h2>
        <p>Payments are protected until delivery and pickup are confirmed.</p>
      </div>
    </div>

    <div class="card story-card">
      <div>
        <p class="eyebrow">Why it matters</p>
        <h2>Built for real student exchanges, not anonymous classifieds.</h2>
      </div>
      <p>
        The platform combines campus identity checks, seller approval, mobile money escrow, pickup
        codes, and dispute handling so students can trade with a clear process from request to handoff.
      </p>
    </div>
  </section>
</template>

<style scoped>
.about-page {
  display: grid;
  gap: var(--spacing-8);
}

.about-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: var(--spacing-8);
  align-items: end;
  padding: var(--spacing-10);
}

.eyebrow {
  color: var(--color-accent);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.about-copy h1 {
  max-width: 780px;
  margin-top: var(--spacing-4);
  font-size: clamp(2.25rem, 5vw, 4.25rem);
  line-height: 1.05;
}

.lead {
  max-width: 820px;
  margin-top: var(--spacing-5);
  font-size: var(--font-size-lg);
}

.creator-card {
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--spacing-2);
  padding: var(--spacing-6);
  border: 1px solid rgba(45, 212, 191, 0.24);
  border-radius: var(--radius-md);
  background: rgba(12, 16, 22, 0.62);
}

.creator-label {
  color: var(--color-text-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.creator-card strong {
  color: var(--color-text-1);
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
}

.creator-card a {
  overflow-wrap: anywhere;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

.value-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-6);
}

.value-card {
  min-height: 210px;
}

.value-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 34px;
  margin-bottom: var(--spacing-5);
  padding-inline: var(--spacing-3);
  border-radius: var(--radius-full);
  background: var(--color-primary-ghost);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.value-card h2,
.story-card h2 {
  font-size: var(--font-size-2xl);
}

.value-card p {
  margin-top: var(--spacing-3);
}

.story-card {
  display: grid;
  grid-template-columns: 0.85fr 1fr;
  gap: var(--spacing-8);
  align-items: start;
}

.story-card p:last-child {
  font-size: var(--font-size-lg);
}

@media (max-width: 900px) {
  .about-hero,
  .story-card {
    grid-template-columns: 1fr;
  }

  .value-grid {
    grid-template-columns: 1fr;
  }
}
</style>
