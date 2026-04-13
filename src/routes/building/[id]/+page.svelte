<script>
  import DatabaseHeader from '$lib/components/DatabaseHeader.svelte';
  import MethodologyBox from '$lib/components/MethodologyBox.svelte';
  import LocatorMap from '$lib/components/LocatorMap.svelte';
  import { getCategoryDescription } from '$lib/data/fetchComplaints.js';

  let { data } = $props();

  const PRIORITY_OPTIONS = ['A', 'B', 'C', 'D', 'Unknown'];

  function normalizePriority(value) {
    const normalized = String(value || '').trim().toUpperCase();
    if (['A', 'B', 'C', 'D'].includes(normalized)) {
      return normalized;
    }

    return 'Unknown';
  }

  let selectedPriorities = $state([...PRIORITY_OPTIONS]);

  function togglePriority(priority) {
    const isSelected = selectedPriorities.includes(priority);
    const allSelected = selectedPriorities.length === PRIORITY_OPTIONS.length;

    // From the default "all" state, clicking one priority isolates it.
    if (allSelected && isSelected) {
      selectedPriorities = [priority];
      return;
    }

    if (isSelected) {
      // Keep at least one selected to avoid accidental empty table state.
      if (selectedPriorities.length === 1) {
        selectedPriorities = [...PRIORITY_OPTIONS];
        return;
      }

      selectedPriorities = selectedPriorities.filter((p) => p !== priority);
      return;
    }

    selectedPriorities = PRIORITY_OPTIONS.filter((option) =>
      selectedPriorities.includes(option) || option === priority
    );
  }

  let filteredViolations = $derived(
    data.building.violations.filter((violation) =>
      selectedPriorities.includes(normalizePriority(violation.priority))
    )
  );

  function formatDate(value) {
    if (!value) {
      return 'Unknown';
    }

    return value;
  }

  let earliestComplaint = $derived(
    data.building.violations.reduce((earliest, violation) => {
      if (!earliest) {
        return violation;
      }

      return violation.dateEntered < earliest.dateEntered ? violation : earliest;
    }, null)
  );

  let latestComplaint = $derived(
    data.building.violations.reduce((latest, violation) => {
      if (!latest) {
        return violation;
      }

      return violation.dateEntered > latest.dateEntered ? violation : latest;
    }, null)
  );

  let priorityCounts = $derived.by(() => {
    const counts = new Map();

    for (const violation of data.building.violations) {
      const priority = normalizePriority(violation.priority);
      counts.set(priority, (counts.get(priority) || 0) + 1);
    }

    return counts;
  });

  let dominantPriority = $derived.by(() => {
    let winner = 'Unknown';
    let winnerCount = -1;

    for (const priority of PRIORITY_OPTIONS) {
      const count = priorityCounts.get(priority) || 0;
      if (count > winnerCount) {
        winner = priority;
        winnerCount = count;
      }
    }

    return winner;
  });
</script>

<DatabaseHeader
  headline={data.building.address}
  description={`${data.building.violationCount} DOB complaints on record`}
