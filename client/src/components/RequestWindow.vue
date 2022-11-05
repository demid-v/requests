<script setup lang="ts">
import type { Request } from "@/utils/types/form-request";
import RequestEditingForm from "./RequestEditingForm.vue";
import RequestCreatingForm from "./RequestCreatingForm.vue";

const props = defineProps<{ request?: Request }>();
</script>

<template>
  <div>
    <RequestEditingForm v-if="props.request" :request="props.request" />
    <RequestCreatingForm />
  </div>
</template>

<style scoped></style>
