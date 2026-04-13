<script>
  import { base } from '$app/paths';
  import DatabaseHeader from '$lib/components/DatabaseHeader.svelte';
  import RankingList from '$lib/components/RankingList.svelte';
  import RankingCard from '$lib/components/RankingCard.svelte';
  import SearchInput from '$lib/components/SearchInput.svelte';
  import MethodologyBox from '$lib/components/MethodologyBox.svelte';

  let { data } = $props();

  let search = $state('');

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
  const featuredBuilding = $derived(filtered[0] || data.violations[0]);
  const featureStrip = $derived(filtered.slice(1, 4));

  function formatMeta(building) {
    const parts = [];

    if (building.communityBoard) {
      parts.push(`Community Board ${building.communityBoard}`);
    }

    if (building.zip) {
      parts.push(building.zip);
    }

    return parts.length > 0 ? parts.join(' • ') : 'New York City';
  }
</script>

<DatabaseHeader
  headline="DOB Complaints"
  description="An index of the New York buildings drawing the most Department of Buildings complaints since January 2020."
  byline="NYCity News Service"
  date="April 2026"
>
  {#snippet graphic()}
    <aside class="cover-panel" aria-label="Featured building summary">
      <div class="cover-frame">
        {#if featuredBuilding?.image}
          <div class="cover-image-wrap">
            <img src={featuredBuilding.image} alt={featuredBuilding.imageAlt || featuredBuilding.address} />
            {#if featuredBuilding.imageCredit}
              <span class="cover-image-credit">{featuredBuilding.imageCredit}</span>
            {/if}
          </div>
        {/if}

        <span class="cover-kicker">On the cover</span>
        <h2>{featuredBuilding?.address}</h2>
        <p class="cover-meta">{featuredBuilding ? formatMeta(featuredBuilding) : 'Top-ranked addresses in Manhattan, Brooklyn, and beyond'}</p>

        <div class="cover-stat">
          <span>Complaints</span>
          <strong>{featuredBuilding?.violationCount || 0}</strong>
        </div>

        <div class="cover-strip">
          {#each featureStrip as building (building.id)}
            <div class="cover-strip-item">
              <span>{building.address}</span>
              <strong>{building.violationCount}</strong>
            </div>
          {/each}
        </div>
      </div>
    </aside>
  {/snippet}

  <div class="search-wrapper">
    <SearchInput bind:value={search} placeholder="Search by address..." />
  </div>
</DatabaseHeader>

<div class="container">
  <div class="results-bar">
    <div class="results-meta">
      <span class="results-label">Selected stories</span>
      <span class="results-count">{filtered.length} of {totalBuildings} buildings</span>
    </div>
  </div>

  <RankingList title="Top buildings by complaint volume since January 2020" layout="grid">
    {#each filtered as building, index (building.id)}
      <RankingCard
        rank={index + 1}
        title={building.address}
        description={formatMeta(building)}
        href={`${base}/building/${building.id}`}
        image={building.image || ''}
        imageAlt={building.imageAlt || `${building.address} exterior`}
        credit={building.imageCredit || ''}
        value={building.violationCount}
        valueLabel="complaints"
        compact={false}
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
    <p>
      Photo disclaimer: images are sourced from open-licensed public repositories and may show nearby or representative buildings in the same area, not always the exact address listed.
    </p>
  </MethodologyBox>
</div>

<style>
  .container {
    max-width: var(--max-width-wide);
    margin: 0 auto;
    padding: 0 var(--spacing-md) var(--spacing-xl);
  }

  .search-wrapper {
    max-width: 46rem;
  }

  .results-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    margin: 0 0 var(--spacing-md);
    padding: 0 0 var(--spacing-sm);
    border-bottom: 1px solid rgba(26, 26, 26, 0.12);
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
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(26, 26, 26, 0.62);
  }

  .results-count {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    color: var(--color-dark);
  }

  .cover-panel {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    min-width: 0;
  }

  .cover-frame {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid rgba(26, 26, 26, 0.12);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(245, 241, 233, 0.96)),
      radial-gradient(circle at top right, rgba(126, 103, 72, 0.18), transparent 36%);
    box-shadow: 0 18px 60px rgba(26, 26, 26, 0.08);
  }

  .cover-image-wrap {
    display: grid;
    gap: 0.55rem;
    margin-bottom: var(--spacing-md);
  }

  .cover-image-wrap img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border: 1px solid rgba(26, 26, 26, 0.1);
  }

  .cover-image-credit {
    font-family: var(--font-sans);
    font-size: 0.7rem;
    line-height: 1.35;
    color: rgba(26, 26, 26, 0.55);
  }

  .cover-kicker {
    display: inline-block;
    margin-bottom: 0.7rem;
    font-family: var(--font-sans);
    font-size: 0.7rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(26, 26, 26, 0.58);
  }

  .cover-frame h2 {
    margin: 0 0 0.65rem;
    font-family: var(--font-serif);
    font-size: clamp(2rem, 4vw, 3.7rem);
    font-weight: var(--font-weight-semibold);
    line-height: 0.92;
    letter-spacing: -0.02em;
    color: var(--color-dark);
    text-wrap: balance;
  }

  .cover-meta {
    margin: 0 0 var(--spacing-md);
    max-width: 30ch;
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    line-height: var(--leading-relaxed);
    color: rgba(26, 26, 26, 0.72);
  }

  .cover-stat {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: var(--spacing-sm);
    padding: 0.9rem 0;
    border-top: 1px solid rgba(26, 26, 26, 0.1);
    border-bottom: 1px solid rgba(26, 26, 26, 0.1);
    margin-bottom: var(--spacing-md);
  }

  .cover-stat span,
  .cover-strip-item span {
    font-family: var(--font-sans);
    font-size: 0.72rem;
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(26, 26, 26, 0.58);
  }

  .cover-stat strong {
    font-family: var(--font-serif);
    font-size: clamp(3rem, 7vw, 5rem);
    font-weight: var(--font-weight-semibold);
    line-height: 0.9;
    color: var(--color-dark);
  }

  .cover-strip {
    display: grid;
    gap: 0.75rem;
  }

  .cover-strip-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--spacing-sm);
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(26, 26, 26, 0.08);
  }

  .cover-strip-item strong {
    font-family: var(--font-serif);
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-semibold);
    line-height: 1;
    color: var(--color-dark);
  }
</style>


