import { useCallback, useRef, useState } from "react";

import { useConnection, useStore } from "@xyflow/react";

import { Clock } from "lucide-react";

import {
  MAX_VISIBLE_BADGES,
  STATUS_ICONS,
  type BaseNode,
} from "@/app/projects/test/_components/canvas/nodes/base/config";
import { BaseHandle } from "@/app/projects/test/_components/canvas/nodes/base/handle";
import {
  formatDuration,
  getVisibleConfigs,
} from "@/app/projects/test/_components/canvas/nodes/base/utils";
import { NodeLabel } from "@/app/projects/test/_components/canvas/nodes/base/label";
import { useEditorAction } from "@/app/projects/test/_hooks/use-editor";
import { toJSON, toString } from "@/app/projects/test/_components/layout/properties/utils";
import { generateBadgeColor } from "@/app/projects/test/_components/layout/properties/config";

import { Diamond } from "@/components/ui/decorations/diamond";
import { Shadow } from "@/components/ui/decorations/shadow";
import { Bracket } from "@/components/ui/decorations/bracket";
import { Badge } from "@/components/ui/primitives/badge";

import { cn } from "@/lib/utils/cn";
import { formatText } from "@/lib/utils/formatText";

export function BaseNode({ id, type, data, selected, className, handles, configIcons }: BaseNode) {
  const [isRenaming, setIsRenaming] = useState(false);

  const NodeIcon = data.appearance.icon;
  const StatusIcon = STATUS_ICONS[data.runtime.status].icon;

  const { action: editorAction } = useEditorAction();

  const selectedCount = useStore((s) => s.nodes.filter((node) => node.selected).length);

  const connection = useConnection(); // Detects edges dragging

  const delayRef = useRef<NodeJS.Timeout | null>(null);

  const onLabelChange = useCallback(
    (newLabel: string) => {
      if (delayRef.current) clearTimeout(delayRef.current);

      delayRef.current = setTimeout(
        () => editorAction.patchNodeAppearance(id, { label: newLabel }),
        500,
      );
    },
    [id, editorAction],
  );

  return (
    <>
      <div
        style={{
          borderColor: `color-mix(in srgb, ${data.appearance.color} ${selectedCount > 0 && !selected ? "40%" : "100%"}, transparent)`,
        }}
        className={cn(
          "group relative flex w-80 flex-col border-2 bg-white",
          selectedCount > 0 && !selected && "*:not-[.node-bg]:opacity-40",
          className,
        )}
      >
        <Bracket
          style={{ backgroundColor: data.appearance.color }}
          className="top-0.5 right-0.5 size-8"
          position="top-right"
        />

        <div className="flex w-full items-center gap-x-4 px-4 py-2">
          <div className="relative flex size-8 shrink-0 items-center justify-center">
            <Diamond
              style={{ borderColor: data.appearance.color }}
              className="absolute inset-0 size-8"
            />

            <NodeIcon style={{ color: data.appearance.color }} className="z-10 size-5" />
          </div>

          <div className="flex w-full min-w-0 flex-col">
            <NodeLabel
              label={data.appearance.label}
              isRenaming={isRenaming}
              onRenamingChange={setIsRenaming}
              onChange={onLabelChange}
            />

            <div className="flex w-full items-center gap-x-1 overflow-x-hidden">
              <Badge
                style={{
                  color: data.appearance.color,
                  backgroundColor: `color-mix(in srgb, ${data.appearance.color} 10%, transparent)`,
                }}
                size="sm"
              >
                {formatText(type)}
              </Badge>

              {[...data.appearance.badge].slice(0, MAX_VISIBLE_BADGES).map((b) => {
                return (
                  <Badge
                    key={b}
                    size="sm"
                    className={cn("inline max-w-12 truncate", generateBadgeColor(formatText(b)))}
                  >
                    {formatText(b)}
                  </Badge>
                );
              })}

              {data.appearance.badge.size > MAX_VISIBLE_BADGES && (
                <Badge
                  size="sm"
                  className="opacity-60"
                >{`+${data.appearance.badge.size - MAX_VISIBLE_BADGES}`}</Badge>
              )}
            </div>
          </div>

          <div
            style={{
              backgroundColor: `color-mix(in srgb, ${data.appearance.color} 4%, transparent)`,
            }}
            className="absolute inset-0 z-1 bg-white"
          />
        </div>

        <div
          data-selected={selected}
          className={cn(
            "grid grid-rows-[0fr] transition-[grid-template-rows] duration-200",
            "data-[selected=true]:grid-rows-[1fr]",
            !connection.inProgress && "group-hover:grid-rows-[1fr]",
          )}
        >
          <div className="overflow-hidden">
            <div
              style={{
                borderColor: `color-mix(in srgb, ${data.appearance.color} 20%, transparent)`,
              }}
              className="relative flex w-full flex-col items-start gap-y-2 border-t-2 border-dashed p-2"
            >
              {getVisibleConfigs(type, data.config).map(([key, value]) => {
                const Icon =
                  configIcons[
                    key
                      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
                      .replace(/[-\s]+/g, "_")
                      .toUpperCase()
                  ];

                const formattedValue =
                  typeof value === "object" && value !== null ? toJSON(value) : toString(value);

                return (
                  <div key={key} className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      {Icon && <Icon size={12} strokeWidth={2} className="text-ink/40" />}

                      <span className="text-xs font-semibold uppercase">{formatText(key)}</span>
                    </div>

                    <span className="w-40 truncate text-right text-xs">{formattedValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          style={{
            borderColor: `color-mix(in srgb, ${data.appearance.color} 20%, transparent)`,
          }}
          className="flex w-full items-center justify-between gap-x-2 border-t-2 border-dashed p-2"
        >
          <div className="flex items-center justify-between gap-x-2">
            <Clock size={12} strokeWidth={2} className="text-ink/40" />

            <span className="text-xs font-medium">
              {formatDuration(Number(data.runtime.duration))}
            </span>
          </div>

          <StatusIcon
            size={16}
            className={cn(
              STATUS_ICONS[data.runtime.status].color,
              data.runtime.status === "RUNNING" && "animate-spin",
            )}
          />
        </div>

        {selected && <Shadow />}
      </div>

      <BaseHandle
        handles={handles}
        className={cn(
          "pointer-events-none opacity-0",
          (selected || connection.inProgress) && "pointer-events-auto opacity-100",
        )}
      />
    </>
  );
}
