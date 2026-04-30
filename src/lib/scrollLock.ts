/**
 * Cooperative document scroll lock via reference counting.
 *
 * Multiple features (initial loader, mobile nav, etc.) may need to prevent
 * background scroll at the same time. Each owner calls `lockScroll()` once and
 * must pair it with `unlockScroll()` (typically in a `useEffect` cleanup).
 *
 * Implementation: a single global depth counter. When depth goes from 0 → 1 we
 * snapshot inline `overflow` on `document.documentElement` and `document.body`,
 * then set both to `"hidden"`. When depth returns to 0 we restore those values.
 * Unlocking when depth is already 0 is a no-op (development warning).
 */

let depth = 0;
let savedHtmlOverflow = "";
let savedBodyOverflow = "";

export function lockScroll(): void {
  if (depth === 0) {
    savedHtmlOverflow = document.documentElement.style.overflow;
    savedBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
  depth += 1;
}

export function unlockScroll(): void {
  if (depth === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[scrollLock] unlockScroll called with depth 0");
    }
    return;
  }

  depth -= 1;

  if (depth === 0) {
    document.documentElement.style.overflow = savedHtmlOverflow;
    document.body.style.overflow = savedBodyOverflow;
  }
}
