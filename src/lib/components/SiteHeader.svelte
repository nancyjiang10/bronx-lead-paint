<!--
@component
SiteHeader.svelte — NYCity News Service Style Header
-->
<script>
  let {
    navLinks = [],
  } = $props();
</script>

<header class="site-header">
  <div class="masthead-wrapper">
    <div class="masthead">
      <a href="https://www.nycitynewsservice.com/" class="logo" aria-label="NYCity News Service">
        <span class="logo-text">
          <span class="logo-nycity">NYCity</span>
          <span class="logo-news-service">News Service</span>
        </span>
      </a>

      {#if navLinks.length > 0}
        <nav class="main-nav" aria-label="Main navigation">
          <ul class="nav-list">
            {#each navLinks as link (link.href)}
              <li>
                <a href={link.href} class="nav-link">{link.label}</a>
              </li>
            {/each}
          </ul>
        </nav>
      {/if}
    </div>
  </div>
</header>

<style lang="scss">
  @use '../styles' as *;

  .site-header {
    border-bottom: 1px solid rgba(26, 26, 26, 0.12);
    background: rgba(246, 242, 234, 0.92);
    backdrop-filter: blur(10px);
  }

  .masthead-wrapper {
    background: var(--color-white);
  }

  .masthead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    padding: 0.8rem var(--spacing-md);
    max-width: var(--max-width-wide);
    margin: 0 auto;
  }

  .logo {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
  }

  .logo:hover {
    text-decoration: none;
  }

  .logo-text {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.1rem;
  }

  .logo-nycity {
    color: var(--color-dark);
    font-family: var(--font-serif);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--letter-spacing-tight);
    text-transform: uppercase;
    line-height: 1;
  }

  .logo-news-service {
    color: var(--color-dark);
    font-family: var(--font-sans);
    font-size: 0.7rem;
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    line-height: 1;
  }

  .main-nav {
    display: none;
  }

  .nav-list {
    display: flex;
    flex-wrap: nowrap;
    list-style: none;
    gap: var(--spacing-md);
    margin: 0;
    padding: 0;
  }

  .nav-link {
    color: rgba(26, 26, 26, 0.68);
    text-decoration: none;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    white-space: nowrap;
    transition: var(--transition-opacity);
  }

  .nav-link:hover {
    color: var(--color-dark);
    text-decoration: none;
  }

  @include desktop {
    .masthead {
      justify-content: space-between;
      padding: 0.9rem var(--spacing-lg);
    }

    .logo-nycity {
      font-size: var(--font-size-2xl);
    }

    .logo-news-service {
      font-size: 0.75rem;
    }

    .main-nav {
      display: flex;
      align-items: center;
    }
  }
</style>
