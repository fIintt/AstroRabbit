import { useEffect, useState } from "react";

import { ConfigWidget } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { OutputWidget } from "@/app/projects/test/_components/layout/properties/outputs/config";
import { WidgetError, WidgetType } from "@/app/projects/test/_components/layout/properties/misc";

import { cn } from "@/lib/utils/cn";

export function NumberInput({ value, error, onChange }: ConfigWidget["NUMBER"]) {
  const [number, setNumber] = useState(String(value));

  useEffect(() => {
    if (Number(number) === value) return;

    setNumber(String(value));
  }, [value]);

  return (
    <div className="group relative space-y-1">
      <input
        placeholder="Value"
        type="number"
        inputMode="decimal"
        value={number}
        onChange={(e) => {
          const val = e.target.value;

          setNumber(val);

          if (val === "") return;
          if (Number.isFinite(Number(val))) onChange(Number(val));
        }}
        className={cn(
          "bg-ink/4 text-ink w-full p-2",
          "hover:outline focus:outline",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          error && "outline-destructive-ink outline",
        )}
      />

      <WidgetError error={error} />

      <WidgetType type="NUMBER" />
    </div>
  );
}

export function NumberOutput({ value }: OutputWidget["NUMBER"]) {
  return (
    <div className="relative">
      <input
        tabIndex={-1}
        className="text-ink bg-ink/4 w-full p-2 outline-none select-all"
        value={value}
        readOnly
      />

      <WidgetType type="TEXT" />
    </div>
  );
}
