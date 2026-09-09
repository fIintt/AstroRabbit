"use client";

import { useEffect, useState } from "react";

import { MousePointerClick } from "lucide-react";

import { useEditorAction, useEditorState } from "@/app/projects/test/_hooks/use-editor";
import { useEngine } from "@/app/projects/test/_hooks/use-engine";
import { useExecutor } from "@/app/projects/test/_hooks/use-executor";
import { PropertiesBanner } from "@/app/projects/test/_components/layout/properties/banner/main";
import { PropertiesConnections } from "@/app/projects/test/_components/layout/properties/connections/main";
import { PropertiesInputs } from "@/app/projects/test/_components/layout/properties/inputs/main";
import { PropertiesOutputs } from "@/app/projects/test/_components/layout/properties/outputs/main";
import { PropertiesMeta } from "@/app/projects/test/_components/layout/properties/meta/main";

import { Frame } from "@/components/ui/decorations/frame";
import { Button } from "@/components/ui/primitives/button";

import { cn } from "@/lib/utils/cn";

export function Properties() {
  const { query: editorQuery } = useEditorState();
  const { action: editorAction } = useEditorAction();

  const { execution, node: currentNode } = useEngine();

  const { state: executorState } = useExecutor();

  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(400);

  const MIN_WIDTH = 320;
  const MAX_WIDTH = 640;

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (e: MouseEvent) =>
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, window.innerWidth - e.clientX)));

    const onMouseUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const node = editorQuery.activeNode;

  useEffect(() => {
    if (node?.id && editorQuery.selectionCount === 1) setIsOpen(true);
  }, [node?.id, editorQuery.selectionCount]);

  return (
    <aside
      className={cn(
        "grid grid-cols-[0fr] overflow-y-hidden transition-[grid-template-columns] duration-200",
        isOpen && "grid-cols-[1fr]",
      )}
    >
      <div className="overflow-hidden">
        <div style={{ width: `${width}px` }} className="relative mt-4 mr-4 h-[calc(100%-30px)]">
          <Frame label="PROPERTIES">
            {node ? (
              <div className="flex size-full min-h-0 flex-col overflow-hidden">
                <PropertiesBanner
                  nodeType={node.type}
                  nodeIcon={node.data.appearance.icon}
                  nodeLabel={node.data.appearance.label}
                  nodeBadges={node.data.appearance.badge}
                  nodeStatus={node.data.runtime.status}
                  executorStatus={executorState.status}
                  onClose={() => setIsOpen(false)}
                  onLabelChange={(v) => editorAction.patchNodeAppearance(node.id, { label: v })}
                  onExecute={() => execution.execute(node.id)}
                  onNodeSkip={() => currentNode.skip(node.id)}
                  onDelete={() => editorAction.deleteNode(node.id)}
                />

                <div className="custom-scroll h-full min-h-0 space-y-8 overflow-x-hidden overflow-y-auto p-4 text-xs">
                  <PropertiesConnections nodeId={node.id} />

                  <PropertiesInputs
                    nodeType={node.type}
                    config={node.data.config}
                    onPatch={(k, v) => editorAction.patchNodeConfig(node.id, k, v)}
                    onSet={(v) => editorAction.setNodeConfig(node.id, v)}
                  />

                  <PropertiesOutputs nodeType={node.type} output={node.data.output} />

                  <PropertiesMeta
                    nodeType={node.type}
                    onColorChange={(c) => editorAction.patchNodeAppearance(node.id, { color: c })}
                    onBadgeChange={(b) =>
                      editorAction.patchNodeAppearance(node.id, {
                        badge: node.data.appearance.badge.has(b)
                          ? (() => {
                              const next = new Set(node.data.appearance.badge);
                              next.delete(b);

                              return next;
                            })()
                          : new Set(node.data.appearance.badge).add(b),
                      })
                    }
                    appearance={node.data.appearance}
                    runtime={node.data.runtime}
                  />

                  {/* Bottom padding (cant use margin or padding on the parent as the overflow-hidden screws it up) */}
                  <div aria-hidden="true" className="pointer-events-none opacity-0 select-none" />
                </div>
              </div>
            ) : (
              <div className="text-ink flex h-full flex-col items-center justify-center gap-y-2 p-4 text-center">
                <MousePointerClick size={28} />

                <span className="text-xs font-medium tracking-wider uppercase">
                  Select a node to inspect properties
                </span>

                <Button
                  onClick={() => setIsOpen(false)}
                  variant="border"
                  size="sm"
                  className="mt-2 gap-x-2 border"
                >
                  <span>Dismiss</span>

                  <kbd className="border-ink/20 text-ink text-xxs border px-2 py-0.5">ESC</kbd>
                </Button>
              </div>
            )}
          </Frame>

          <Button
            aria-label="resize"
            onMouseDown={(e) => onMouseDown(e)}
            className={cn(
              "absolute top-0 left-0 z-450 flex h-full w-1 cursor-ew-resize flex-col items-center justify-center p-0",
              "hover:bg-ink active:bg-ink transition-colors active:scale-100",
            )}
          />
        </div>
      </div>
    </aside>
  );
}
