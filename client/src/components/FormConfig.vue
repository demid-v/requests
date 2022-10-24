<script setup lang="ts">
import { reactive, watch } from "vue";
import type { Fields, FieldType, TextField, OptionsField } from "../types";

const fields: Fields = reactive(new Map());

function getRandomUUIDForElement() {
  return crypto.randomUUID();
}

function onTypeSelectChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const value = target.value as FieldType;

  fields.set(getRandomUUIDForElement(), {
    type: value,
    name: "",
  });

  target.value = "";
}

function deleteField(list: Fields | OptionsField["options"], uuid: string) {
  list!.delete(uuid);
}

function onNewOptionClick(
  fieldOptions: OptionsField["options"],
  field: OptionsField
) {
  if (fieldOptions === undefined) {
    fieldOptions = field.options = new Map();
  }

  delete field.invalid;

  fieldOptions.set(getRandomUUIDForElement(), {});
}

function onDefaultOptionSet(options: OptionsField["options"], uuid: string) {
  if (options) {
    const prevCheckedOption = Array.from(options.entries()).find(
      ([id, { isDefault }]) =>
        id !== uuid && (isDefault === true || isDefault === "true")
    );

    if (prevCheckedOption !== undefined) {
      const prevCheckedOptionObject = options.get(prevCheckedOption[0]);

      if (prevCheckedOptionObject!.isDefault !== undefined) {
        delete prevCheckedOptionObject!.isDefault;
      }
    }
  }
}

function onFormSubmit(event: Event) {
  validate();

  const fieldsPrepared = prepareObject();
  console.log(fieldsPrepared);

  sendObject(fieldsPrepared);
}

function validate() {
  fields.forEach((field) => {
    console.log(field);

    console.log((field as OptionsField).options?.size);

    if (
      (field.type === "checkbox" || field.type === "select") &&
      ((field as OptionsField).options === undefined ||
        (field as OptionsField).options?.size === 0)
    ) {
      (field as OptionsField).invalid = true;
    }
  });
}

function prepareObject() {
  const fieldsPrepared: any = [];

  fields.forEach((field) => {
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
          optionPrepared.isDefault = 1;
        }

        fieldPrepared.options.push(optionPrepared);
      });
    }

    if (field.type === "text" || field.type === "multiline") {
      const defaultTrimmed = (field as TextField).default?.trim();

      if (defaultTrimmed !== "") {
        fieldPrepared.default = defaultTrimmed;
      }
    }

    if (field.isRequired === true) {
      fieldPrepared.isRequired = 1;
    }

    fieldsPrepared.push(fieldPrepared);
  });

  return fieldsPrepared;
}

function sendObject(fieldsPrepared: any) {
  fetch("http://localhost:5501/form-config", {
    method: "POST",
    body: JSON.stringify(fieldsPrepared),
  }).then(async (resp) => {
    const ordersResp = await resp.json();
    console.log("resp:", ordersResp);
  });
}

watch(fields, () => console.log(fields));
</script>

<template>
  <form @submit.prevent="onFormSubmit($event)">
    <fieldset>
      <legend>Form config</legend>

      <fieldset v-for="[id, field] in fields" :key="id">
        <button type="button" @click="deleteField(fields, id)">Delete</button
        ><br />

        <label :for="id">Field type</label><br />
        <select
          :name="'fieldType-' + id"
          :id="id"
          v-model="field.type"
          required
        >
          <option value="" selected disabled hidden>Choose type</option>
          <option value="text">Text</option>
          <option value="multiline">Multiline</option>
          <option value="checkbox">Checkbox</option>
          <option value="select">Select</option>
          <option value="datetime">Date and time</option></select
        ><br />

        <label :for="id">Field name</label><br />
        <input
          type="text"
          :id="id"
          :name="'fieldName-' + id"
          v-model="field.name"
          required
        /><br />

        <label :for="id">Description</label><br />
        <input
          type="text"
          :id="id"
          :name="'fieldDescription-' + id"
          v-model="field.description"
        /><br />

        <template v-if="field.type === 'text' || field.type === 'multiline'">
          <label :for="id">Default value</label><br />
          <input
            type="text"
            :id="id"
            :name="'fieldDefault-' + id"
            v-model="(field as TextField).default"
          /><br />
        </template>

        <template
          v-else-if="field.type === 'checkbox' || field.type === 'select'"
        >
          <template
            v-for="[id, option] in (field as OptionsField).options"
            :key="id"
          >
            <label :for="id">Option name</label><br />
            <input
              type="text"
              :id="id"
              :name="'fieldName-' + id"
              v-model="option.name"
              required
            />
            <input
              type="checkbox"
              name="defaultOption"
              title="Set as default"
              v-model="option.isDefault"
              @change="onDefaultOptionSet((field as OptionsField).options, id)"
            />
            <button
              type="button"
              @click="deleteField((field as OptionsField).options, id)"
            >
              Delete</button
            ><br />
          </template>

          <button
            type="button"
            @click="
              onNewOptionClick(
                (field as OptionsField).options,
                field as OptionsField
              )
            "
          >
            New option</button
          ><br />

          <div v-if="(field as OptionsField).invalid">
            There needs at least one option
          </div>
        </template>

        <label :for="id">Is required</label>
        <input
          type="checkbox"
          :id="id"
          name="isRequired"
          v-model="field.isRequired"
        /><br />
      </fieldset>

      <label for="newFieldType">Field type</label><br />
      <select
        name="fieldType"
        id="newFieldType"
        @change="onTypeSelectChange($event)"
      >
        <option value="" selected disabled hidden>Choose type</option>
        <option value="text">Text</option>
        <option value="multiline">Multiline</option>
        <option value="checkbox">Checkbox</option>
        <option value="select">Select</option>
        <option value="datetime">Date and time</option></select
      ><br />

      <input type="submit" value="Confirm" />
    </fieldset>
  </form>
</template>

<style scoped></style>
