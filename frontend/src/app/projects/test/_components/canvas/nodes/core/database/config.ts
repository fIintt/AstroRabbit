import { Node } from "@xyflow/react";

import z from "zod";

import { Base } from "@/app/projects/test/_components/canvas/nodes/base/config";
import { withConfigMeta, withOutputMeta } from "@/app/projects/test/_components/canvas/utils";

export const DATABASE_BADGE_CONFIG = [
  "Query",
  "SQL",
  "Read",
  "Write",
  "Insert",
  "Update",
  "Delete",
  "Join",
  "Aggregate",
  "Filter",
  "Sort",
  "Group",
  "JSON",
  "CSV",
  "Table",
  "Record",
  "Cached",
  "Error",
] as const;

const config = z.object({
  database: withConfigMeta(z.enum(["MongoDB", "PostgreSQL", "MySQL"]).default("PostgreSQL"), {
    widget: "SELECT",
  }),
});

const output = z.object({
  body: withOutputMeta(z.unknown().default(null), { widget: "JSON" }),
});

export const DATABASE_SCHEMAS = {
  CONFIG: config,
  OUTPUT: output,
} as const;

export type DatabaseData = Base<z.infer<typeof config>, z.infer<typeof output>>;

export type Database = Node<DatabaseData, "DATABASE">;
