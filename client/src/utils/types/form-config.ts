type TextType = "text" | "multiline";

type OptionsType = "checkbox" | "select";

type DateType = "datetime-local";

type FieldType = TextType | OptionsType | DateType;

type GenericField = {
  _id?: string;
  type: FieldType;
  name: string;
  description?: string;
  isRequired?: true;
  index: number;
};

type TextField = GenericField & {
  type: TextType;
  defaultValue?: string;
};

type OptionField = {
  name: string;
  isDefault?: true;
};

type Options = Map<string, OptionField>;

type OptionsField = GenericField & {
  type: OptionsType;
  options: Options;
  isInvalid?: true;
};

type DateField = GenericField & { type: DateType };

type Field = TextField | OptionsField | DateField;

type RawFields = Field[];

type Fields = Map<string, Field>;

export type {
  TextType,
  OptionsType,
  DateType,
  FieldType,
  TextField,
  OptionField,
  Options,
  OptionsField,
  DateField,
  Field,
  RawFields,
  Fields,
};
