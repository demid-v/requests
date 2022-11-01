import type { Fields } from "@/types/form-config";
import type { Orders } from "@/types/form-order";

const getRandomUUIDForElement = () => crypto.randomUUID();

function transformFieldsToMap(fields: any[]) {
  const fieldsMap: Fields = new Map();

  fields.forEach((item) => {
    if (item.type === "checkbox" || item.type === "select") {
      const options = new Map();

      item.options.forEach((option: any) =>
        options.set(getRandomUUIDForElement(), option)
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

export { transformFieldsToMap, transformOrdersToMap };