>
  {#snippet graphic()}
    <div class="hero-media-stack">
      {#if data.building.image}
        <figure class="hero-photo">
          <img src={data.building.image} alt={data.building.imageAlt || `${data.building.address} exterior`} />
          {#if data.building.imageCredit}
            <figcaption>{data.building.imageCredit}</figcaption>
          {/if}
        </figure>
      {/if}

      <LocatorMap
        longitude={data.building.lng}
        latitude={data.building.lat}
        zoom={13}
        dot={true}
        width={250}
      />
    </div>
  {/snippet}
</DatabaseHeader>

<div class="container">
  <section class="summary-panel" aria-label="Complaint summary">
    <div class="summary-card summary-card-primary">
      <span class="summary-label">Total complaints</span>
      <strong>{data.building.violationCount}</strong>
      <span class="summary-detail">Since January 2020</span>
    </div>

    <div class="summary-card">
      <span class="summary-label">Date range</span>
      <strong>{formatDate(earliestComplaint?.dateEntered)} to {formatDate(latestComplaint?.dateEntered)}</strong>
      <span class="summary-detail">Most recent and earliest complaint on record</span>
    </div>

    <div class="summary-card">
      <span class="summary-label">Dominant priority</span>
      <strong>{dominantPriority}</strong>
      <span class="summary-detail">Most frequent complaint class</span>
    </div>
  </section>

  <div class="filters" aria-label="Filter by complaint priority">
    <span class="filters-label">Priority:</span>
    {#each PRIORITY_OPTIONS as priority}
      <button
        type="button"
        class:active={selectedPriorities.includes(priority)}
        onclick={() => togglePriority(priority)}
        aria-pressed={selectedPriorities.includes(priority)}
      >
        {priority}
      </button>
    {/each}
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Date entered</th>
          <th>Status</th>
          <th>Category</th>
          <th>Unit (Borough)</th>
          <th>Complaint #</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredViolations as violation (violation.complaintNumber)}
          <tr>
            <td>{violation.dateEntered}</td>
            <td>{violation.status}</td>
            <td>{getCategoryDescription(violation.complaintCategory)}</td>
            <td>{violation.unit}</td>
            <td>{violation.complaintNumber}</td>
          </tr>
        {:else}
          <tr>
            <td colspan="5">No complaints match the selected priority filters.</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <MethodologyBox>
    <p>
      The data on this page comes from the Department of Buildings
      <a href="https://data.cityofnewyork.us/resource/eabe-havv.json" target="_blank" rel="noopener noreferrer">via New York City's open data portal</a>.
    </p>
    <p>
      This page shows all complaints on record for the address listed above. The data has been extracted and aggregated from the city's official DOB Complaint Scoping Records database. The data is current as of April 2026.
    </p>
    <p>
      Records prior to January 2020 are excluded.
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
    padding: 0 var(--spacing-md);
  }

  .hero-media-stack {
    display: grid;
    gap: var(--spacing-sm);
    width: 100%;
    max-width: 400px;
  }

  .hero-photo {
    margin: 0;
    display: grid;
    gap: 0.5rem;
  }

  .hero-photo img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border: 1px solid rgba(26, 26, 26, 0.12);
    box-shadow: 0 18px 60px rgba(26, 26, 26, 0.08);
  }

  .hero-photo figcaption {
    font-family: var(--font-sans);
    font-size: 0.72rem;
    line-height: 1.35;
    color: rgba(26, 26, 26, 0.55);
  }

  .summary-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-sm);
    margin: 0 0 1rem;
  }

  .summary-card {
    background: var(--color-white);
    border: 1px solid var(--color-border);
    padding: 1rem;
  }

  .summary-card strong {
    display: block;
    margin-top: 0.35rem;
    font-family: var(--font-serif);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-normal);
    line-height: var(--leading-snug);
    color: var(--color-dark);
  }

  .summary-card-primary {
    border-top: 3px solid var(--color-accent);
  }

  .summary-label {
    display: block;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-wider);
    text-transform: uppercase;
    color: var(--color-medium-gray);
  }

  .summary-detail {
    display: block;
    margin-top: 0.35rem;
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    color: var(--color-medium-gray);
  }

  .filters {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1rem;
    flex-wrap: wrap;
  }

  .filters-label {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-wider);
    text-transform: uppercase;
    color: var(--color-medium-gray);
  }

  .filters button {
    border: 1px solid var(--color-border);
    background: var(--color-white);
    color: var(--color-dark);
    border-radius: 999px;
    padding: 0.35rem 0.6rem;
    cursor: pointer;
    font-weight: 600;
    min-width: 2.5rem;
  }

  .filters button.active {
    background: var(--color-dark);
    color: var(--color-white);
    border-color: var(--color-dark);
  }

  .table-wrap {
    border: 1px solid var(--color-border);
    overflow-x: auto;
    background: var(--color-white);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    text-align: left;
    padding: 0.85rem 0.9rem;
    border-bottom: 1px solid var(--color-border);
    vertical-align: top;
  }

  th {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-wider);
    text-transform: uppercase;
    color: var(--color-medium-gray);
    background: #fcfcfc;
  }

  tbody tr:hover {
    background: #fafafa;
  }
</style>