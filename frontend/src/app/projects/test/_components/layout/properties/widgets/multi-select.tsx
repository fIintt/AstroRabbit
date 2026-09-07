import { useEffect, useState } from "react";

import { CheckCheck } from "lucide-react";

import { ConfigWidget } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { WidgetType } from "@/app/projects/test/_components/layout/properties/misc";

import { Button } from "@/components/ui/primitives/button";

import { cn } from "@/lib/utils/cn";

export function MultiSelectInput({ value, options, onChange }: ConfigWidget["MULTI_SELECT"]) {
  const [chosen, setChosen] = useState<string[]>(value);

  const onSelect = (v: string) => {
    const updated = chosen.includes(v) ? chosen.filter((item) => item !== v) : [...chosen, v];

    setChosen(updated);
    onChange(updated);
  };

  useEffect(() => setChosen(value), [value]);

  return (
    <div className="relative space-y-2">
      {options.map((option, i) => {
        const isChosen = chosen.includes(option);

        return (
          <Button
            key={i} // option isnt guaranteed to be unique
            onClick={() => onSelect(option)}
            variant="border"
            className={cn(
              "w-full border-none py-2 outline outline-dashed",
              isChosen && "text-ink bg-ink/4 outline-solid",
            )}
          >
            <span>{option}</span>

            <CheckCheck className={cn("ml-auto opacity-0", isChosen && "opacity-100")} size={16} />
          </Button>
        );
      })}

      <WidgetType type="MULTI_SELECT" />
    </div>
  );
}
