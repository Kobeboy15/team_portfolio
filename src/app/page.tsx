import Image from "next/image";
import { Section } from "../components/ui/Section";
import { Button } from "../components/ui/Button";
import { Heading } from "../components/ui/Heading";
import { Card } from "../components/ui/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Section
        spacing="lg"
        withSectionGap
        className="flex min-h-screen items-center justify-center"
      >
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white py-32 px-16 dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>

        {/* Temporary section for testing the Button component */}
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

        {/* Temporary section for testing the Heading component */}
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

        {/* Temporary section for testing the Card component */}
        <section className="mt-10 flex w-full flex-col gap-6 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground">
            Card Component Testing
          </h2>
          <div className="flex flex-wrap gap-4">
            <Card size="4" variant="background2">
              <div className="flex h-full items-center justify-center p-4 text-foreground">
                background2
              </div>
            </Card>
            <Card size="4" variant="accent">
              <div className="flex h-full items-center justify-center p-4 text-accent-foreground">
                accent
              </div>
            </Card>
            <Card size="4" variant="gradient">
              <div className="flex h-full items-center justify-center p-4 text-foreground">
                gradient
              </div>
            </Card>
          </div>
          <div className="flex flex-wrap gap-4">
            {(["1", "2", "3", "4", "5", "6", "7"] as const).map((size) => (
              <Card key={size} size={size} variant="background2">
                <div className="flex h-full items-center justify-center p-4 text-sm text-foreground">
                  {size}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
      </Section>
    </div>
  );
}
