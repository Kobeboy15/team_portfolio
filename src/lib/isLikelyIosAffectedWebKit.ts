export function isLikelyIosAffectedWebKit(): boolean {
  if (typeof navigator === "undefined") return false;
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return true;
  // iPadOS desktop Safari often reports MacIntel + touch.
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return true;
  return false;
}
