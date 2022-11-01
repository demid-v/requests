import type { Fields } from "./form-config";

type Order = { _id: string; fields: Fields };

type Orders = Map<string, Order>;

export type { Order, Orders };
