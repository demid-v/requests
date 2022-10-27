<script setup lang="ts">
import type { Field, Fields, OptionsField, TextField } from "@/types";
import { reactive, watchEffect } from "vue";

type Order = { _id: string; title: string; description: string; date: string };

const { order } = defineProps<{ order?: Order }>();

const formConfig: Fields = reactive(new Map());

const getRandomUUIDForElement = () => crypto.randomUUID();

function transformObjectToMap(obj: any[], map: Map<string, Order | Field>) {
  obj.forEach((item) => {
    if (item.type === "checkbox" || item.type === "select") {
      const options = new Map();

      item.options.forEach((option: any) =>
        options.set(getRandomUUIDForElement(), option)
      );

      item.options = options;
    }

    map.set(item._id, item);
  });

  console.log(map);
}

function getFormConfig() {
  fetch("http://localhost:5501/form-config", {
    method: "GET",
  }).then(async (resp) => {
    const data = await resp.json();
    console.log("form-config:", data);

    transformObjectToMap(data, formConfig);
  });
}

watchEffect(getFormConfig);
</script>

<template>
  <form @submit.prevent="">
    <fieldset>
      <legend>Order's information</legend>

      <template v-for="[id, field] in formConfig">
        <label :for="id">{{ field.name }}</label
        ><br />

        <input
          v-if="field.type === 'text' || field.type === 'datetime-local'"
          :type="field.type"
          :id="id"
          :value="(field as TextField).default"
          :required="<true | undefined>field.isRequired"
        />

        <textarea
          v-else-if="field.type === 'multiline'"
          :type="field.type"
          :id="id"
          :value="(field as TextField).default"
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
          </option></select
        ><br />
      </template>

      <!-- <label for="name">Name</label><br />
      <input type="text" id="name" name="name" value="Order 1" required /><br />

      <label for="description">Description</label><br />
      <textarea id="description" name="description" required>
Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, quae.</textarea
      ><br />

      <label for="datetime">Order's date</label><br />
      <input id="datetime" name="datetime" type="datetime-local" required />
      <br />

      <label for="options">Select an option</label><br />
      <select id="options" name="options">
        <option value="1">1</option>
        <option value="2" selected>2</option>
        <option value="3">3</option></select
      ><br /> -->

      <input type="submit" value="Confirm" />
    </fieldset>
  </form>
</template>

<style scoped></style>
