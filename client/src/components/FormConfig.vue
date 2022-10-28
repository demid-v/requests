<script setup lang="ts">
import {
  reactive,
  ref,
  watch,
  watchEffect,
  type Ref,
  type VNodeRef,
} from "vue";
import type {
  Fields,
  FieldType,
  TextField,
  OptionsField,
  Field,
} from "../types";

const formConfig: Fields = reactive(new Map());

function transformObjectToMap(obj: any[], map: Map<string, Field>) {
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
}

function getFormConfig() {
  fetch("http://localhost:5501/form-config", {
    method: "GET",
  }).then(async (resp) => {
    const ordersResp = await resp.json();
    console.log("form-config:", ordersResp);

    transformObjectToMap(ordersResp, formConfig);
  });
}

watchEffect(getFormConfig);

const getRandomUUIDForElement = () => crypto.randomUUID();

function onTypeSelectAddField(event: Event) {
  const value = (event.target as HTMLSelectElement).value as FieldType;

  formConfig.set(getRandomUUIDForElement(), {
    type: value,
    name: "",
  });

  (event.target as HTMLSelectElement).value = "";
}

function onTypeSelectChange(event: Event, id: string) {
  const value = (event.target as HTMLSelectElement).value as FieldType;

  formConfig.set(id, {
    type: value,
    name: formConfig.get(id)?.name || "",
    description: formConfig.get(id)?.description || "",
  });
}

function deleteField(list: Fields | OptionsField["options"], id: string) {
  list!.delete(id);
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

function onOptionSetAsDefault(
  event: Event,
  options: OptionsField["options"],
  inId: string
) {
  if (options) {
    const prevCheckedOption = Array.from(options.entries()).find(
      ([id, { isDefault }]) =>
        id !== inId && (isDefault === true || isDefault === "true")
    );

    if (prevCheckedOption !== undefined) {
      delete options.get(prevCheckedOption[0])!.isDefault;
    }

    const optionValue = (event.target as HTMLInputElement).checked;
    const option = options.get(inId);

    if (optionValue) {
      option!.isDefault = true;
    } else {
      delete option!.isDefault;
    }
  }
}

function onFormSubmit() {
  if (!isValid()) {
    return false;
  }

  const fieldsPrepared = prepareObject();

  // const formData = new FormData(event.target as HTMLFormElement | undefined);
  // const fieldsPrepared = Array.from(formData.entries());

  console.log(fieldsPrepared);

  sendObject(fieldsPrepared);
}

function isValid() {
  formConfig.forEach((field) => {
    console.log(field);

    console.log((field as OptionsField).options?.size);

    if (
      (field.type === "checkbox" || field.type === "select") &&
      ((field as OptionsField).options === undefined ||
        (field as OptionsField).options?.size === 0)
    ) {
      (field as OptionsField).invalid = true;
      return false;
    }
  });

  return true;
}

function prepareObject() {
  const fieldsPrepared: any = [];

  formConfig.forEach((field) => {
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

    if (field.type === "text" || field.type === "multiline") {
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

function sendObject(fieldsPrepared: any) {
  fetch("http://localhost:5501/form-config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fieldsPrepared),
  }).then(async (resp) => {
    const ordersResp = await resp.json();
    console.log("resp:", ordersResp);
  });
}

watch(formConfig, () => console.log(formConfig));
</script>

<template>
  <form @submit.prevent="onFormSubmit()">
    <fieldset>
      <legend>Form config</legend>

      <fieldset v-for="[id, field] in formConfig" :key="id">
        <button type="button" @click="deleteField(formConfig, id)">
          Delete</button
        ><br />

        <label :for="id">Field type</label><br />
        <select
          :name="'fieldType-' + id"
          :id="id"
          required
          @change="onTypeSelectChange($event, id)"
        >
          <option value="" selected disabled hidden>Choose type</option>
          <option value="text" :selected="field.type === 'text'">Text</option>
          <option value="multiline" :selected="field.type === 'multiline'">
            Multiline
          </option>
          <option value="checkbox" :selected="field.type === 'checkbox'">
            Checkbox
          </option>
          <option value="select" :selected="field.type === 'select'">
            Select
          </option>
          <option
            value="datetime-local"
            :selected="field.type === 'datetime-local'"
          >
            Date and time
          </option></select
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
              :checked="option.isDefault"
              @change="
                onOptionSetAsDefault(
                  $event,
                  (field as OptionsField).options,
                  id
                )
              "
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
        @change="onTypeSelectAddField($event)"
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
