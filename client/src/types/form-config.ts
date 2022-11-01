import type { InputHTMLAttributes } from "vue";

type FieldType =
  | "text"
  | "multiline"
  | "checkbox"
  | "select"
  | "datetime-local";

type GenericField = {
  _id?: string;
  type: FieldType;
  name: string;
  description?: string;
  isRequired?: InputHTMLAttributes["checked"];
};

type TextField = GenericField & {
  default?: string;
};

type Option = {
  name?: string;
  isDefault?: InputHTMLAttributes["checked"];
};

type OptionsField = GenericField & {
  options?: Map<string, Option>;
  invalid?: true;
};

type DatatimeField = GenericField;

type Field = GenericField | OptionsField;

type Fields = Map<string, Field>;

export type {
  FieldType,
  TextField,
  Option,
  OptionsField,
  DatatimeField,
  Field,
  Fields,
};
