import { useState } from "react";

import { FastForward, LucideIcon, PencilLine, Play, Trash2, X } from "lucide-react";

import { CanvasNode } from "@/app/projects/test/_providers/editor/config";
import { ExecutionStatus } from "@/app/projects/test/_providers/executor/config";
import { NodeLabel } from "@/app/projects/test/_components/canvas/nodes/base/label";
import { NodeStatus } from "@/app/projects/test/_components/canvas/nodes/base/config";
import { generateBadgeColor } from "@/app/projects/test/_components/layout/properties/config";

import { Diamond } from "@/components/ui/decorations/diamond";
import { Button } from "@/components/ui/primitives/button";
import { Badge } from "@/components/ui/primitives/badge";

import { formatText } from "@/lib/utils/formatText";
import { cn } from "@/lib/utils/cn";

type PropertiesBanner = {
  nodeType: CanvasNode["type"];
  nodeIcon: LucideIcon;
  nodeLabel: string;
  nodeBadges: Set<string>;
  nodeStatus: NodeStatus;
  executorStatus: ExecutionStatus;
  onClose: () => void;
  onLabelChange: (label: string) => void;
  onExecute: () => void;
  onNodeSkip: () => void;
  onDelete: () => void;
};

export function PropertiesBanner({
  nodeType,
  nodeIcon: NodeIcon,
  nodeLabel,
  nodeBadges,
  nodeStatus,
  executorStatus,
  onClose,
  onLabelChange,
  onExecute,
  onNodeSkip,
  onDelete,
}: PropertiesBanner) {
  const [isRenaming, setIsRenaming] = useState(false);

  const isExecutorRunning = executorStatus === "RUNNING";
  const isNodeRunning = nodeStatus === "RUNNING";

  const ACTIONS = {
    EXECUTE: {
      icon: Play,
      className: "text-accent-ink hover:text-accent-ink/60 active:text-accent-ink/60",
      disabled: isExecutorRunning || isNodeRunning,
      fn: onExecute,
    },

    SKIP: {
      icon: FastForward,
      className: "text-warning-ink hover:text-warning-ink/60 active:text-warning-ink/60",
      disabled: !isExecutorRunning || !isNodeRunning,
      fn: onNodeSkip,
    },

    DELETE: {
      icon: Trash2,
      className: "",
      disabled: isExecutorRunning,
      fn: onDelete,
    },
  } as const;

  return (
    <div className="flex flex-col items-center">
      <div className="border-ink/20 flex w-full items-center gap-x-4 border-b-2 border-dashed px-6 py-4">
        <div className="relative flex size-8 shrink-0 items-center justify-center">
          <Diamond variant="filled" className="bg-ink/4 absolute inset-0 size-8" />

          <NodeIcon className="text-ink relative z-10 size-5" />
        </div>

        <div className="flex w-full min-w-0 flex-col items-start">
          <div className="flex w-full items-center gap-x-2">
            <Button aria-label="Rename node" onClick={() => setIsRenaming(true)} size="icon" flush>
              <PencilLine size={16} />
            </Button>

            <NodeLabel
              label={nodeLabel}
              onChange={onLabelChange}
              isRenaming={isRenaming}
              onRenamingChange={setIsRenaming}
            />
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <Badge className={generateBadgeColor(formatText(nodeType))}>
              {formatText(nodeType)}
            </Badge>

            {[...nodeBadges].map((b) => {
              return (
                <Badge
                  key={b}
                  className={cn("inline max-w-24 truncate", generateBadgeColor(formatText(b)))}
                >
                  {formatText(b)}
                </Badge>
              );
            })}
          </div>
        </div>

        <Button
          className="hover:bg-destructive-ink/4 active:bg-destructive-ink/4 absolute top-0 right-0 border-2 p-0.5 active:scale-100"
          variant="destructive"
          size="icon"
          onClick={onClose}
        >
          <X size={16} className="text-destructive-ink" />
        </Button>
      </div>

      <div className="border-ink/20 flex w-full items-center gap-x-6 border-b-2 border-dashed px-4 py-2">
        {Object.entries(ACTIONS).map(([k, v]) => {
          const Icon = v.icon;
          const isDestructive = k === "DELETE";

          return (
            <Button
              key={k}
              variant={isDestructive ? "destructive" : "normal"}
              flush
              disabled={v.disabled}
              onClick={v.fn}
              className={cn(
                "gap-x-2 font-medium tracking-wider uppercase transition-colors",
                isDestructive && "ml-auto",
                v.className,
              )}
            >
              <Icon size={14} className="shrink-0" />

              <span>{k}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
