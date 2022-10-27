<script setup lang="ts">
import { reactive, ref, watchEffect, type Ref } from "vue";
import Order from "../components/Order.vue";
import Form from "../components/Form.vue";
import type { Field, Fields } from "@/types";

type Order = { _id: string; title: string; description: string; date: string };

const orders: Map<string, Order> = reactive(new Map());

const isEditing = ref(false);
const editingOrderId = ref();

function transformObjectToMap(obj: any[], map: Map<string, Order | Field>) {
  obj.forEach((item) => {
    map.set(item._id, item);
  });

  console.log(map);
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
