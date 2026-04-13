<script>
  import { base } from '$app/paths';
  import DatabaseHeader from '$lib/components/DatabaseHeader.svelte';
  import RankingList from '$lib/components/RankingList.svelte';
  import RankingCard from '$lib/components/RankingCard.svelte';
  import SearchInput from '$lib/components/SearchInput.svelte';
  import MethodologyBox from '$lib/components/MethodologyBox.svelte';

  let { data } = $props();

  let search = $state('');
  let viewMode = $state('list');

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  }

  let normalizedSearch = $derived(normalizeText(search));

  let filtered = $derived(
    data.violations
      .filter((b) => normalizeText(b.address).includes(normalizedSearch))
      .sort((a, b) => b.violationCount - a.violationCount)
      .slice(0, normalizedSearch ? data.violations.length : 20)
  );

  const totalBuildings = $derived(data.violations.length);
</script>

<DatabaseHeader
  headline="NYC Department of Buildings Complaints"
  description="Buildings with the most complaints filed with the Department of Buildings"
  byline="NYCity News Service"
  date="April 2026"
>
  <div class="search-wrapper">
    <SearchInput bind:value={search} placeholder="Search by address..." />
  </div>
</DatabaseHeader>

<div class="container">
  <div class="results-bar">
    <div class="results-meta">
      <span class="results-label">Results</span>
      <span class="results-count">{filtered.length} of {totalBuildings} buildings</span>
    </div>

    <div class="view-switch" aria-label="Choose results view">
      <button type="button" class:active={viewMode === 'list'} onclick={() => (viewMode = 'list')}>List</button>
      <button type="button" class:active={viewMode === 'grid'} onclick={() => (viewMode = 'grid')}>Grid</button>
    </div>
  </div>

  <RankingList title="Top buildings by complaint volume (since January 2020)" layout={viewMode}>
    {#each filtered as building, index (building.id)}
      <RankingCard
        rank={index + 1}
        title={building.address}
        href={`${base}/building/${building.id}`}
        value={building.violationCount}
        compact={viewMode === 'grid'}
      />
    {/each}
  </RankingList>

  <MethodologyBox>
    <p>
      The data on this page comes from the Department of Buildings
      <a href="https://data.cityofnewyork.us/resource/eabe-havv.json" target="_blank" rel="noopener noreferrer">via New York City's open data portal</a>.
    </p>
    <p>
      This database tracks all complaints filed with the Department of Buildings (DOB). The data has been aggregated by building address to show which locations have the most complaints on record. The data is current as of April 2026.
    </p>
    <p>
      Records prior to January 2020 are excluded from this analysis.
    </p>
  </MethodologyBox>
</div>

<style>
  .container {
    max-width: var(--max-width-wide);
    margin: 0 auto;
    padding: 0 var(--spacing-md) var(--spacing-lg);
  }

  .search-wrapper {
    max-width: 42rem;
  }

  .results-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    margin: 0 0 var(--spacing-sm);
    padding: 0 0 var(--spacing-sm);
    border-bottom: 1px solid var(--color-border);
  }

  .results-meta {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-sm);
  }

  .results-label {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-wider);
    text-transform: uppercase;
    color: var(--color-medium-gray);
  }

  .results-count {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    color: var(--color-dark);
  }

  .view-switch {
    display: inline-flex;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    overflow: hidden;
    background: var(--color-white);
  }

  .view-switch button {
    border: 0;
    background: transparent;
    color: var(--color-medium-gray);
    padding: 0.45rem 0.85rem;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-wider);
    text-transform: uppercase;
    cursor: pointer;
  }

  .view-switch button.active {
    background: var(--color-dark);
    color: var(--color-white);
  }
</style>


