<script setup lang="ts">
type Order = { _id: string; title: string; description: string; date: string };
const { order } = defineProps<{ order: Order }>();
</script>

<template>
  <div class="order">
    <p>{{ order.title }}</p>
    <p>{{ order.description }}</p>
    <p>{{ order.date }}</p>
  </div>
</template>

<style scoped>
.order {
  border: 1px solid black;
  padding: 7px 8px;
  margin-bottom: 10px;
}
</style>
