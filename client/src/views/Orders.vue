<script setup lang="ts">
import { reactive, ref, watchEffect, type Ref } from "vue";
import Order from "../components/Order.vue";
import Form from "../components/Form.vue";
import type { Field, Fields } from "@/types";

type Order = { _id: string; title: string; description: string; date: string };

const orders: Map<string, { _id: string; fields: Field[] }> = reactive(
  new Map()
);

const isEditing = ref(false);
const editingOrderId = ref();

const getRandomUUIDForElement = () => crypto.randomUUID();

function transformObjectToMap(
  obj: any[],
  map: Map<string, { _id: string; fields: Field[] }>
) {
  obj.forEach((item) => {
    if (item.type === "checkbox" || item.type === "select") {
      const options = new Map();

      item.options.forEach((option: any) =>
        options.set(getRandomUUIDForElement(), option)
      );

      item.options = options;
    }

    map.set(item._id, item);
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

    <Form v-show="isEditing" :order="orders.get(editingOrderId)" />
  </main>
</template>
