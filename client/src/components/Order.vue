<script setup lang="ts">
type Order = { _id: string; title: string; description: string; date: string };
defineProps<{ order: Order; switchEditing: Function }>();
</script>

<template>
  <div class="order">
    <div>
      <p>{{ order.title }}</p>
      <p>{{ order.description }}</p>
      <p>{{ order.date }}</p>
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
