import { Card } from "../ui/Card";

export function CardTestSection() {
  return (
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
  );
}
