<script setup lang="ts">
import { reactive, ref, watch, watchEffect, type Ref } from "vue";
import Order from "../components/Order.vue";
import Form from "../components/Form.vue";
import type { Field, Fields } from "@/types";

type Order = { _id: string; title: string; description: string; date: string };

const orders: Map<string, { _id: string; fields: Fields }> = reactive(
  new Map()
);

watch(orders, () => console.log(orders));

const isEditing = ref(false);
const editingOrderId = ref();

const getRandomUUIDForElement = () => crypto.randomUUID();

function transformObjectToMap(
  obj: any[],
  map: Map<string, { _id: string; fields: Fields }>
) {
  obj.forEach((order) => {
    const fields = new Map();

    order.fields.forEach((item: any) => {
      if (item.type === "checkbox" || item.type === "select") {
        const options = new Map();

        item.options.forEach((option: any) =>
          options.set(getRandomUUIDForElement(), option)
        );

        item.options = options;
      }

      fields.set(getRandomUUIDForElement(), item);
    });

    order.fields = fields;

    map.set(order._id, order);
  });
}

function getOrders() {
  fetch("http://localhost:5501/orders", {
    method: "GET",
  }).then(async (resp) => {
    const data = await resp.json();
    console.log("orders:", data);

    transformObjectToMap(data, orders);
  });
}

watchEffect(getOrders);

function switchEditing(orderId: string) {
  if (editingOrderId.value === undefined) {
    isEditing.value = true;
  } else if (orderId === editingOrderId.value) {
    isEditing.value = !isEditing.value;
  } else {
    isEditing.value = true;
  }

  editingOrderId.value = orderId;
}
</script>

<template>
  <main>
    <h1>Orders</h1>
    <div v-if="orders">
      <Order
        v-for="[id, order] in orders"
        :key="id"
        :order="order"
        :switchEditing="switchEditing"
      />
    </div>

    <Form
      v-if="editingOrderId"
      v-show="isEditing"
      :order="orders.get(editingOrderId)"
    />
  </main>
</template>
