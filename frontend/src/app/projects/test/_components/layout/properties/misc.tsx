import { Info } from "lucide-react";

import { ConfigFieldMeta, OutputFieldMeta } from "@/app/projects/test/_components/canvas/config";

type Title = {
  label: string;
  hasData?: boolean;
  info?: string;
};

export function Title({ label, hasData, info }: Title) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink text-xs font-semibold">{label}</span>

      {!hasData && info && (
        <div className="flex items-center justify-center gap-x-2">
          <span className="text-xs">{info}</span>

          <Info size={12} />
        </div>
      )}
    </div>
  );
}

const DATA_TYPE: Record<ConfigFieldMeta["widget"] | OutputFieldMeta["widget"], string> = {
  SELECT: "enum",
  MULTI_SELECT: "array",
  TABLE: "table",
  RECORD: "object",
  TEXT: "string",
  NUMBER: "number",
  JSON: "json",

  NONE: "void",
};

export function WidgetType({
  type,
}: {
  type: ConfigFieldMeta["widget"] | OutputFieldMeta["widget"];
}) {
  return <span className="absolute -top-6 right-0 text-xs">{DATA_TYPE[type]}</span>;
}

export function WidgetError({ error }: { error: string }) {
  return (
    error && (
      <span className="text-xxs text-destructive-ink line-clamp-2 font-medium italic">{error}</span>
    )
  );
}
