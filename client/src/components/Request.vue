<script setup lang="ts">
import type { Request } from "@/utils/types/form-request";
import { toRaw, watchEffect } from "vue";

const { request } = defineProps<{
  request: Request;
  switchEditing: Function;
}>();

watchEffect(() => console.log(toRaw(request)));
</script>

<template>
  <div class="request">
    <div>
      <p>
        {{ [...request.fields.values()][0].value }}
      </p>
      <p>
        {{ [...request.fields.values()][1].value }}
      </p>
      <p>
        {{ new Date([...request.fields.values()][2].value || "") }}
      </p>
    </div>

    <div><button @click="switchEditing(request._id)">Edit</button></div>
  </div>
</template>

<style scoped>
.request {
  border: 1px solid black;
  padding: 7px 8px;
  margin-bottom: 10px;
}
</style>
