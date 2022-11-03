import type {
  DateType,
  Fields,
  FieldType,
  OptionsType,
  RawFields,
  TextType,
} from "@/utils/types/form-config";
import type { Orders } from "@/utils/types/form-order";

function isTextField(type: FieldType): type is TextType {
  return type === "text" || type === "multiline";
}

function isOptionsField(type: FieldType): type is OptionsType {
  return type === "checkbox" || type === "select";
}

function isDateField(type: FieldType): type is DateType {
  return type === "datetime-local";
}

const getRandomUuid = () => crypto.randomUUID();

function transformFieldsToMap(fields: RawFields) {
  const fieldsMap: Fields = new Map();

  fields.forEach((item) => {
    if (isOptionsField(item.type)) {
      const options = new Map();

      item.options.forEach((option: any) =>
        options.set(getRandomUuid(), option)
      );

      item.options = options;
    }

    fieldsMap.set(item._id, item);
  });

  return fieldsMap;
}

function transformOrdersToMap(orders: any[]) {
  const ordersMap: Orders = new Map();

  orders.forEach((order) => {
    order.fields = transformFieldsToMap(order.fields);

    ordersMap.set(order._id, order);
  });

  return ordersMap;
}

export {
  isTextField,
  isOptionsField,
  isDateField,
  getRandomUuid,
  transformFieldsToMap,
  transformOrdersToMap,
};
