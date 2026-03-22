import { Button } from "../ui/Button";

export function ButtonTestSection() {
  return (
    <section className="mt-10 flex w-full flex-col gap-4 border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-foreground">
        Button Component Testing
      </h2>
      <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
        <Button
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </Button>
        <Button
          href="#top"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16V2M9 2L2 9M9 2L16 9"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        >
          Go up
        </Button>
      </div>
    </section>
  );
}
