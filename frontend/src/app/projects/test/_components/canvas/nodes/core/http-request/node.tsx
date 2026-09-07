import { NodeProps } from "@xyflow/react";

import { ClockFading, Code2, FileText, Hash, Link2, List, TrendingDown } from "lucide-react";

import { HttpRequest } from "@/app/projects/test/_components/canvas/nodes/core/http-request/config";
import { BaseNode } from "@/app/projects/test/_components/canvas/nodes/base/node";
import { generateHandle } from "@/app/projects/test/_components/canvas/nodes/base/utils";

const ICONS = {
  HEADERS: List,
  METHOD: Code2,
  BODY: FileText,

  LATENCY: ClockFading,
  STATUS_CODE: Hash,
  FAILURE_RATE: TrendingDown,

  URL: Link2,
} as const;

export function HttpRequestNode(node: NodeProps<HttpRequest>) {
  return <BaseNode {...node} configIcons={ICONS} handles={generateHandle(node.type)} />;
}
