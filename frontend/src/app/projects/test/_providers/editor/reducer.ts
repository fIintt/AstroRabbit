import { nanoid } from "nanoid";

import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";

import { CanvasEdge } from "@/app/projects/test/_providers/editor/config";
import {
  ActionEditor,
  CanvasNode,
  InitialEditor,
} from "@/app/projects/test/_providers/editor/config";
import { createNode, patchEdge, patchNode } from "@/app/projects/test/_providers/editor/utils";
import { NODE_DEFAULTS } from "@/app/projects/test/_components/canvas/config";

export const initialEditor: InitialEditor = {
  tool: "SELECT",
  nodes: [],
  edges: [],
};

export const actionEditor = (state: InitialEditor, action: ActionEditor): InitialEditor => {
  switch (action.type) {
    case "RESET_RUNTIME":
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          patchNode(node, {
            runtime: { status: "IDLE", duration: 0 },
            output: NODE_DEFAULTS[node.type].output,
          }),
        ),
        edges: state.edges.map((edge) => patchEdge(edge, { status: "IDLE" })),
      };

    case "SELECT_TOOL":
      return {
        ...state,
        tool: action.payload,
      };

    case "CREATE_NODE":
      return {
        ...state,
        nodes: [
          ...state.nodes,
          {
            id: nanoid(),
            ...createNode(action.payload),
          },
        ],
      };

    case "CHANGE_NODE": {
      return {
        ...state,
        nodes: applyNodeChanges<CanvasNode>(action.payload, state.nodes),
      };
    }

    case "PATCH_NODE_APPEARANCE":
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id !== action.payload.id) return node;

          return patchNode(node, {
            appearance: {
              ...node.data.appearance,
              ...action.payload.appearance,
            },
          });
        }),
      };

    case "PATCH_NODE_CONFIG":
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id !== action.payload.id) return node;

          return patchNode(node, {
            config: {
              ...node.data.config,
              [action.payload.key]: action.payload.value,
            },
          });
        }),
      };

    case "SET_NODE_CONFIG":
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id !== action.payload.id) return node;

          return patchNode(node, { config: action.payload.config });
        }),
      };

    case "PATCH_NODE_EXECUTION":
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id !== action.payload.id) return node;
          if (action.payload.output !== undefined)
            return patchNode(node, {
              runtime: action.payload.runtime,
              output: action.payload.output,
            });

          return patchNode(node, { runtime: action.payload.runtime });
        }),
      };

    case "DELETE_NODE":
      return {
        ...state,
        nodes: state.nodes.filter((node) => node.id !== action.payload),
      };

    case "CREATE_EDGE": {
      const edge: CanvasEdge = {
        id: nanoid(),
        type: "SHARP",
        ...action.payload,
      };

      return {
        ...state,
        edges: addEdge(edge, state.edges),
      };
    }

    case "CHANGE_EDGE":
      return {
        ...state,
        edges: applyEdgeChanges<CanvasEdge>(action.payload, state.edges),
      };

    case "PATCH_EDGE_EXECUTION":
      return {
        ...state,
        edges: state.edges.map((edge) =>
          edge.id === action.payload.id ? patchEdge(edge, { status: action.payload.status }) : edge,
        ),
      };

    case "DELETE_EDGE":
      return {
        ...state,
        edges: state.edges.filter((edge) => edge.id !== action.payload),
      };

    default:
      return state;
  }
};
