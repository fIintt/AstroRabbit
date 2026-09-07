import { useEffect, useState } from "react";

import { ConfigWidget } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { OutputWidget } from "@/app/projects/test/_components/layout/properties/outputs/config";
import { WidgetError, WidgetType } from "@/app/projects/test/_components/layout/properties/misc";
import { cn } from "@/lib/utils/cn";

export function TextInput({ value, error, onChange }: ConfigWidget["TEXT"]) {
  const [text, setText] = useState(value);

  useEffect(() => setText(value), [value]);

  return (
    <div className="group relative space-y-1">
      <input
        placeholder="Value"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
        className={cn(
          "bg-ink/4 text-ink w-full p-2",
          "hover:outline focus:outline",
          error && "outline-destructive-ink outline",
        )}
      />

      <WidgetError error={error} />

      <WidgetType type="TEXT" />
    </div>
  );
}

export function TextOutput({ value }: OutputWidget["TEXT"]) {
  return (
    <div className="relative">
      <input className="text-ink bg-ink/4 w-full p-2 outline-none" value={value} readOnly />

      <WidgetType type="TEXT" />
    </div>
  );
}
