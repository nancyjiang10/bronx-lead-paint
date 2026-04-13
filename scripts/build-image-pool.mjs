const queries = [
  'new york apartment building',
  'brooklyn residential building',
  'manhattan street building',
  'bronx apartment building',
  'queens street building',
];

const allowedLicenses = new Set(['by', 'by-sa', 'cc0', 'pdm', 'by-nc', 'by-nc-sa', 'by-nd', 'by-nc-nd']);
const locationPattern = /(new york|nyc|brooklyn|manhattan|bronx|queens|harlem|soho|chelsea|williamsburg)/;

const allResults = [];
for (const query of queries) {
  const url = `https://api.openverse.engineering/v1/images/?q=${encodeURIComponent(query)}&license_type=all&source_facet=flickr,wikimedia+commons&page_size=20`;
  const response = await fetch(url);

  if (!response.ok) {
    continue;
  }

  const data = await response.json();
  for (const result of data.results || []) {
    allResults.push(result);
  }
}

const seen = new Set();
const curated = [];

for (const result of allResults) {
  if (seen.has(result.url)) {
    continue;
  }
  seen.add(result.url);

  const license = String(result.license || '').toLowerCase();
  if (!allowedLicenses.has(license)) {
    continue;
  }

  const title = String(result.title || '').toLowerCase();
  const tags = (result.tags || []).map((tag) => String(tag.name || '').toLowerCase()).join(' ');
  const text = `${title} ${tags}`;
  if (!locationPattern.test(text)) {
    continue;
  }

  curated.push({
    title: result.title,
    image: result.url,
    creator: result.creator,
    source: result.source,
    license: result.license,
    licenseVersion: result.license_version,
    landing: result.foreign_landing_url,
  });

  if (curated.length >= 40) {
    break;
  }
}

console.log(JSON.stringify(curated, null, 2));
