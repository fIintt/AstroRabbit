import { NODE_DEFAULTS } from "@/app/projects/test/_components/canvas/config";
import { CanvasNode, CanvasEdge } from "@/app/projects/test/_providers/editor/config";

type CreateNode<T> = T extends CanvasNode ? Omit<T, "id"> : never;

export function createNode<T extends CanvasNode>(type: T["type"]): CreateNode<T> {
  return {
    type,
    position: { x: Math.random(), y: Math.random() },
    data: NODE_DEFAULTS[type],
  } as CreateNode<T>;
}

export function patchNode<T extends CanvasNode, K extends keyof T["data"]>(
  node: T,
  patch: Pick<T["data"], K>,
) {
  return { ...node, data: { ...node.data, ...patch } };
}

export function patchEdge<T extends CanvasEdge, K extends keyof T["data"]>(
  edge: T,
  patch: Pick<T["data"], K>,
) {
  return { ...edge, data: { ...edge.data, ...patch } };
}
