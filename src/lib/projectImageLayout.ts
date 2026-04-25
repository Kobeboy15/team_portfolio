export const PROJECT_IMAGE_LAYOUT = {
  intrinsicWidth: 443,
  intrinsicHeight: 591,
  /**
   * Keep `sizes` aligned with the card's max-width constraints:
   * - base/md: up to 443px
   * - lg: 360px
   * - xl: 443px
   * - 2xl+: fluid via `--token-project-image-width`
   */
  sizes:
    "(min-width: 3840px) 1570px, (min-width: 3200px) 1300px, (min-width: 2560px) 1000px, (min-width: 1920px) 675px, (min-width: 1536px) 443px, (min-width: 1280px) 443px, (min-width: 1024px) 360px, (min-width: 768px) 443px, 100vw",
  frameClassName:
    "relative w-full overflow-hidden lg:max-w-[360px] xl:max-w-[443px] 2xl:max-w-(--token-project-image-width)",
} as const;
