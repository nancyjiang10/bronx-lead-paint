// Page settings
// These values are passed to the layout to control what appears on the page.
import { fetchComplaints } from '$lib/data/fetchComplaints.js';

export async function load() {
  const violations = await fetchComplaints();
  return {
    showHeader: true,
    showFooter: true,
    violations,
  };
}

