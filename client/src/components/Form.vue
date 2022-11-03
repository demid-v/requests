<script setup lang="ts">
import type { Field, Fields, OptionField } from "@/utils/types/form-config";
import type { OrderFields, Order } from "@/utils/types/form-order";
import {
  isOptionsField,
  transformFieldsToMapForOrderForm,
} from "@/utils/funtions";
import { ref, toRaw, watch, watchEffect, type Ref } from "vue";

const { order } = defineProps<{ order: Order }>();

const formConfig: Ref<OrderFields> = ref(new Map());

watch(formConfig, (formConfig) => console.log(toRaw(formConfig)));

const ownForm = ref();
const latestForm = ref();

function getFormConfig() {
  fetch("http://localhost:5501/form-config", {
    method: "GET",
  }).then(async (resp) => {
    const data = await resp.json();
    console.log("form-config:", data);

    formConfig.value = transformFieldsToMapForOrderForm(data);
  });
}

watchEffect(getFormConfig);

function setOptionValue(event: Event, option: OptionField) {
  if (!(event.target as HTMLInputElement).checked) {
    delete option.isDefault;
  } else {
    option.isDefault = true;
  }
}

function sendObject(fieldsPrepared: any) {
  fetch("http://localhost:5501/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fieldsPrepared),
  }).then(async (resp) => {
    const ordersResp = await resp.json();
    console.log("Order:", ordersResp);
  });
}

function isValid(formObject: Fields) {
  for (const [_id, field] of formObject) {
    if ((field.name = field.name.trim()) === "") {
      return false;
    }

    if (isOptionsField(field.type)) {
      for (const [_id, option] of field.options) {
        if ((option.name = option.name.trim()) === "") {
          return false;
        }
      }
    }
  }

  return true;
}

function isOwnFormValid() {
  return isValid(order.fields);
}

function isLatestFormValid() {
  return isValid(formConfig.value);
}

function prepareFields(fields: Fields) {
  const fieldsPrepared = (
    structuredClone(Array.from(toRaw(fields).values())) as Field[]
  ).map((field) => {
    if (isOptionsField(field.type)) {
      field.options = [...field.options.values()];
    }

    return field;
  });

  return fieldsPrepared;
}

function prepareOwnFormFields() {
  return prepareFields(order.fields);
}

function prepareLatestFormFields() {
  return prepareFields(formConfig.value);
}

function submitOwnForm() {
  const fieldsPrepared = prepareOwnFormFields();

  console.log(fieldsPrepared);

  // sendObject(fieldsPrepared);
}

function submitLatestForm() {
  const fieldsPrepared = prepareLatestFormFields();

  console.log(fieldsPrepared);

  // sendObject(fieldsPrepared);
}
</script>

<template>
  <div>
    <form ref="ownForm" @submit.prevent="submitOwnForm()">
      <fieldset>
        <legend>Order's information</legend>

        <template v-for="[id, field] in order.fields">
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
            /><br v-if="index !== (field ).options!.size - 1" />
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

        <input type="submit" value="Confirm" @click="isOwnFormValid()" />
      </fieldset>
    </form>

    <form ref="latestForm" @submit.prevent="submitLatestForm()">
      <fieldset>
        <legend>Latest version of the form</legend>

        <template v-for="[id, field] in formConfig">
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

        <input type="submit" value="Confirm" @click="isLatestFormValid()" />
      </fieldset>
    </form>
  </div>
</template>

<style scoped></style>
