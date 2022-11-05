<script setup lang="ts">
import { ref, toRaw, watch, watchEffect, type Ref } from "vue";
import Request from "../components/Request.vue";
import RequestWindow from "../components/RequestWindow.vue";
import type { Requests } from "@/utils/types/form-request";
import { transformRequestsToMap } from "@/utils/funtions";
import type { KeyOfMap } from "@/utils/types/common";

const requests: Ref<Requests> = ref(new Map());

watch(requests, () => console.log(toRaw(requests.value)));

const isFormOpen = ref(false);
const editingRequestId: Ref<KeyOfMap<Requests> | null | undefined> = ref();

function getRequests() {
  fetch("http://localhost:5501/requests", {
    method: "GET",
  }).then(async (resp) => {
    const data = await resp.json();
    console.log("requests:", data);

    requests.value = transformRequestsToMap(data);
  });
}

watchEffect(getRequests);

function switchEditing(requestId: KeyOfMap<Requests>) {
  if (editingRequestId.value == null) {
    isFormOpen.value = true;
  } else if (requestId === editingRequestId.value) {
    isFormOpen.value = !isFormOpen.value;
  } else {
    isFormOpen.value = true;
  }

  editingRequestId.value = requestId;
}

function openForm() {
  if (editingRequestId.value == null || !isFormOpen.value) {
    if (isFormOpen.value) {
      isFormOpen.value = false;
    } else {
      isFormOpen.value = true;
    }
  }

  if (editingRequestId.value != null) {
    editingRequestId.value = null;
  }
}
</script>

<template>
  <main>
    <h1>Requests</h1>

    <div v-if="requests">
      <Request
        v-for="[id, request] in requests"
        :key="id"
        :request="request"
        :switchEditing="switchEditing"
      />

      <button @click="openForm()">New request</button>

      <RequestWindow
        v-show="isFormOpen"
        :request="
          editingRequestId !== null ? requests.get(editingRequestId) : undefined
        "
      />
    </div>
  </main>
</template>
