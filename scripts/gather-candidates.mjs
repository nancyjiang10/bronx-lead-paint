import { fetchComplaints } from '../src/lib/data/fetchComplaints.js';

const top = (await fetchComplaints()).slice(0, 20);

async function geocode(address) {
  const query = `${address}, New York, NY`;
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'dob-complaints/1.0 curation' },
  });
  const data = await response.json();
  return data[0] || null;
}

function boroughFromDisplay(display = '') {
  const lower = display.toLowerCase();
  if (lower.includes('manhattan')) return 'Manhattan';
  if (lower.includes('brooklyn')) return 'Brooklyn';
  if (lower.includes('queens')) return 'Queens';
  if (lower.includes('bronx')) return 'Bronx';
  if (lower.includes('staten island')) return 'Staten Island';
  return '';
}

async function searchOpenverse(query) {
  const url = `https://api.openverse.engineering/v1/images/?q=${encodeURIComponent(query)}&license_type=all&source_facet=wikimedia+commons,flickr&page_size=8`;
  const response = await fetch(url);
  const data = await response.json();

  return {
    count: data.result_count || 0,
    results: (data.results || []).slice(0, 6).map((result) => ({
      title: result.title,
      creator: result.creator,
      license: result.license,
      source: result.source,
      url: result.url,
      landing: result.foreign_landing_url,
      tags: (result.tags || []).slice(0, 6).map((tag) => tag.name),
    })),
  };
}

const output = [];
for (const building of top) {
  const geocodeMatch = await geocode(building.address);
  const borough = boroughFromDisplay(geocodeMatch?.display_name || '');
  const queries = [
    `${building.address} ${borough} New York building`,
    `${building.address} ${borough} New York`,
    `${building.address} building New York`,
  ];

  const attempts = [];
  for (const query of queries) {
    attempts.push({
      query,
      ...(await searchOpenverse(query)),
    });
  }

  output.push({
    address: building.address,
    borough,
    geocode: geocodeMatch?.display_name || null,
    attempts,
  });
}

console.log(JSON.stringify(output, null, 2));
