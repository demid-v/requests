<script setup lang="ts">
import type {
  Field,
  Fields,
  Option,
  OptionsField,
  TextField,
} from "@/types/form-config";
import type { Order } from "@/types/form-order";
import { transformFieldsToMap } from "@/utils/funtions";
import { ref, watch, watchEffect, type Ref } from "vue";

const { order } = defineProps<{ order?: Order }>();

const formConfig: Ref<Fields> = ref(new Map());

function getFormConfig() {
  fetch("http://localhost:5501/form-config", {
    method: "GET",
  }).then(async (resp) => {
    const data = await resp.json();
    console.log("form-config:", data);

    formConfig.value = transformFieldsToMap(data);
  });
}

watchEffect(getFormConfig);

function onCheckBoxClick(event: Event, option: Option) {
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

function prepareObject() {
  const fieldsPrepared: any = [];

  formConfig.value.forEach((field) => {
    const fieldPrepared: any = {};

    fieldPrepared.type = field.type;
    fieldPrepared.name = field.name;

    if (field.description?.trim() !== "") {
      fieldPrepared.description = field.description;
    }

    if (field.type === "checkbox" || field.type === "select") {
      fieldPrepared.options = [];

      (field as OptionsField).options?.forEach((option) => {
        const optionPrepared: any = {};

        optionPrepared.name = option.name;

        if (option.isDefault === true || option.isDefault === "true") {
          optionPrepared.isDefault = option.isDefault;
        }

        fieldPrepared.options.push(optionPrepared);
      });
    }

    if (
      field.type === "text" ||
      field.type === "multiline" ||
      field.type === "datetime-local"
    ) {
      const defaultTrimmed = (field as TextField).default?.trim();

      if (defaultTrimmed !== "") {
        fieldPrepared.default = defaultTrimmed;
      }
    }

    if (field.isRequired === true) {
      fieldPrepared.isRequired = field.isRequired;
    }

    fieldsPrepared.push(fieldPrepared);
  });

  return fieldsPrepared;
}

function onOwnFormSubmit() {
  // if (!isValid()) {
  //   return false;
  // }

  const fieldsPrepared = prepareObject();

  console.log(fieldsPrepared);

  // sendObject(fieldsPrepared);
}

function onLatestFormSubmit() {
  // if (!isValid()) {
  //   return false;
  // }

  const fieldsPrepared = prepareObject();

  console.log(fieldsPrepared);

  sendObject(fieldsPrepared);
}

watch(formConfig, () => console.log(formConfig));
</script>

<template>
  <div>
    <form @submit.prevent="onOwnFormSubmit()">
      <fieldset>
        <legend>Order's information</legend>

        <template v-for="[id, field] in order?.fields">
          <label :for="field.type !== 'checkbox' ? id : undefined">{{
            field.name
          }}</label
          ><br />

          <input
            v-if="field.type === 'text' || field.type === 'datetime-local'"
            :type="field.type"
            :id="id"
            v-model="(field as TextField).default"
            :required="<true | undefined>field.isRequired"
          />

          <textarea
            v-else-if="field.type === 'multiline'"
            :type="field.type"
            :id="id"
            v-model="(field as TextField).default"
            :required="<true | undefined>field.isRequired"
            >{{ (field as TextField).default }}</textarea
          >

          <template
            v-else-if="field.type === 'checkbox'"
            v-for="([id, option], index) in (field as OptionsField).options"
          >
            <label :for="id">{{ option.name }}</label>
            <input
              :type="field.type"
              :id="id"
              :name="field.name"
              :value="option.name"
              :checked="option.isDefault"
              @click="onCheckBoxClick($event, option)"
            /><br v-if="index !== (field as OptionsField).options!.size - 1" />
          </template>

          <select v-else-if="field.type === 'select'" :id="id">
            <option
              v-for="[id, option] in ((field as OptionsField).options)"
              :key="id"
              :id="id"
              :value="option.name"
              :selected="<true | undefined>option.isDefault"
            >
              {{ option.name }}
            </option>
          </select>

          <br />
        </template>

        <input type="submit" value="Confirm" />
      </fieldset>
    </form>

    <form @submit.prevent="onLatestFormSubmit()">
      <fieldset>
        <legend>Order's information</legend>

        <template v-for="[id, field] in formConfig">
          <label :for="id">{{ field.name }}</label
          ><br />

          <input
            v-if="field.type === 'text' || field.type === 'datetime-local'"
            :type="field.type"
            :id="id"
            v-model="(field as TextField).default"
            :required="<true | undefined>field.isRequired"
          />

          <textarea
            v-else-if="field.type === 'multiline'"
            :type="field.type"
            :id="id"
            v-model="(field as TextField).default"
            :required="<true | undefined>field.isRequired"
            >{{ (field as TextField).default }}</textarea
          >

          <template
            v-else-if="field.type === 'checkbox'"
            v-for="([id, option], index) in (field as OptionsField).options"
          >
            <label>{{ option.name }}</label>
            <input
              :type="field.type"
              :id="id"
              :value="option.name"
              :checked="option.isDefault"
              @click="onCheckBoxClick($event, option)"
            /><br v-if="index !== (field as OptionsField).options!.size - 1" />
          </template>

          <select v-else-if="field.type === 'select'" :id="id">
            <option
              v-for="[id, option] in ((field as OptionsField).options)"
              :key="id"
              :id="id"
              :value="option.name"
              :selected="<true | undefined>option.isDefault"
            >
              {{ option.name }}
            </option>
          </select>

          <br />
        </template>

        <input type="submit" value="Confirm" />
      </fieldset>
    </form>
  </div>
</template>

<style scoped></style>
