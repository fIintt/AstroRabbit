import { NodeProps, Position } from "@xyflow/react";

import { Ban, CheckCheck, FastForward, Loader2, LucideIcon, SquareDashed } from "lucide-react";

import { CanvasNode } from "@/app/projects/test/_providers/editor/config";

export type HandleType = "source" | "target";

export type BaseHandle = {
  handles: HandleType[];
  maxConnections?: number;
  className?: string;
};

export const handleConfig = {
  target: {
    type: "target",
    position: Position.Left,
    className: "absolute -left-8 top-auto bottom-0 flex flex-col gap-y-1",
  },

  source: {
    type: "source",
    position: Position.Right,
    className: "absolute -right-8 top-0 flex flex-col gap-y-1",
  },

  MAX_CONNECTIONS: 1,
} as const;

export type NodeStatus = "IDLE" | "RUNNING" | "SUCCESS" | "SKIPPED" | "ERROR";

export const STATUS_ICONS: Record<NodeStatus, { icon: LucideIcon; color: string; bg: string }> = {
  IDLE: {
    icon: SquareDashed,
    color: "text-ink",
    bg: "bg-ink/10",
  },

  RUNNING: {
    icon: Loader2,
    color: "text-info-ink",
    bg: "bg-info-ink/10",
  },

  SUCCESS: {
    icon: CheckCheck,
    color: "text-success-ink",
    bg: "bg-success-ink/10",
  },

  SKIPPED: {
    icon: FastForward,
    color: "text-warning-ink",
    bg: "bg-warning-ink/10",
  },

  ERROR: {
    icon: Ban,
    color: "text-destructive-ink",
    bg: "bg-destructive-ink/10",
  },
};

export type Base<
  Config extends Record<string, unknown> = Record<string, unknown>,
  Output extends Record<string, unknown> = Record<string, unknown>,
> = {
  appearance: {
    label: string;
    icon: LucideIcon;
    badge: string[];
    color: string;
  };

  config: Config;

  runtime: {
    status: NodeStatus;
    duration: number;
  };

  output: Output;
};

export type BaseNode = NodeProps<CanvasNode> & {
  children?: React.ReactNode;
  className?: string;
  configIcons: Record<string, LucideIcon>;
  handles: HandleType[];
};
