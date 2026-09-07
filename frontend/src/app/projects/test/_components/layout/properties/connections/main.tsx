import { useMemo } from "react";

import { useEdges, useNodes } from "@xyflow/react";

import { Title } from "@/app/projects/test/_components/layout/properties/misc";
import { CanvasEdge, CanvasNode } from "@/app/projects/test/_providers/editor/config";

import { Badge } from "@/components/ui/primitives/badge";

import { cn } from "@/lib/utils/cn";

type PropertiesConnections = {
  nodeId: string;
};

type Display = {
  node: CanvasNode;
  siblingType: "SOURCE" | "TARGET";
};

function Display({ node, siblingType }: Display) {
  const Icon = node.data.appearance.icon;

  return (
    <div key={node.id} className="bg-ink/2 flex items-center justify-between gap-x-2 p-2">
      <Icon size={16} className="text-ink/40" />

      <span className="text-ink mr-auto min-w-0 truncate">{node.data.appearance.label}</span>

      <Badge
        className={cn(
          "border-0",
          siblingType === "SOURCE"
            ? "bg-indigo-500/10 text-indigo-600"
            : "bg-violet-500/10 text-violet-600",
        )}
      >
        {siblingType}
      </Badge>
    </div>
  );
}

export function PropertiesConnections({ nodeId }: PropertiesConnections) {
  const edges = useEdges<CanvasEdge>();
  const nodes = useNodes<CanvasNode>();

  const connectedNodes = useMemo(() => {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    return edges
      .reduce<Display[]>((acc, edge) => {
        if (edge.source === nodeId) {
          const targetNode = nodeMap.get(edge.target);

          if (targetNode) acc.push({ node: targetNode, siblingType: "TARGET" });
        } else if (edge.target === nodeId) {
          const sourceNode = nodeMap.get(edge.source);

          if (sourceNode) acc.push({ node: sourceNode, siblingType: "SOURCE" });
        }

        return acc;
      }, [])
      .sort((a, b) => a.siblingType.localeCompare(b.siblingType));
  }, [nodeId, edges, nodes]);

  return (
    <div className="space-y-2">
      <Title label="CONNECTIONS" hasData={connectedNodes.length > 0} info="no sibling nodes" />

      {connectedNodes.length > 0 &&
        connectedNodes.map(({ node, siblingType }) => {
          return <Display key={node.id} node={node} siblingType={siblingType} />;
        })}
    </div>
  );
}
