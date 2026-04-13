<!--
@component
DatabaseHeader.svelte — A full-width hero header with optional background color,
headline, byline, date, description, children slot for additional content (e.g.
search controls), and an optional graphic snippet that renders in a right column.

When `graphic` is provided the inner layout becomes a two-column flex row
(text + controls on the left, graphic on the right). Without `graphic` the
layout is single-column and backward-compatible.
-->
<script>
  let {
    headline = '',
    description = '',
    byline = '',
    date = '',
    bgColor = 'var(--color-light-gray)',
    children,
    graphic,
  } = $props();
</script>

<header
  class="hero-header"
  style:background-color={bgColor}
>
  <div class="hero-inner" class:has-graphic={!!graphic}>
    <div class="hero-left">
      <div class="hero-content">
        {#if headline}
          <h1 class="hero-headline">{headline}</h1>
        {/if}
        {#if description}
          <p class="hero-description">{description}</p>
        {/if}
        {#if byline}
          <p class="hero-byline">{byline}</p>
        {/if}
        {#if date}
          <p class="hero-date">{date}</p>
        {/if}
      </div>
      {#if children}
        <div class="hero-extra">
          {@render children()}
        </div>
      {/if}
    </div>
    {#if graphic}
      <div class="hero-graphic">
        {@render graphic()}
      </div>
    {/if}
  </div>
</header>

<style lang="scss">
  @use '../styles' as *;

  .hero-header {
    width: 100%;
    padding: var(--spacing-lg) var(--spacing-md) var(--spacing-xl);
    background:
      radial-gradient(circle at top right, rgba(26, 26, 26, 0.05), transparent 36%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.15));
    border-bottom: 1px solid rgba(26, 26, 26, 0.1);
  }

  .hero-inner {
    max-width: var(--max-width-wide);
    margin: 0 auto;
  }

  /* Two-column layout when a graphic snippet is provided */
  .hero-inner.has-graphic {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
    gap: var(--spacing-lg);
    align-items: start;
  }

  .hero-left {
    flex: 1;
  }

  .hero-content {
    max-width: var(--max-width);
  }

  .hero-headline {
    font-family: var(--font-serif);
    font-size: clamp(2.75rem, 6vw, 5.5rem);
    font-weight: var(--font-weight-semibold);
    line-height: 0.9;
    color: var(--color-dark);
    margin-bottom: var(--spacing-sm);
    max-width: 12ch;
    text-wrap: balance;
  }

  .hero-byline {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    color: rgba(26, 26, 26, 0.7);
    margin: 0.1rem 0;
  }

  .hero-date {
    font-family: var(--font-sans);
    font-size: 0.75rem;
    color: rgba(26, 26, 26, 0.55);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    margin: 0.1rem 0 0;
  }

  .hero-description {
    font-family: var(--font-sans);
    font-size: var(--font-size-base);
    line-height: var(--leading-relaxed);
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
    max-width: 44ch;
  }

  .hero-extra {
    margin-top: var(--spacing-sm);
    max-width: 44rem;
  }

  .hero-graphic {
    flex: 1;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    margin: 0;
    min-width: 0;
  }

  @include tablet {
    .hero-header {
      padding: var(--spacing-xl) var(--spacing-md) var(--spacing-xl);
    }

    .hero-inner.has-graphic {
      grid-template-columns: minmax(0, 1fr) minmax(320px, 0.78fr);
    }

    .hero-headline {
      max-width: 11ch;
    }

    .hero-description {
      font-size: var(--font-size-lg);
    }

    .hero-graphic {
      max-width: none;
    }
  }

  @include desktop {
    .hero-inner {
      padding: 0 var(--spacing-md);
    }
    .hero-headline {
      font-size: clamp(4.5rem, 6vw, 7rem);
    }

    .hero-extra {
      margin-top: var(--spacing-md);
    }
  }
</style>
