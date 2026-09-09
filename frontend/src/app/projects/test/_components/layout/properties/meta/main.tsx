import { useEffect, useRef, useState } from "react";

import { Clock, Hash, Palette, Tags } from "lucide-react";

import { CanvasNode, NodeData } from "@/app/projects/test/_providers/editor/config";
import { Title } from "@/app/projects/test/_components/layout/properties/misc";
import { formatDuration } from "@/app/projects/test/_components/canvas/nodes/base/utils";
import {
  MAX_ACTIVE_BADGES,
  STATUS_ICONS,
} from "@/app/projects/test/_components/canvas/nodes/base/config";
import { NODE_COLOR_PALETTE } from "@/app/projects/test/_components/layout/properties/meta/config";

import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";
import { Shadow } from "@/components/ui/decorations/shadow";
import { Diamond } from "@/components/ui/decorations/diamond";

import { cn } from "@/lib/utils/cn";
import { BADGE_CONFIG_TYPES } from "@/app/projects/test/_components/canvas/config";

type PropertiesMeta = {
  nodeType: CanvasNode["type"];
  appearance: NodeData["appearance"];
  runtime: NodeData["runtime"];
  onColorChange: (color: string) => void;
  onBadgeChange: (badge: string) => void;
};

type Runtime = Pick<PropertiesMeta, "runtime">;

type Appearance = {
  color: PropertiesMeta["appearance"]["color"];
} & Pick<PropertiesMeta, "onColorChange">;

type Badges = {
  badge: PropertiesMeta["appearance"]["badge"];
} & Pick<PropertiesMeta, "onBadgeChange" | "nodeType">;

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
          <span className="bg-ink/4 text-ink px-2 py-px">{formatDuration(runtime.duration)}</span>

          <Clock size={16} className="text-ink/40" />
        </div>
      </div>
    </>
  );
}

function Appearance({ color, onColorChange }: Appearance) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <Title label="APPEARANCE" />

      <div className="relative">
        <div className="flex items-center gap-x-2">
          <Button
            className="px-2 py-px uppercase hover:outline active:outline"
            style={{
              color: color,
              backgroundColor: `color-mix(in srgb, ${color} 4%, transparent)`,
            }}
            flush
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {color}
          </Button>

          <Palette size={16} className="text-ink/40" />
        </div>

        {isOpen && (
          <>
            <Button
              aria-label="Close dropdown"
              tabIndex={-1}
              className="fixed inset-0 z-20 cursor-default"
              onClick={() => setIsOpen(false)}
            />

            <div className="border-ink/20 absolute right-0 bottom-full z-30 mr-6 mb-2">
              <div className="size-full space-y-0.5 border bg-white p-1">
                {Object.entries(NODE_COLOR_PALETTE).map(([k, v]) => (
                  <Button
                    key={k}
                    size="sm"
                    onClick={() => {
                      onColorChange(v);
                      setIsOpen(false);
                    }}
                    className="hover:bg-ink/4 active:bg-ink/4 text-ink w-full justify-between gap-x-8 px-2"
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
  );
}

function Badges({ badge, nodeType, onBadgeChange }: Badges) {
  const options = BADGE_CONFIG_TYPES[nodeType];

  const isAtMaxBadges = badge.size >= MAX_ACTIVE_BADGES;

  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const delayRef = useRef<NodeJS.Timeout | null>(null);

  const onClick = (selectedBadge: string) => {
    if (isAtMaxBadges && !badge.has(selectedBadge)) {
      if (delayRef.current) clearTimeout(delayRef.current);

      setIsShaking(true);

      delayRef.current = setTimeout(() => {
        setIsShaking(false);

        delayRef.current = null;
      }, 250);

      return;
    }

    onBadgeChange(selectedBadge);
  };

  useEffect(() => {
    return () => {
      if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, []);

  return (
    <div className="flex items-center justify-between">
      <Title label="BADGES" />

      <div className="relative">
        <div className="flex items-center gap-x-2">
          <Button
            className={cn(
              "bg-ink/4 text-ink px-2 py-px hover:outline active:outline",
              isShaking && "animate-shake-x text-destructive-ink",
            )}
            flush
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {`${badge.size} / ${MAX_ACTIVE_BADGES}`}
          </Button>

          <Tags size={16} className="text-ink/40" />
        </div>

        {isOpen && (
          <>
            <Button
              aria-label="Close dropdown"
              tabIndex={-1}
              className="fixed inset-0 z-20 cursor-default"
              onClick={() => setIsOpen(false)}
            />

            <div className="border-ink/20 absolute right-0 bottom-full z-30 mr-6 mb-2 w-60">
              <div className="mb-2 flex items-center justify-between border-b border-black/20 pb-1.5">
                <span className="text-[10px] font-bold tracking-wider text-black/70 uppercase">
                  FILTERS ({badge.size})
                </span>
                {badge.size > 0 && (
                  <button
                    type="button"
                    onClick={() => /* handle clear */ {}}
                    className="text-[10px] font-bold text-rose-600 underline hover:text-rose-700"
                  >
                    CLEAR ALL
                  </button>
                )}
              </div>

              {/* Option Badges */}
              <div className="flex max-h-36 scrollbar-thin flex-wrap gap-1 overflow-y-auto pr-1">
                {options.map((option) => {
                  const isSelected = badge.has(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onClick(option)}
                      className={cn(
                        "border border-dashed border-black px-1.5 py-0.5 text-[10px] font-bold uppercase transition-none",
                        isSelected
                          ? "border-solid bg-black text-white"
                          : "bg-white text-black hover:bg-black/5",
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <Shadow spread={8} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function PropertiesMeta({
  nodeType,
  runtime,
  appearance,
  onColorChange,
  onBadgeChange,
}: PropertiesMeta) {
  return (
    <div className="space-y-8">
      <Runtime runtime={runtime} />

      <Appearance color={appearance.color} onColorChange={onColorChange} />

      <Badges nodeType={nodeType} badge={appearance.badge} onBadgeChange={onBadgeChange} />
    </div>
  );
}
