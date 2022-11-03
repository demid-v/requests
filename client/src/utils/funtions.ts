import type {
  DateType,
  Fields,
  FieldType,
  OptionsType,
  RawFields,
  TextType,
} from "@/utils/types/form-config";
import type {
  OrderFields,
  Orders,
  RawOrderFields,
  RawOrders,
} from "@/utils/types/form-order";

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

function transformFieldsToMap(fields: RawFields | RawOrderFields) {
  const fieldsMap: Fields = new Map();

  fields.forEach((field) => {
    if (isOptionsField(field.type)) {
      const options = new Map();

      field.options.forEach((option) => options.set(getRandomUuid(), option));

      field.options = options;
    }

    fieldsMap.set(field._id, field);
  });

  return fieldsMap;
}

function transformFieldsToMapForOrderForm(fields: RawFields) {
  const fieldsMap: OrderFields = new Map();

  fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      field.value = field.defaultValue;
      delete field.defaultValue;
    }

    if (isOptionsField(field.type)) {
      const options = new Map();

      field.options.forEach((option) => {
        if (option.isDefault !== undefined) {
          option.isValue = option.isDefault;
          delete option.isDefault;
        }

        options.set(getRandomUuid(), option);
      });

      field.options = options;
    }

    fieldsMap.set(field._id, field);
  });

  return fieldsMap;
}

function transformOrdersToMap(orders: RawOrders) {
  const ordersMap: Orders = new Map();

  orders.forEach((order) => {
    ordersMap.set(order._id, {
      ...order,
      fields: transformFieldsToMap(order.fields),
    });
  });

  return ordersMap;
}

export {
  isTextField,
  isOptionsField,
  isDateField,
  getRandomUuid,
  transformFieldsToMap,
  transformFieldsToMapForOrderForm,
  transformOrdersToMap,
};
