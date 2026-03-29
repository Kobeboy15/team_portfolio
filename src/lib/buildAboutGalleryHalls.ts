import type {
  AboutGalleryHall,
  AboutSlide,
  AboutTimelineSeparator,
} from "../types/about";

const MISC_GROUP_KEY = "__misc__";
const MISC_DISPLAY_YEAR = "Other";

const WALL_BACKGROUND_CLASSES = [
  "bg-wall-background-1",
  "bg-wall-background-2",
  "bg-wall-background-3",
] as const;

function groupKeyForSlide(slide: AboutSlide): string {
  const y = slide.year?.trim();
  if (!y) {
    return MISC_GROUP_KEY;
  }
  return y;
}

function sortYearKeys(keys: string[]): string[] {
  const numeric = keys.filter((k) => k !== MISC_GROUP_KEY).sort((a, b) => Number(a) - Number(b));
  const hasMisc = keys.includes(MISC_GROUP_KEY);
  return hasMisc ? [...numeric, MISC_GROUP_KEY] : numeric;
}

function sortSlidesForYear(slides: AboutSlide[]): AboutSlide[] {
  return [...slides].sort((a, b) => a.image.localeCompare(b.image));
}

function displayYearForKey(key: string): string {
  return key === MISC_GROUP_KEY ? MISC_DISPLAY_YEAR : key;
}

function yearIdForKey(key: string): string {
  const slug = key === MISC_GROUP_KEY ? "misc" : key.replace(/\s+/g, "-").toLowerCase();
  return `about-gallery-wall-${slug}`;
}

function separatorMapFromList(list: AboutTimelineSeparator[]): Map<string, { src: string; alt: string }> {
  const map = new Map<string, { src: string; alt: string }>();
  for (const row of list) {
    const y = row.year.trim();
    if (y) {
      map.set(y, { src: row.src, alt: row.alt });
    }
  }
  return map;
}

/**
 * Groups slides by year (misc bucket when `year` missing), sorts halls, resolves separators, cycles wall backgrounds.
 */
export function buildAboutGalleryHalls(
  slides: AboutSlide[],
  timelineSeparators: AboutTimelineSeparator[],
): AboutGalleryHall[] {
  if (slides.length === 0) {
    return [];
  }

  const byYear = new Map<string, AboutSlide[]>();
  for (const slide of slides) {
    const key = groupKeyForSlide(slide);
    const list = byYear.get(key);
    if (list) {
      list.push(slide);
    } else {
      byYear.set(key, [slide]);
    }
  }

  const orderedKeys = sortYearKeys([...byYear.keys()]);
  const sepByYear = separatorMapFromList(timelineSeparators);

  return orderedKeys.map((key, hallIndex) => {
    const rawSlides = byYear.get(key)!;
    const orderedSlides = sortSlidesForYear(rawSlides);
    const lastSlide = orderedSlides[orderedSlides.length - 1]!;

    const sepFromConfig =
      key === MISC_GROUP_KEY ? undefined : sepByYear.get(key);
    const separator = sepFromConfig ?? {
      src: lastSlide.image,
      alt: lastSlide.imageAlt,
    };

    return {
      year: displayYearForKey(key),
      yearId: yearIdForKey(key),
      separator,
      slides: orderedSlides,
      backgroundClassName: WALL_BACKGROUND_CLASSES[hallIndex % WALL_BACKGROUND_CLASSES.length]!,
    };
  });
}
