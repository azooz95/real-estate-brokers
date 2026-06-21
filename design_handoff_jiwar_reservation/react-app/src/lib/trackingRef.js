// The broker's tracking link puts ?ref=ID-xxxx on the URL, but only on
// whichever page the client first lands on — every later in-app navigation
// (Home -> Projects -> UnitDetail -> Reserve) uses plain paths with no query
// string, so the ref would otherwise be lost before the reservation is made.
// Captured once per browser session and read back wherever it's needed.
const KEY = 'jiwar.client.brokerRef';

export function captureTrackingRef() {
  const fromUrl = new URLSearchParams(window.location.search).get('ref');
  if (fromUrl) sessionStorage.setItem(KEY, fromUrl);
  return fromUrl ?? sessionStorage.getItem(KEY) ?? null;
}

export function getTrackingRef() {
  return sessionStorage.getItem(KEY) ?? null;
}
