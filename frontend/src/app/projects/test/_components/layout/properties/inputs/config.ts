import { SelectInput } from "@/app/projects/test/_components/layout/properties/widgets/select";
import { RecordInput } from "@/app/projects/test/_components/layout/properties/widgets/record";
import { TextInput } from "@/app/projects/test/_components/layout/properties/widgets/text";
import { NumberInput } from "@/app/projects/test/_components/layout/properties/widgets/number";
import { JsonInput } from "@/app/projects/test/_components/layout/properties/widgets/json";
import { MultiSelectInput } from "@/app/projects/test/_components/layout/properties/widgets/multi-select";

export type ConfigWidget = {
  SELECT: {
    value: string;
    options: readonly string[];
    onChange: (v: unknown) => void;
  };

  MULTI_SELECT: {
    value: string[];
    options: readonly string[];
    onChange: (v: string[]) => void;
  };

  RECORD: {
    value: Record<string, unknown>;
    error: string;
    onChange: (v: Record<string, unknown>) => void;
  };

  TEXT: {
    value: string;
    error: string;
    onChange: (v: string) => void;
  };

  NUMBER: {
    value: number;
    error: string;
    onChange: (v: number) => void;
  };

  JSON: {
    value: string;
    error: string;
    onChange: (v: string) => void;
  };
};

export const CONFIG_WIDGET_TYPES: {
  [K in keyof ConfigWidget]: React.ComponentType<ConfigWidget[K]>;
} = {
  SELECT: SelectInput,
  MULTI_SELECT: MultiSelectInput,
  RECORD: RecordInput,
  TEXT: TextInput,
  NUMBER: NumberInput,
  JSON: JsonInput,
};
