import { getFeatureIcon } from "@/lib/feature-icons";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import type { Feature } from "@prisma/client";

interface FeaturesProps {
  features: Feature[];
}

export function Features({ features }: FeaturesProps) {
  if (features.length === 0) return null;

  return (
    <section className="bg-surface py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-extrabold text-text-primary sm:text-3xl">
            Kenapa Memilih Kami
          </h2>
          <p className="mt-3 text-text-secondary">
            Kenyamanan dan keamanan perjalanan Anda adalah prioritas utama kami.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = getFeatureIcon(feature.iconKey);
            return (
              <FadeInOnScroll
                key={feature.id}
                index={i}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">{feature.description}</p>
              </FadeInOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
