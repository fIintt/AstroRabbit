import z from "zod";

import { Database, Globe } from "lucide-react";

import { CanvasNode, NodeData } from "@/app/projects/test/_providers/editor/config";
import { DATABASE_SCHEMAS } from "@/app/projects/test/_components/canvas/nodes/core/database/config";
import { HTTP_REQUEST_SCHEMAS } from "@/app/projects/test/_components/canvas/nodes/core/http-request/config";
import { setNodeAppearance, setNodeDefaults } from "@/app/projects/test/_components/canvas/utils";

export const SETTINGS: Record<
  CanvasNode["type"],
  { maxInstances: number; maxIncomingEdges: number; maxOutgoingEdges: number }
> = {
  HTTP_REQUEST: {
    maxInstances: 1,
    maxIncomingEdges: 0,
    maxOutgoingEdges: 1,
  },

  DATABASE: {
    maxInstances: Infinity,
    maxIncomingEdges: 2,
    maxOutgoingEdges: 2,
  },
} as const;

const DEFAULT_RUNTIME: NodeData["runtime"] = {
  status: "IDLE",
  duration: 0,
};

export const NODE_DEFAULTS: {
  [K in CanvasNode["type"]]: Extract<CanvasNode, { type: K }>["data"];
} = {
  HTTP_REQUEST: {
    appearance: setNodeAppearance("HTTP Request Node", Globe),
    config: setNodeDefaults(HTTP_REQUEST_SCHEMAS.CUSTOM_API),
    runtime: DEFAULT_RUNTIME,
    output: setNodeDefaults(HTTP_REQUEST_SCHEMAS.OUTPUT),
  },

  DATABASE: {
    appearance: setNodeAppearance("Database Node", Database),
    config: setNodeDefaults(DATABASE_SCHEMAS.CONFIG),
    runtime: DEFAULT_RUNTIME,
    output: setNodeDefaults(DATABASE_SCHEMAS.OUTPUT),
  },
};

export const CONFIG_SCHEMA_TYPES: Record<
  CanvasNode["type"],
  z.ZodObject | Record<string, z.ZodObject>
> = {
  HTTP_REQUEST: {
    MOCK_API: HTTP_REQUEST_SCHEMAS.MOCK_API,
    CUSTOM_API: HTTP_REQUEST_SCHEMAS.CUSTOM_API,
  },
  DATABASE: DATABASE_SCHEMAS.CONFIG,
};

export const OUTPUT_SCHEMA_TYPES: Record<
  CanvasNode["type"],
  z.ZodObject | Record<string, z.ZodObject>
> = {
  HTTP_REQUEST: HTTP_REQUEST_SCHEMAS.OUTPUT,
  DATABASE: DATABASE_SCHEMAS.OUTPUT,
};

type WidgetType =
  "SELECT" | "RECORD" | "TEXT" | "NUMBER" | "JSON" | "TABLE" | "MULTI_SELECT" | "NONE";

export type ConfigFieldMeta = Readonly<{
  widget: Exclude<WidgetType, "TABLE">;
  options: readonly string[];
  hiddenOnNode: boolean;
  hiddenWhen: (config: Record<string, unknown>) => boolean;
}>;

export type OutputFieldMeta = Readonly<{
  widget: Exclude<WidgetType, "SELECT" | "MULTI_SELECT">;
  group: string;
}>;
