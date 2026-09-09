import z from "zod";

import { LucideIcon } from "lucide-react";

import { ConfigFieldMeta, OutputFieldMeta } from "@/app/projects/test/_components/canvas/config";
import { NodeData } from "@/app/projects/test/_providers/editor/config";
import { NODE_COLOR_PALETTE } from "@/app/projects/test/_components/layout/properties/meta/config";

const DEFAULT_CONFIG_FIELD_META: ConfigFieldMeta = {
  widget: "NONE",
  options: [],
  hiddenOnNode: false,
  hiddenWhen: () => false,
};

export const nodeConfigRegistry = z.registry<ConfigFieldMeta>();

export function withConfigMeta<T extends z.ZodType>(schema: T, meta: Partial<ConfigFieldMeta>) {
  nodeConfigRegistry.add(schema, { ...DEFAULT_CONFIG_FIELD_META, ...meta });

  return schema;
}

const DEFAULT_OUTPUT_FIELD_META: OutputFieldMeta = {
  widget: "NONE",
  group: "",
};

export const nodeOutputRegistry = z.registry<OutputFieldMeta>();

export function withOutputMeta<T extends z.ZodType>(schema: T, meta: Partial<OutputFieldMeta>) {
  nodeOutputRegistry.add(schema, { ...DEFAULT_OUTPUT_FIELD_META, ...meta });

  return schema;
}

export function resolveConfigSchema(
  entry: z.ZodObject | Record<string, z.ZodObject>,
  config: NodeData["config"],
): z.ZodObject | undefined {
  if (entry instanceof z.ZodObject) return entry;

  if ("provider" in config) return entry[String(config.provider)];

  return undefined;
}

export function setNodeAppearance(label: string, icon: LucideIcon): NodeData["appearance"] {
  return { label, icon, badge: new Set(), color: Object.values(NODE_COLOR_PALETTE)[0] };
}

export function setNodeDefaults<T extends z.ZodObject>(schema: T) {
  const res = schema.safeParse({});

  if (!res.success)
    throw new Error(`setNodeDefaults schema has no valid defaults from ${res.error.message}`);

  return res.data;
}
