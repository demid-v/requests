import type {
  DateType,
  GenericField,
  RawGenericField,
  OptionsType,
  TextType,
} from "./form-structure";

type RequestTextField = GenericField & {
  type: TextType;
  value?: string;
};

type RequestOptionField = {
  name: string;
  isValue?: true;
};

type RequestOptions = Map<string, RequestOptionField>;

type RequestOptionsField = GenericField & {
  type: OptionsType;
  options: RequestOptions;
};

type RequestDateField = GenericField & { type: DateType; value?: string };

type RequestField = RequestTextField | RequestOptionsField | RequestDateField;

type RequestFields = Map<string, RequestField>;

type Request = { _id: string; fields: RequestFields };

type Requests = Map<string, Request>;

type RawRequestTextField = RawGenericField & {
  type: TextType;
  value?: string;
};

type RawRequestOptionsField = RawGenericField & {
  type: OptionsType;
  options: RequestOptions;
};

type RawRequestDateField = RawGenericField & { type: DateType };

type RawRequestField =
  | RawRequestTextField
  | RawRequestOptionsField
  | RawRequestDateField;

type RawRequestFields = RawRequestField[];

type RawRequest = { _id: string; fields: RawRequestFields };

type RawRequests = RawRequest[];

export type {
  RequestTextField,
  RequestOptionsField,
  RequestDateField,
  RequestOptionField,
  RequestOptions,
  RequestField,
  RequestFields,
  Request,
  Requests,
  RawRequestFields,
  RawRequests,
};
