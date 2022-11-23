type TextType = "text" | "multiline";

type OptionsType = "checkbox" | "select";

type DateType = "datetime-local";

type FieldType = TextType | OptionsType | DateType;

type CommonFieldBody = {
  name: string;
  description?: string;
  isRequired?: true;
};

type GenericField = CommonFieldBody & {
  _id?: string;
  index?: number;
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
};

type DateField = GenericField & { type: DateType };

type Field = TextField | OptionsField | DateField;

type Fields = Map<string, Field>;

type RawGenericField = CommonFieldBody & { _id: string; index: number };

type RawTextField = RawGenericField & {
  type: TextType;
  defaultValue?: string;
};

type RawOptions = OptionField[];

type RawOptionsField = RawGenericField & {
  type: OptionsType;
  options: RawOptions;
};

type RawDateField = RawGenericField & { type: DateType };

type RawField = RawTextField | RawOptionsField | RawDateField;

type RawFields = RawField[];

type Operation = "post" | "patch" | "put" | "delete";

type ChangedFields = Map<Field, Operation>;

type UnwrappedOptions = OptionField[];

type UnwrappedOptionsField = GenericField & {
  type: OptionsType;
  options: UnwrappedOptions;
};

type UnwrappedField = TextField | UnwrappedOptionsField | DateField;

type UnwrappedChangedFields = Map<UnwrappedField | string, Operation>;

type RelativeFieldTypes = Readonly<{ [key: string]: string[] }>;

export type {
  GenericField,
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
  Fields,
  RawGenericField,
  RawTextField,
  RawOptionsField,
  RawDateField,
  RawField,
  RawFields,
  Operation,
  ChangedFields,
  UnwrappedField,
  UnwrappedChangedFields,
  RelativeFieldTypes,
};
