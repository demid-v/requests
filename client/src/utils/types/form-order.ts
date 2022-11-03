import type {
  DateType,
  GenericField,
  GenericRawField,
  OptionsType,
  TextType,
} from "./form-config";

type OrderTextField = GenericField & {
  type: TextType;
  value?: string;
};

type OrderOptionField = {
  name: string;
  isValue?: true;
};

type OrderOptions = Map<string, OrderOptionField>;

type OrderOptionsField = GenericField & {
  type: OptionsType;
  options: OrderOptions;
};

type OrderDateField = GenericField & { type: DateType; value?: string };

type OrderField = OrderTextField | OrderOptionsField | OrderDateField;

type OrderFields = Map<string, OrderField>;

type Order = { _id: string; fields: OrderFields };

type Orders = Map<string, Order>;

type RawOrderTextField = GenericRawField & {
  type: TextType;
  value?: string;
};

type RawOrderOptionsField = GenericRawField & {
  type: OptionsType;
  options: OrderOptions;
};

type RawOrderDateField = GenericRawField & { type: DateType };

type RawOrderField =
  | RawOrderTextField
  | RawOrderOptionsField
  | RawOrderDateField;

type RawOrderFields = RawOrderField[];

type RawOrder = { _id: string; fields: RawOrderFields };

type RawOrders = RawOrder[];

export type { OrderFields, Order, Orders, RawOrderFields, RawOrders };
