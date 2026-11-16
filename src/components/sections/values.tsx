"use client";

import * as React from "react";
import Image from "next/image";
import { useInView } from "motion/react";
import { certifications } from "@/content/home";
import { HOME_COPY, type HomeCopy } from "@/content/home-copy";

type Value = HomeCopy["why"]["values"][number];
import { cn } from "@/lib/utils";
import { TextLink } from "@/components/ui/cta-link";
import { Hairline } from "@/components/motion/hairline";
import { SplitText } from "@/components/motion/split-text";

function ValueRow({ value, index }: { value: Value; index: number }) {
  const ref = React.useRef<HTMLLIElement>(null);
  const on = useInView(ref, { margin: "-44% 0px -44% 0px" });
  return (
    <li ref={ref}>
      <Hairline delay={index * 60} />
      <div className={cn("grid grid-cols-[3rem_1fr] gap-x-4 py-8 transition-opacity duration-500 md:grid-cols-[4rem_1fr_auto] md:py-10", on ? "opacity-100" : "opacity-40")}>
        <span
          className={cn(
            "font-display text-[clamp(1.9rem,3.4vw,3.1rem)] font-semibold leading-none transition-colors duration-500",
            on ? "text-warm" : "text-fg-3",
          )}
        >
          {value.mark}
        </span>
        <div>
          <h3 className={cn("t-display text-[clamp(1.9rem,3.4vw,3.1rem)] transition-transform duration-700 ease-out-expo", on && "md:translate-x-3")}>
            {value.title}
          </h3>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-fg-2">{value.body}</p>
        </div>
      </div>
    </li>
  );
}

/**
 * Chapter 7 (inventory: why MIL Digital & values). MIL's approach
 * (holistic & caring) holds on the left; the six A.C.T.I.V.E. promises
 * (Brand Book 2025) light up one by one as they cross the middle of the screen.
 */
export function Values({ copy = HOME_COPY.why }: { copy?: HomeCopy["why"] }) {
  return (
    <section data-cms="why" data-ground="#0e1f45" className="sec" aria-label="Why MIL Digital">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="t-label">{copy.label}</p>
            <SplitText as="h2" text={copy.title} className="t-h2 mt-4" />
            <p className="t-body mt-6 text-fg-2">{copy.intro}</p>
            <p className="mt-6 font-display text-[clamp(2rem,3.4vw,3rem)] font-semibold tracking-[0.04em] text-warm">A.C.T.I.V.E.</p>
            <div className="mt-8 flex items-center gap-3">
              {certifications.map((c) => (
                <Image key={c.name} src={c.image} alt={c.name} width={48} height={48} className="size-12" />
              ))}
              <span className="t-label max-w-[14em]">{copy.certCaption}</span>
            </div>
            <div className="mt-8">
              <TextLink href="/about-mil-digital">More about MIL</TextLink>
            </div>
          </div>
        </div>
        <ul className="lg:col-span-7">
          {copy.values.map((v, i) => (
            <ValueRow key={i} value={v} index={i} />
          ))}
          <Hairline />
        </ul>
      </div>
    </section>
  );
}
