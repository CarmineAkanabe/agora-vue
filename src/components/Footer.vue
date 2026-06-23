<template>
  <footer class="footer">
    <div class="container footer-inner">

      <!-- Brand -->
      <div class="footer-brand">
        <span class="footer-logo">Agora<span class="footer-dot">.</span></span>
        <p class="footer-tagline">The verified campus marketplace.</p>
      </div>

      <!-- Links -->
      <nav class="footer-links">
        <router-link :to="{ name: 'browse' }" class="footer-link">Browse</router-link>
        <router-link :to="{ name: 'about' }"  class="footer-link">About</router-link>
        <router-link :to="{ name: 'login' }"  class="footer-link">Login</router-link>
      </nav>

      <!-- Copyright -->
      <p class="footer-copy">&copy; {{ year }} Agora. All rights reserved.</p>

    </div>
  </footer>
</template>

<script setup>
defineOptions({ name: 'AppFooter' })

const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  background-color: var(--color-surface-2);
  padding-block: var(--spacing-10);
  margin-top: auto;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-8);
  flex-wrap: wrap;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.footer-logo {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-1);
}

.footer-dot {
  color: var(--color-primary);
}

.footer-tagline {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
}

.footer-links {
  display: flex;
  gap: var(--spacing-6);
}

.footer-link {
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-link:hover {
  color: var(--color-text-1);
}

.footer-copy {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
}

@media (max-width: 640px) {
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-6);
  }
}
</style>
