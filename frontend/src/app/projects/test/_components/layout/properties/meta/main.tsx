import { useState } from "react";

import { Clock } from "lucide-react";

import { NodeData } from "@/app/projects/test/_providers/editor/config";
import { Title } from "@/app/projects/test/_components/layout/properties/misc";
import { formatDuration } from "@/app/projects/test/_components/canvas/nodes/base/utils";
import { STATUS_ICONS } from "@/app/projects/test/_components/canvas/nodes/base/config";
import { NODE_COLOR_PALETTE } from "@/app/projects/test/_components/layout/properties/meta/config";

import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";

import { cn } from "@/lib/utils/cn";
import { Shadow } from "@/components/ui/decorations/shadow";
import { Diamond } from "@/components/ui/decorations/diamond";

type PropertiesMeta = {
  appearance: NodeData["appearance"];
  runtime: NodeData["runtime"];
  onAppearanceChange: (color: string) => void;
};

type Runtime = Pick<PropertiesMeta, "runtime">;

type Appearance = Pick<PropertiesMeta, "appearance" | "onAppearanceChange">;

function Runtime({ runtime }: Runtime) {
  const Icon = STATUS_ICONS[runtime.status].icon;

  return (
    <>
      <div className="flex items-center justify-between">
        <Title label="STATUS" />

        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "border-0",
              STATUS_ICONS[runtime.status].bg,
              STATUS_ICONS[runtime.status].color,
            )}
            size="lg"
          >
            {runtime.status}
          </Badge>

          <Icon
            size={16}
            className={cn(
              runtime.status === "RUNNING" && "animate-spin",
              STATUS_ICONS[runtime.status].color,
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Title label="DURATION" />

        <div className="flex items-center gap-2">
          <span>{formatDuration(runtime.duration)}</span>

          <Clock size={16} className="text-ink/40" />
        </div>
      </div>
    </>
  );
}

function Appearance({ appearance, onAppearanceChange }: Appearance) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <Title label="APPEARANCE" />

        <div className="relative">
          <Button className="gap-x-2" flush onClick={() => setIsOpen((prev) => !prev)}>
            <span className="bg-ink/4 px-2 py-0.5 uppercase">{appearance.color}</span>

            <Diamond style={{ backgroundColor: appearance.color }} variant="solid" />
          </Button>

          {isOpen && (
            <>
              <Button
                aria-label="Close dropdown"
                tabIndex={-1}
                className="fixed inset-0 z-20 cursor-default"
                onClick={() => setIsOpen(false)}
              />

              <div className="border-ink/20 absolute right-0 bottom-full z-30 mb-2">
                <div className="size-full border bg-white p-2">
                  {Object.entries(NODE_COLOR_PALETTE).map(([k, v]) => (
                    <Button
                      key={k}
                      type="button"
                      onClick={() => {
                        onAppearanceChange(v);
                        setIsOpen(false);
                      }}
                      className="hover:bg-ink/4 active:bg-ink/4 text-ink w-full justify-between gap-x-8"
                    >
                      <div className="flex items-center gap-x-2">
                        <Diamond style={{ backgroundColor: v }} variant="solid" />

                        <span className="font-medium">{k}</span>
                      </div>

                      <span className="text-xxs uppercase">{v}</span>
                    </Button>
                  ))}
                </div>

                <Shadow spread={8} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export function PropertiesMeta({ appearance, onAppearanceChange, runtime }: PropertiesMeta) {
  return (
    <div className="space-y-8">
      <Runtime runtime={runtime} />

      <Appearance appearance={appearance} onAppearanceChange={onAppearanceChange} />
    </div>
  );
}
