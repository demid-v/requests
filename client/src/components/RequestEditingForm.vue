<script setup lang="ts">
import { isOptionsField } from "@/utils/funtions";
import type { Field, Fields } from "@/utils/types/form-config";
import type {
  RequestFields,
  RequestOptionField,
} from "@/utils/types/form-request";
import { ref, toRaw, watch, watchEffect, type Ref } from "vue";

const props = defineProps<{ request?: Request }>();

const request: Ref<Request | undefined> = ref();

watchEffect(() => (request.value = structuredClone(toRaw(props?.request))));

watch(props, () => {
  console.log(props.request);

  request.value = structuredClone(toRaw(props?.request));
});

const form = ref();
const isFormValid: Ref<boolean | undefined> = ref();

function setOptionValue(event: Event, option: RequestOptionField) {
  if (!(event.target as HTMLInputElement).checked) {
    delete option.isValue;
  } else {
    option.isValue = true;
  }
}

function sendObject(fieldsPrepared: any) {
  fetch("http://localhost:5501/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fieldsPrepared),
  }).then(async (resp) => {
    const requestsResp = await resp.json();
    console.log("Request:", requestsResp);
  });
}

function isValid(formObject: RequestFields) {
  for (const [_id, field] of formObject) {
    if ((field.name = field.name.trim()) === "") {
      return false;
    }

    if (field.type === "checkbox" && field.isRequired) {
      let valid = false;

      for (const [_id, option] of field.options) {
        if (option.isValue) {
          valid = true;
          break;
        }
      }

      if (!valid) {
        return false;
      }
    }
  }

  return true;
}

function checkFormValidity() {
  isFormValid.value = isValid(request.value.fields);
}

function prepareFields(fields: Fields) {
  const fieldsPrepared = (
    structuredClone([...toRaw(fields).values()]) as Field[]
  ).map((field) => {
    if (isOptionsField(field.type)) {
      field.options = [...field.options.values()];
    }

    return field;
  });

  return fieldsPrepared;
}

function prepareFormFields() {
  return prepareFields(request.value.fields);
}

function submitForm() {
  if (isFormValid.value) {
    const fieldsPrepared = prepareFormFields();

    console.log(fieldsPrepared);

    // sendObject(fieldsPrepared);
  }
}
</script>

<template>
  <form v-if="request" ref="form" @submit.prevent="submitForm()">
    <fieldset>
      <legend>Request's information</legend>

      <template v-for="[id, field] in request.fields">
        <label :for="field.type !== 'checkbox' ? id : undefined">{{
          field.name
        }}</label
        ><br />

        <input
          v-if="field.type === 'text' || field.type === 'datetime-local'"
          :type="field.type"
          :id="id"
          v-model="field.value"
          :required="field.isRequired"
        />

        <textarea
          v-else-if="field.type === 'multiline'"
          :type="field.type"
          :id="id"
          v-model="field.value"
          :required="field.isRequired"
          >{{ field.value }}</textarea
        >

        <template
          v-else-if="field.type === 'checkbox'"
          v-for="([id, option], index) in field.options"
        >
          <label :for="id">{{ option.name }}</label>
          <input
            :type="field.type"
            :id="id"
            :name="field.name"
            :value="option.name"
            :checked="option.isValue"
            @click="setOptionValue($event, option)"
          /><br v-if="index !== field.options.size - 1" />
        </template>

        <select v-else-if="field.type === 'select'" :id="id">
          <option
            v-for="[id, option] in field.options"
            :key="id"
            :id="id"
            :value="option.name"
            :selected="option.isValue"
          >
            {{ option.name }}
          </option>
        </select>

        <br />
      </template>

      <input type="submit" value="Confirm" @click="checkFormValidity()" />
    </fieldset>
  </form>
</template>
