import z from "zod";

import { Title } from "@/app/projects/test/_components/layout/properties/misc";
import { randomBadgeColor } from "@/app/projects/test/_components/layout/properties/config";
import { CanvasNode, NodeData } from "@/app/projects/test/_providers/editor/config";
import {
  OUTPUT_SCHEMA_TYPES,
  OutputFieldMeta,
} from "@/app/projects/test/_components/canvas/config";
import { nodeOutputRegistry } from "@/app/projects/test/_components/canvas/utils";
import { OUTPUT_WIDGET_TYPES } from "@/app/projects/test/_components/layout/properties/outputs/config";
import {
  toJSON,
  toNumber,
  toObject,
  toString,
} from "@/app/projects/test/_components/layout/properties/utils";

import { Badge } from "@/components/ui/primitives/badge";
import { Diamond } from "@/components/ui/decorations/diamond";

import { cn } from "@/lib/utils/cn";

type PropertiesOutputs = {
  nodeType: CanvasNode["type"];
  output: NodeData["output"];
};

type Widget = {
  meta: OutputFieldMeta;
  value: unknown;
};

function Widget({ meta, value }: Widget) {
  switch (meta.widget) {
    case "TABLE":
      return <OUTPUT_WIDGET_TYPES.TABLE value={{}} />;

    case "RECORD":
      return <OUTPUT_WIDGET_TYPES.RECORD value={toObject(value)} />;

    case "TEXT":
      return <OUTPUT_WIDGET_TYPES.TEXT value={toString(value)} />;

    case "NUMBER":
      return <OUTPUT_WIDGET_TYPES.NUMBER value={toNumber(value)} />;

    case "JSON":
      return <OUTPUT_WIDGET_TYPES.JSON value={toJSON(value)} />;
  }
}

export function PropertiesOutputs({ nodeType, output }: PropertiesOutputs) {
  const schema = OUTPUT_SCHEMA_TYPES[nodeType];

  if (!schema) return null;

  const groups = Object.entries(schema.shape).reduce<
    Record<
      string,
      {
        key: string;
        fieldSchema: z.ZodType;
        meta: OutputFieldMeta;
      }[]
    >
  >((acc, [key, fieldSchema]) => {
    const meta = nodeOutputRegistry.get(fieldSchema);

    if (!meta) return acc;

    const groupKey = meta.group || key;

    if (!acc[groupKey]) acc[groupKey] = [];

    acc[groupKey].push({ key, fieldSchema, meta });

    return acc;
  }, {});

  const hasOutput = Object.values(output).every((v) => v !== null);

  return (
    <div className="space-y-2">
      <Title label="OUTPUTS" info="no output data" hasData={hasOutput} />

      <div className="relative space-y-2">
        {hasOutput &&
          Object.entries(groups).map(([key, fields]) => {
            const hasGroup = fields.length > 1;

            return (
              <div key={key} className="relative space-y-2 pl-4">
                <Diamond borderColor="black" className="absolute top-1.25 left-0" />

                <Badge className={cn("border-0", randomBadgeColor(key))}>{key}</Badge>

                {hasGroup ? (
                  <div className="bg-ink/4 flex items-center gap-2 p-2 text-xs">
                    {fields.map(({ key }) => (
                      <span className="text-ink" key={key}>
                        {String((output as Record<string, unknown>)[key] ?? "")}
                      </span>
                    ))}
                  </div>
                ) : (
                  <Widget
                    meta={fields[0].meta}
                    value={(output as Record<string, unknown>)[fields[0].key]}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
