<script setup lang="ts">
import type { Field, Fields, TextField } from "@/types";
import { watch, watchEffect } from "vue";

type Order = { _id: string; title: string; description: string; date: string };
const { order } = defineProps<{
  order: { _id: string; fields: Fields };
  switchEditing: Function;
}>();

watchEffect(() => console.log(order));
</script>

<template>
  <div class="order">
    <div>
      <p>
        {{ (Array.from(order.fields.entries())[0][1] as TextField).default }}
      </p>
      <p>
        {{ (Array.from(order.fields.entries())[1][1] as TextField).default }}
      </p>
      <p>
        {{
          new Date(
            (Array.from(order.fields.entries())[2][1] as TextField).default ||
              ""
          )
        }}
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
