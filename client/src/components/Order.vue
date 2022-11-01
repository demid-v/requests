<script setup lang="ts">
import type { Field, Fields, TextField } from "@/types/form-config";
import type { Order } from "@/types/form-order";
import { watch, watchEffect } from "vue";

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
