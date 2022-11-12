<script setup lang="ts">
import {
  transformFieldsToMapForRequestForm,
  isOptionsField,
} from "@/utils/funtions";
import type {
  RequestField,
  RequestFields,
  RequestOptionField,
} from "@/utils/types/form-request";
import { ref, toRaw, watch, watchEffect, type Ref } from "vue";

const formStructure: Ref<RequestFields> = ref(new Map());

const form = ref();
const isFormValid = ref(false);

watch(formStructure, (formStructure) => console.log(toRaw(formStructure)));

function getFormStructure() {
  fetch("http://localhost:5501/form-structure", {
    method: "GET",
  }).then(async (resp) => {
    const data = await resp.json();
    console.log("form-structure:", data);

    formStructure.value = transformFieldsToMapForRequestForm(data);
  });
}

watchEffect(getFormStructure);

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
      let isValidOptions = false;

      for (const [_id, option] of field.options) {
        if (option.isValue) {
          isValidOptions = true;
          break;
        }
      }

      if (!isValidOptions) {
        return false;
      }
    }
  }

  return true;
}

function checkFormValidity() {
  isFormValid.value = isValid(formStructure.value);
}

function prepareFields(fields: RequestFields) {
  const fieldsPrepared = (
    structuredClone([...toRaw(fields).values()]) as RequestField[]
  ).map((field) => {
    if (isOptionsField(field)) {
      return { ...field, options: [...field.options.values()] };
    }

    return field;
  });

  return fieldsPrepared;
}

function submitForm() {
  if (isFormValid.value) {
    const fieldsPrepared = prepareFields(formStructure.value);

    console.log(fieldsPrepared);

    // sendObject(fieldsPrepared);
  }
}
</script>

<template>
  <form ref="form" @submit.prevent="submitForm()">
    <fieldset>
      <legend>Latest version of the form</legend>

      <template v-for="[id, field] in formStructure">
        <label :for="id">{{ field.name }}</label
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
          <label>{{ option.name }}</label>
          <input
            :type="field.type"
            :id="id"
            :value="option.name"
            :checked="option.isValue"
            @click="setOptionValue($event, option)"
          /><br v-if="index !== field.options.size - 1" />
        </template>

        <select v-else-if="field.type === 'select'" :id="id">
          <option value="" selected disabled hidden>---</option>
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
