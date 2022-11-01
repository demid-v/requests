<script setup lang="ts">
import { ref, watch, watchEffect, type Ref } from "vue";
import Order from "../components/Order.vue";
import Form from "../components/Form.vue";
import type { Orders } from "@/types/form-order";
import { transformOrdersToMap } from "@/utils/funtions";

const orders: Ref<Orders> = ref(new Map());

watch(orders, () => console.log(orders));

const isEditing = ref(false);
const editingOrderId = ref();

function getOrders() {
  fetch("http://localhost:5501/orders", {
    method: "GET",
  }).then(async (resp) => {
    const data = await resp.json();
    console.log("orders:", data);

    orders.value = transformOrdersToMap(data);
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
