<script setup lang="ts">
import type { Order } from "@/utils/types/form-order";
import { watchEffect } from "vue";

const { order } = defineProps<{
  order: Order;
  switchEditing: Function;
}>();

watchEffect(() => console.log(order));
</script>

<template>
  <div class="order">
    <div>
      <p>
        {{ [...order.fields.values()][0].value }}
      </p>
      <p>
        {{ [...order.fields.values()][1].value }}
      </p>
      <p>
        {{ new Date([...order.fields.values()][2].value || "") }}
      </p>
    </div>

    <div><button @click="switchEditing(order._id)">Edit</button></div>
  </div>
</template>

<style scoped>
.order {
  border: 1px solid black;
  padding: 7px 8px;
  margin-bottom: 10px;
}
</style>
