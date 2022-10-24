import type { InputHTMLAttributes, VNodeRef } from "vue";

type FieldType = "text" | "multiline" | "checkbox" | "select" | "datetime";

type GenericField = {
  type: FieldType;
  name: string;
  description?: string;
  isRequired?: InputHTMLAttributes["checked"];
};

type TextField = GenericField & {
  default?: string;
};

type OptionsField = GenericField & {
  options?: Map<
    string,
    {
      name?: string;
      isDefault?: InputHTMLAttributes["checked"];
    }
  >;
  invalid?: true;
};

type DatatimeField = GenericField;

type Field = GenericField | OptionsField;

type Fields = Map<string, Field>;

export type {
  FieldType,
  TextField,
  OptionsField,
  DatatimeField,
  Field,
  Fields,
};
