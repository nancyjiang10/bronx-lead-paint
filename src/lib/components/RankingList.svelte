<!--
@component
RankingList.svelte — A container for RankingCard items with an optional title.
-->
<script>
  let {
    title = '',
    layout = 'list',
    children,
  } = $props();
</script>

<div class:ranking-list-grid={layout === 'grid'} class="ranking-list">
  {#if title}
    <h2 class="ranking-list-title">{title}</h2>
  {/if}
  <div class:ranking-list-items-grid={layout === 'grid'} class="ranking-list-items">
    {@render children()}
  </div>
</div>

<style lang="scss">
  .ranking-list {
    border: 1px solid var(--color-border, #ddd);
    border-radius: 0;
    overflow: hidden;
    background: var(--color-white, #fff);
  }

  .ranking-list-title {
    margin: 0;
    padding: var(--spacing-sm, 0.75rem) var(--spacing-md, 1rem);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: var(--color-white, #fff);
    border-bottom: 1px solid var(--color-border, #ddd);
  }

  .ranking-list-items {
    :global(> :last-child) {
      border-bottom: none;
    }
  }

  .ranking-list-grid .ranking-list-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1px;
    background: var(--color-border, #ddd);
  }

  .ranking-list-grid .ranking-list-items :global(> *) {
    border-bottom: 0;
    min-height: 100%;
  }
</style>
