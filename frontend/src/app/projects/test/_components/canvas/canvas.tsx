"use client";

import { useCallback } from "react";

import {
  Connection,
  ConnectionMode,
  Edge,
  EdgeChange,
  getOutgoers,
  Node,
  NodeChange,
  ReactFlow,
  SelectionMode,
  useReactFlow,
} from "@xyflow/react";

import { CanvasNode, NODE_TYPES } from "@/app/projects/test/_providers/editor/config";
import { CanvasEdge, EDGE_TYPES } from "@/app/projects/test/_providers/editor/config";
import { useEditorAction, useEditorState } from "@/app/projects/test/_hooks/use-editor";
import { CustomConnectionLine } from "@/app/projects/test/_components/canvas/edges/connection-line";
import { handleConfig } from "@/app/projects/test/_components/canvas/nodes/base/config";
import { Header } from "@/app/projects/test/_components/layout/header";

import "@/app/projects/test/_components/canvas/config.css";

import { MainFrame } from "@/components/layout/main-frame";

export function Canvas() {
  const { getNode } = useReactFlow();

  const { action: editorAction } = useEditorAction();
  const { state: editorState } = useEditorState();

  const onNodesChange = (changes: NodeChange<CanvasNode>[]) => editorAction.changeNode(changes);

  const onNodesDelete = (nodes: CanvasNode[]) =>
    nodes.forEach((node) => editorAction.deleteNode(node.id));

  const onConnect = (connection: Connection) => editorAction.createEdge(connection);

  const onEdgesChange = (changes: EdgeChange<CanvasEdge>[]) => editorAction.changeEdge(changes);

  const onEdgesDelete = (edge: CanvasEdge[]) =>
    edge.forEach((edge) => editorAction.deleteEdge(edge.id));

  const isValidConnection = useCallback(
    (edgeOrConnection: Connection | Edge) => {
      const { source, target, targetHandle } = edgeOrConnection;

      if (source === target) return false;

      // Hinders multiple edges between 2 nodes
      const hasNodePairDuplicate = editorState.edges.some(
        (e) => e.source === source && e.target === target,
      );
      if (hasNodePairDuplicate) return false;

      // Handle's isConnectable only controls direct UI interaction, it doesn't account for graph state or connection limits.
      if (targetHandle) {
        const targetConnections = editorState.edges.filter(
          (e) => e.target === target && e.targetHandle === targetHandle,
        );

        if (targetConnections.length >= handleConfig.MAX_CONNECTIONS) return false;
      }

      const sourceNode = getNode(source);
      const targetNode = getNode(target);

      if (!targetNode || !sourceNode) return false;

      // Hinders Node A -> Node B -> Node C -> Node A
      const edges = editorState.edges;
      const nodes = editorState.nodes;

      const hasCycle = (node: Node, visited = new Set<string>()): boolean => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);

        if (node.id === source) return true;

        const outgoers = getOutgoers(node, nodes, edges);
        return outgoers.some((outgoer) => hasCycle(outgoer, visited));
      };

      return !hasCycle(targetNode);
    },
    [editorState.nodes, editorState.edges, getNode],
  );

  return (
    <div className="relative">
      <MainFrame label="PROJECT NAME">
        <Header />

        <ReactFlow
          tabIndex={0}

          nodes={editorState.nodes}
          nodeTypes={NODE_TYPES}
          onNodesChange={onNodesChange}
          onNodesDelete={onNodesDelete}

          edges={editorState.edges}
          edgeTypes={EDGE_TYPES}
          onEdgesChange={onEdgesChange}
          onEdgesDelete={onEdgesDelete}

          connectionLineComponent={CustomConnectionLine}

          onConnect={onConnect}
          isValidConnection={isValidConnection}

          deleteKeyCode={["Backspace", "Delete"]}

          panOnScroll
          selectionOnDrag
          panOnDrag={false}

          selectionMode={SelectionMode.Partial}
          connectionMode={ConnectionMode.Strict}

          fitView
          proOptions={{ hideAttribution: true }}

          className="outline-none"
        />
      </MainFrame>
    </div>
  );
}
