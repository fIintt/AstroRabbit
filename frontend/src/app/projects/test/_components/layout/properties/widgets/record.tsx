import { useEffect, useRef, useState } from "react";

import { nanoid } from "nanoid";

import { Plus, Trash2 } from "lucide-react";

import { ConfigWidget } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { OutputWidget } from "@/app/projects/test/_components/layout/properties/outputs/config";
import { WidgetType } from "@/app/projects/test/_components/layout/properties/misc";

import { Button } from "@/components/ui/primitives/button";

import { cn } from "@/lib/utils/cn";

type Row = {
  id: string;
  key: string;
  value: string;
};

function sameRows(a: Record<string, unknown>, b: Record<string, unknown>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every((k) => a[k] === b[k]);
}

function toRows(obj: Record<string, unknown>): Row[] {
  return Object.entries(obj).map(([k, v]) => ({
    id: nanoid(),
    key: k,
    value: String(v ?? ""),
  }));
}

function initRow(length: number): Row[] {
  return length === 0 ? [{ id: nanoid(), key: "", value: "" }] : [];
}

export function RecordInput({ value, onChange }: ConfigWidget["RECORD"]) {
  const [rows, setRows] = useState<Row[]>(() => [
    ...initRow(Object.keys(value).length),
    ...toRows(value),
  ]);

  const lastValRef = useRef<Record<string, unknown>>(value);

  const onCommit = (updatedRows: Row[]) => {
    setRows(updatedRows);

    const record = updatedRows.reduce<Record<string, string>>((acc, row) => {
      if (row.key.trim() !== "") acc[row.key] = row.value;

      return acc;
    }, {});

    lastValRef.current = record;

    onChange(record);
  };

  const onRowChange = (id: string, field: "key" | "value", value: string) => {
    const updated = rows.map((r) => (r.id === id ? { ...r, [field]: value } : r));

    onCommit(updated);
  };

  const onAddRow = () => setRows([...rows, { id: nanoid(), key: "", value: "" }]);

  const onDeleteRow = (id: string) => onCommit(rows.filter((r) => r.id !== id));

  useEffect(() => {
    if (sameRows(lastValRef.current, value)) return;

    lastValRef.current = value;

    setRows([...initRow(Object.keys(value).length), ...toRows(value)]);
  }, [value]);

  return (
    <div className="relative space-y-2">
      {rows.map((r) => {
        return (
          <div
            key={r.id}
            className="group relative flex items-center justify-center gap-x-2 transition-[padding] duration-200 hover:pr-9 active:pr-9"
          >
            <input
              placeholder="Key"
              value={r.key}
              onChange={(e) => onRowChange(r.id, "key", e.target.value)}
              className="bg-ink/4 text-ink min-w-20 flex-1 p-2 hover:outline focus:outline"
            />

            <input
              placeholder="Value"
              value={r.value}
              onChange={(e) => onRowChange(r.id, "value", e.target.value)}
              className="bg-ink/4 text-ink min-w-20 flex-1 p-2 hover:outline focus:outline"
            />

            <Button
              onClick={(e) => {
                e.stopPropagation();

                onDeleteRow(r.id);
              }}
              variant="destructive"
              className={cn(
                "absolute right-0 opacity-0",
                "group-hover:opacity-100 group-active:opacity-100",
                "active:scale-90",
              )}
              size="icon"
              title="Delete row"
              aria-label="Delete row"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        );
      })}

      <Button onClick={onAddRow} variant="border" className="w-full border py-1">
        <Plus className="size-4" />
      </Button>

      <WidgetType type="RECORD" />
    </div>
  );
}

export function RecordOutput({ value }: OutputWidget["RECORD"]) {
  const hasValue = Object.keys(value).length > 0;

  return (
    <div className="relative space-y-2">
      {!hasValue ? (
        <div className="group flex items-center justify-center gap-x-2">
          <input
            readOnly
            placeholder="Key"
            className="bg-ink/4 text-ink min-w-20 flex-1 p-2 outline-none"
          />

          <input
            readOnly
            placeholder="Value"
            className="bg-ink/4 text-ink min-w-20 flex-1 p-2 outline-none"
          />
        </div>
      ) : (
        Object.entries(value).map(([key, value]) => (
          <div key={key} className="group flex items-center justify-center gap-x-2">
            <input
              readOnly
              value={key}
              className="bg-ink/4 text-ink min-w-20 flex-1 p-2 outline-none"
            />

            <input
              readOnly
              value={String(value ?? "")}
              placeholder="Value"
              className="bg-ink/4 text-ink min-w-20 flex-1 p-2 outline-none"
            />
          </div>
        ))
      )}

      <WidgetType type="RECORD" />
    </div>
  );
}
