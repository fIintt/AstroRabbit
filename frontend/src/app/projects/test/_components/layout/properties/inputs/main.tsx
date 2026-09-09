import { useCallback, useEffect, useRef, useState } from "react";

import z from "zod";

import {
  CONFIG_SCHEMA_TYPES,
  ConfigFieldMeta,
} from "@/app/projects/test/_components/canvas/config";
import {
  nodeConfigRegistry,
  resolveConfigSchema,
} from "@/app/projects/test/_components/canvas/utils";
import { generateBadgeColor } from "@/app/projects/test/_components/layout/properties/config";
import { CONFIG_WIDGET_TYPES } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { Title } from "@/app/projects/test/_components/layout/properties/misc";
import { CanvasNode, NodeData } from "@/app/projects/test/_providers/editor/config";
import {
  toArray,
  toJSON,
  toNumber,
  toObject,
  toString,
} from "@/app/projects/test/_components/layout/properties/utils";

import { Badge } from "@/components/ui/primitives/badge";
import { Diamond } from "@/components/ui/decorations/diamond";

import { cn } from "@/lib/utils/cn";
import { formatText } from "@/lib/utils/formatText";

type PropertiesInputs = {
  nodeType: CanvasNode["type"];
  config: NodeData["config"];
  onPatch: (key: string, value: unknown) => void;
  onSet: (value: NodeData["config"]) => void;
};

type Widget = {
  meta: ConfigFieldMeta;
  error: string;
  value: unknown;
  onChange: (value: unknown) => void;
};

function Widget({ meta, value, error, onChange }: Widget) {
  switch (meta.widget) {
    case "SELECT":
      return (
        <CONFIG_WIDGET_TYPES.SELECT
          value={toString(value)}
          options={meta.options}
          onChange={onChange}
        />
      );

    case "MULTI_SELECT":
      return (
        <CONFIG_WIDGET_TYPES.MULTI_SELECT
          value={toArray(value)}
          options={meta.options}
          onChange={onChange}
        />
      );

    case "RECORD":
      return (
        <CONFIG_WIDGET_TYPES.RECORD value={toObject(value)} error={error} onChange={onChange} />
      );

    case "TEXT":
      return <CONFIG_WIDGET_TYPES.TEXT value={toString(value)} error={error} onChange={onChange} />;

    case "NUMBER":
      return (
        <CONFIG_WIDGET_TYPES.NUMBER value={toNumber(value)} error={error} onChange={onChange} />
      );

    case "JSON":
      return <CONFIG_WIDGET_TYPES.JSON value={toJSON(value)} error={error} onChange={onChange} />;
  }
}

export function PropertiesInputs({ nodeType, config, onPatch, onSet }: PropertiesInputs) {
  const entry = CONFIG_SCHEMA_TYPES[nodeType];
  const schema = resolveConfigSchema(entry, config);

  if (!schema) return null;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const delayRef = useRef<Record<string, NodeJS.Timeout | null>>({});

  const onChange = useCallback(
    (field: z.ZodType, k: string, v: unknown) => {
      const timer = delayRef.current[k];

      if (timer) clearTimeout(timer);

      const timeout = setTimeout(() => {
        delayRef.current[k] = null;

        if (k === "provider" && !(entry instanceof z.ZodObject)) {
          const nextSchema = entry[String(v)];

          if (!nextSchema) return null;

          const merge = nextSchema.safeParse({ ...config, provider: v });

          const newConfig = merge.success
            ? { ...config, ...merge.data }
            : nextSchema.parse({ provider: v });

          setErrors({});
          // Safe to assert, nextSchema was resolved from nodeType
          onSet(newConfig as NodeData["config"]);

          return;
        }

        const res = field.safeParse(v);

        if (!res.success)
          return setErrors((prev) => ({
            ...prev,
            [k]: res.error.issues[0].message,
          }));

        setErrors((prev) => {
          const next = { ...prev };

          delete next[k];
          return next;
        });

        onPatch(k, res.data);
      }, 500);

      delayRef.current[k] = timeout;
    },
    [entry, config, onPatch, onSet],
  );

  useEffect(() => {
    return () => {
      for (const timeout of Object.values(delayRef.current)) if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="space-y-2">
      <Title label="INPUTS" hasData={true} />

      <div className="relative space-y-2">
        {Object.entries(schema.shape).map(([key, fieldSchema]) => {
          const meta = nodeConfigRegistry.get(fieldSchema);

          if (!meta) return null;

          if (meta.hiddenWhen(config)) return null;

          return (
            <div key={key} className="relative space-y-2 pl-4">
              <Diamond borderColor="black" className="absolute top-1.25 left-0" />

              <Badge className={cn("border-0", generateBadgeColor(key))}>{formatText(key)}</Badge>

              <Widget
                meta={meta}
                error={errors[key]}
                value={(config as Record<string, unknown>)[key]}
                onChange={(v) => onChange(fieldSchema, key, v)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
