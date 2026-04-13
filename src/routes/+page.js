// Page settings
// These values are passed to the layout to control what appears on the page.
import { fetchComplaints } from '$lib/data/fetchComplaints.js';
import { enrichBuildingsWithImages } from '$lib/data/buildingImages.js';

export async function load() {
  const violations = await fetchComplaints();
  const enrichedViolations = await enrichBuildingsWithImages(violations, 20);
  return {
    showHeader: true,
    showFooter: true,
    violations: enrichedViolations,
  };
}

