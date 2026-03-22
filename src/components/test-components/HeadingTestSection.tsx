import { Heading } from "../ui/Heading";

export function HeadingTestSection() {
  return (
    <section className="mt-10 flex w-full flex-col gap-6 border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-foreground">
        Heading Component Testing
      </h2>
      <div className="flex flex-col gap-8">
        <Heading as="h2" size="hero-1" tone="foreground">
          Hero 1
        </Heading>
        <Heading as="h2" size="hero-2" tone="accent">
          Hero 2
        </Heading>
        <Heading as="h2" size="display-128" tone="foreground-secondary">
          Display 128
        </Heading>
        <Heading as="h2" size="display-96" tone="accent">
          Display 96
        </Heading>
        <Heading as="h2" size="display-48" tone="accent">
          Display 48
        </Heading>
        <Heading as="h2" size="years" tone="foreground">
          Years
        </Heading>
      </div>
    </section>
  );
}
