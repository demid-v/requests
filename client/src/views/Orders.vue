<script setup lang="ts">
import { ref, type Ref } from "vue";
import Order from "../components/Order.vue";

type Order = { _id: string; title: string; description: string; date: string };
const orders: Ref<Order[] | undefined> = ref();

fetch("http://localhost:5501/orders", {
  method: "GET",
}).then(async (resp) => {
  const ordersResp = await resp.json();
  console.log("orders:", ordersResp);

  orders.value = ordersResp;
});
</script>

<template>
  <main>
    <h1>Orders:</h1>
    <div v-if="orders">
      <Order v-for="order in orders" :key="order._id" :order="order" />
    </div>
  </main>
</template>
