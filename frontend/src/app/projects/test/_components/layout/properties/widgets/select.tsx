import { useEffect, useRef, useState } from "react";

import { CheckCheck, ChevronDown } from "lucide-react";

import { ConfigWidget } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { WidgetType } from "@/app/projects/test/_components/layout/properties/misc";

import { Button } from "@/components/ui/primitives/button";
import { Shadow } from "@/components/ui/decorations/shadow";

import { cn } from "@/lib/utils/cn";
import { formatText } from "@/lib/utils/formatText";

export function SelectInput({ value, options, onChange }: ConfigWidget["SELECT"]) {
  const [isOpen, setIsOpen] = useState(false);
  const [chosen, setChosen] = useState(value);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onBlur = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", onBlur);

    return () => document.removeEventListener("mousedown", onBlur);
  }, []);

  useEffect(() => setChosen(value), [value]);

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-ink/4 text-ink w-full justify-between py-2 hover:outline focus:outline"
      >
        <span>{formatText(chosen)}</span>

        <ChevronDown size={16} className={cn("transition-[rotate]", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full outline focus:outline-none">
          <div className="bg-white">
            {options.map((option) => (
              <Button
                tabIndex={0}
                key={option}
                onClick={() => {
                  setChosen(option);
                  onChange(option);
                  setIsOpen(false);
                }}
                className="hover:bg-ink/4 w-full justify-between bg-white py-2"
              >
                <span className={option === chosen ? "text-accent-ink font-bold" : "text-ink"}>
                  {formatText(option)}
                </span>

                {option === chosen && <CheckCheck size={16} className="text-accent-ink" />}
              </Button>
            ))}
          </div>

          <Shadow spread={8} />
        </div>
      )}

      <WidgetType type="SELECT" />
    </div>
  );
}
