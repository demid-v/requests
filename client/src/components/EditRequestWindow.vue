<script setup lang="ts">
import type { Request } from "@/utils/types/form-request";
import OwnRequestForm from "./OwnRequestForm.vue";
import EditRequestForm from "./EditRequestForm.vue";

defineProps<{ request: Request | undefined }>();
</script>

<template>
  <div v-if="request">
    <OwnRequestForm :request="request" />
    <EditRequestForm :id="request._id" />
  </div>
</template>
