<!--
@component
RankingCard.svelte — A horizontal card showing rank, optional image, title, and description.
-->
<script>
  let {
    rank = 0,
    href = '',
    image = '',
    imageAlt = '',
    credit = '',
    title = '',
    description = '',
    value = '',
    valueLabel = '',
    compact = false,
  } = $props();
</script>

{#snippet cardContent()}
  <div class="media">
    {#if image}
      <img src={image} alt={imageAlt} />
    {:else}
      <div class="placeholder" aria-hidden="true">
        <span class="rank">{rank}</span>
        <span class="placeholder-line placeholder-line-lg"></span>
        <span class="placeholder-line"></span>
        <span class="placeholder-line placeholder-line-sm"></span>
      </div>
    {/if}
    {#if value}
      <div class="value">
        <span class="value-number">{value}</span>
        {#if valueLabel}
          <span class="value-label">{valueLabel}</span>
        {/if}
      </div>
    {/if}
  </div>
  <div class="content">
    <h3 class="title">{title}</h3>
    {#if description}
      <p class="description">{description}</p>
    {/if}
    {#if credit}
      <p class="credit">{credit}</p>
    {/if}
  </div>
{/snippet}

{#if href}
  <a {href} class:ranking-card-compact={compact} class="ranking-card ranking-card-link">
    {@render cardContent()}
  </a>
{:else}
  <div class:ranking-card-compact={compact} class="ranking-card">
    {@render cardContent()}
  </div>
{/if}

<style lang="scss">
  .ranking-card {
    display: grid;
    gap: 0.85rem;
    padding: 0;
    border: 0;
    background: transparent;
  }

  .ranking-card-link {
    color: inherit;
    text-decoration: none;
    transition: transform 0.18s ease, opacity 0.18s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .ranking-card-compact {
    gap: 0.6rem;
  }

  .media {
    position: relative;
    overflow: hidden;
    aspect-ratio: 4 / 5;
    border: 1px solid rgba(26, 26, 26, 0.12);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(26, 26, 26, 0.22)),
      linear-gradient(135deg, #d9cab4, #f5efe4 46%, #b9a48a 100%);
  }

  .media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .rank {
    position: absolute;
    top: 0.8rem;
    left: 0.8rem;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    min-height: 2rem;
    padding: 0 0.45rem;
    border: 1px solid rgba(255, 255, 255, 0.65);
    border-radius: 999px;
    background: rgba(26, 26, 26, 0.55);
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #fff;
    text-align: center;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1rem;
    gap: 0.55rem;
    background:
      radial-gradient(circle at 20% 18%, rgba(255, 255, 255, 0.75), transparent 24%),
      linear-gradient(180deg, rgba(15, 15, 15, 0.06), rgba(15, 15, 15, 0.3)),
      linear-gradient(135deg, #e6d9c5, #c9b39a 40%, #f2ebe0 100%);
  }

  .placeholder-line {
    display: block;
    height: 0.65rem;
    max-width: 82%;
    background: rgba(255, 255, 255, 0.82);
  }

  .placeholder-line-lg {
    max-width: 92%;
    height: 1rem;
  }

  .placeholder-line-sm {
    max-width: 58%;
  }

  .content {
    min-width: 0;
    padding-bottom: 0.35rem;
  }

  .title {
    margin: 0;
    font-family: var(--font-serif);
    font-size: clamp(1.5rem, 2vw, 2.1rem);
    font-weight: var(--font-weight-semibold);
    line-height: 0.95;
    letter-spacing: -0.02em;
    color: var(--color-dark, #1a1a1a);
  }

  .description {
    margin: 0.5rem 0 0;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(26, 26, 26, 0.62);
    line-height: 1.5;
  }

  .credit {
    margin: 0.45rem 0 0;
    font-size: 0.72rem;
    line-height: 1.35;
    color: rgba(26, 26, 26, 0.55);
  }

  .value {
    position: absolute;
    right: 0.8rem;
    bottom: 0.8rem;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0.55rem 0.65rem;
    background: rgba(255, 255, 255, 0.88);
    border: 1px solid rgba(26, 26, 26, 0.08);
    backdrop-filter: blur(6px);
  }

  .value-number {
    display: block;
    font-family: var(--font-serif);
    font-size: 2rem;
    font-weight: var(--font-weight-semibold);
    line-height: 1.2;
    color: var(--color-dark, #1a1a1a);
  }

  .value-label {
    display: block;
    margin-top: -0.1rem;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(26, 26, 26, 0.62);
    line-height: 1.2;
  }
</style>
