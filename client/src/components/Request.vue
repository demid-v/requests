<script setup lang="ts">
import type {
  Request,
  RequestDateField,
  RequestTextField,
} from "@/utils/types/form-request";
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
        {{ ([...request.fields.values()][0] as RequestTextField).value }}
      </p>
      <p>
        {{ ([...request.fields.values()][1] as RequestTextField).value }}
      </p>
      <p>
        {{
          new Date(
            ([...request.fields.values()][2] as RequestDateField).value || ""
          )
        }}
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
