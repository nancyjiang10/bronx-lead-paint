const boroughQueries = {
  bronx: ['bronx apartment building nyc', 'south bronx building', 'bronx avenue building'],
  queens: ['queens apartment building nyc', 'queens avenue building', 'queens residential building'],
  manhattan: ['manhattan apartment building nyc', 'east village apartments new york', 'harlem brownstone'],
  brooklyn: ['brooklyn apartment building nyc', 'brooklyn brownstone building', 'brooklyn avenue building'],
};

const allowedLicenses = new Set(['by', 'by-sa', 'cc0', 'pdm', 'by-nc', 'by-nc-sa', 'by-nd', 'by-nc-nd']);

async function search(query) {
  const url = `https://api.openverse.engineering/v1/images/?q=${encodeURIComponent(query)}&license_type=all&source_facet=flickr,wikimedia+commons&page_size=20`;
  const response = await fetch(url);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.results || [];
}

const output = {};

for (const [borough, queries] of Object.entries(boroughQueries)) {
  const collected = [];
  const seen = new Set();

  for (const query of queries) {
    const results = await search(query);
    for (const result of results) {
      if (seen.has(result.url)) {
        continue;
      }
      seen.add(result.url);

      const license = String(result.license || '').toLowerCase();
      if (!allowedLicenses.has(license)) {
        continue;
      }

      const text = `${String(result.title || '').toLowerCase()} ${(result.tags || []).map((tag) => String(tag.name || '').toLowerCase()).join(' ')}`;
      if (!text.includes(borough)) {
        continue;
      }

      collected.push({
        title: result.title,
        image: result.url,
        creator: result.creator,
        source: result.source,
        license: result.license,
        licenseVersion: result.license_version,
        landing: result.foreign_landing_url,
      });

      if (collected.length >= 10) {
        break;
      }
    }

    if (collected.length >= 10) {
      break;
    }
  }

  output[borough] = collected;
}

console.log(JSON.stringify(output, null, 2));
