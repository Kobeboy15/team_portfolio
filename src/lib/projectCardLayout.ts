/**
 * Fixed **content** heights for the desktop (lg+) project card skeleton.
 * Labels sit outside these boxes. Edit here to retune the sticky-scroll frame.
 *
 * Tech, Outcomes, and link rows in `ProjectCardDesktop` are always mounted
 * (with empty placeholders when needed) so the sticky index swap does not
 * shift layout.
 *
 * @see https://valentincheval.design/projects/
 */
export const PROJECT_CARD_DESKTOP_CONTENT_HEIGHT_PX = {
  title: 154,
  year: 48,
  description: 200,
  /** One line of body text */
  role: 24,
  /** ~4 lines incl. gaps between list items */
  techStack: 108,
  /** ~4 outcomes × ~3 lines each incl. gaps */
  outcomes: 304,
} as const;

/** Reserved height per link row (View more / GitHub) in the desktop skeleton. */
export const PROJECT_CARD_DESKTOP_LINK_ROW_MIN_HEIGHT_PX = 24;

export type ProjectCardDesktopContentRegion = keyof typeof PROJECT_CARD_DESKTOP_CONTENT_HEIGHT_PX;
