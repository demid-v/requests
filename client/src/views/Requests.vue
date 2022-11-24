<script setup lang="ts">
import { ref, toRaw, watch, watchEffect, type Ref } from "vue";
import Request from "../components/Request.vue";
import EditRequestWindow from "../components/EditRequestWindow.vue";
import CreateRequestWindow from "../components/CreateRequestWindow.vue";
import type { Requests } from "@/utils/types/form-request";
import { transformRequestsToMap } from "@/utils/funtions";
import type { KeyOfMap } from "@/utils/types/common";

const requests: Ref<Requests> = ref(new Map());

watch(requests, () => console.log(toRaw(requests.value)));

const isEditRequestFormOpen = ref(false);
const isCreateRequestFormOpen = ref(false);
const editingRequestId: Ref<KeyOfMap<Requests> | null> = ref(null);

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

function switchEditing(requestId: string) {
  isCreateRequestFormOpen.value = false;

  if (requestId === editingRequestId.value) {
    isEditRequestFormOpen.value = !isEditRequestFormOpen.value;
  } else {
    isEditRequestFormOpen.value = true;
  }

  editingRequestId.value = requestId;
}

function openForm() {
  isEditRequestFormOpen.value = false;
  isCreateRequestFormOpen.value = !isCreateRequestFormOpen.value;
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

      <EditRequestWindow
        v-show="isEditRequestFormOpen"
        :request="requests.get(editingRequestId || '')"
      />

      <CreateRequestWindow v-show="isCreateRequestFormOpen" />
    </div>
  </main>
</template>
