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
    border-bottom: 1px solid var(--color-border);
    background: var(--color-white);
  }

  .masthead-wrapper {
    background: var(--color-white);
  }

  .masthead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    padding: 0.9rem var(--spacing-md);
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
    align-items: stretch;
    border: 1px solid var(--color-border);
    background: var(--color-white);
  }

  .logo-nycity {
    background-color: var(--color-white);
    color: var(--color-accent);
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    padding: var(--logo-padding-mobile);
    letter-spacing: var(--letter-spacing-wide);
    text-transform: uppercase;
    display: flex;
    align-items: center;
  }

  .logo-news-service {
    color: var(--color-dark);
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-normal);
    padding: var(--logo-padding-mobile);
    letter-spacing: var(--letter-spacing-tight);
    display: flex;
    align-items: center;
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
    color: var(--color-medium-gray);
    text-decoration: none;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
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
      padding: 1rem var(--spacing-lg);
    }

    .logo-nycity {
      font-size: var(--font-size-base);
      padding: var(--logo-padding-desktop);
    }

    .logo-news-service {
      font-size: var(--font-size-base);
      padding: var(--logo-padding-desktop);
    }

    .main-nav {
      display: flex;
      align-items: center;
    }
  }
</style>
