import { fetchComplaints } from '../src/lib/data/fetchComplaints.js';

const top = (await fetchComplaints()).slice(0, 20);

function stripHtml(value = '') {
  return String(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

async function geocode(address) {
  const query = `${address}, New York, NY`;
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'dob-complaints/1.0 curation' },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data[0] || null;
}

async function fetchCommonsFiles(lat, lon, radius = 1200) {
  const query = `https://commons.wikimedia.org/w/api.php?action=query&generator=geosearch&ggscoord=${encodeURIComponent(`${lat}|${lon}`)}&ggsradius=${radius}&ggslimit=20&ggsnamespace=6&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1000&format=json&origin=*`;
  const response = await fetch(query);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const pages = Object.values(data.query?.pages || {});

  return pages
    .map((page) => {
      const info = page.imageinfo?.[0];
      const meta = info?.extmetadata || {};
      return {
        title: page.title,
        image: info?.thumburl || info?.url || '',
        descriptionUrl: info?.descriptionurl || '',
        license: stripHtml(meta.LicenseShortName?.value),
        artist: stripHtml(meta.Artist?.value),
        description: stripHtml(meta.ImageDescription?.value),
      };
    })
    .filter((entry) => entry.image);
}

const output = [];
for (const building of top) {
  const geo = await geocode(building.address);
  const candidates = geo ? await fetchCommonsFiles(geo.lat, geo.lon) : [];
  output.push({
    address: building.address,
    geocode: geo?.display_name || null,
    candidates: candidates.slice(0, 8),
  });
}

console.log(JSON.stringify(output, null, 2));
