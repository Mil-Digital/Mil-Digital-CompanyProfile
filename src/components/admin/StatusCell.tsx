"use client";

import { Pill } from "@payloadcms/ui";
import type { DefaultCellComponentProps, SelectFieldClient } from "payload";

type Tone = "success" | "warning" | "error" | "light" | "light-gray" | "dark";

/**
 * A coloured pill for status columns in list views, so "New" leads or
 * "Closed" jobs stand out at a glance. Tones come from the field config
 * (`clientProps.tones`), keyed by option value.
 */
export function StatusCell({ cellData, field, tones = {} }: DefaultCellComponentProps<SelectFieldClient> & { tones?: Record<string, Tone> }) {
  if (cellData === null || cellData === undefined || cellData === "") return <span style={{ color: "var(--theme-elevation-400)" }}>—</span>;
  const values = Array.isArray(cellData) ? cellData : [cellData];
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 4 }}>
      {values.map((value) => {
        const option = field.options?.find((o) => (typeof o === "string" ? o : o.value) === value);
        const label = typeof option === "object" && typeof option.label === "string" ? option.label : String(value);
        return (
          <Pill key={String(value)} pillStyle={tones[String(value)] ?? "light"} size="small" rounded>
            {label}
          </Pill>
        );
      })}
    </span>
  );
}
