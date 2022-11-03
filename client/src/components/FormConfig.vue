<script setup lang="ts">
import {
  isTextField,
  isOptionsField,
  getRandomUuid,
  transformFieldsToMap,
} from "@/utils/funtions";
import type {
  Fields,
  FieldType,
  Options,
  OptionsField,
} from "@/utils/types/form-config";
import { ref, toRaw, watch, watchEffect, type Ref } from "vue";

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

function onTypeSelectAddField(event: Event) {
  const type = (event.target as HTMLSelectElement).value as FieldType;

  formConfig.value.set(getRandomUuid(), {
    type: type,
    name: "",
    ...(isOptionsField(type) && {
      options: new Map([[getRandomUuid(), { name: "" }]]),
    }),
    index: formConfig.value.size + 1,
  });

  (event.target as HTMLSelectElement).value = "";
}

function onTypeSelectChange(event: Event, id: string) {
  const type = (event.target as HTMLSelectElement).value as FieldType;

  const fieldSet = formConfig.value.get(id);

  if (fieldSet) {
    formConfig.value.set(id, {
      type,
      name: fieldSet.name || "",
      description: fieldSet.description || "",
      ...(isOptionsField(fieldSet.type) && {
        options: new Map([[getRandomUuid(), { name: "" }]]),
      }),
      index: fieldSet.index,
    });
  }
}

function deleteFieldSet(list: Fields | Options, id: string) {
  list!.delete(id);
}

function onNewOptionClick(options: Options, optionsField: OptionsField) {
  if (options === undefined) {
    options = optionsField.options = new Map();
  }

  delete optionsField.isInvalid;

  options.set(getRandomUuid(), { name: "" });
}

function onOptionSetAsDefault(event: Event, options: Options, inId: string) {
  const prevCheckedOption = Array.from(options.entries()).find(
    ([id, { isDefault }]) => id !== inId && isDefault
  );

  if (prevCheckedOption !== undefined) {
    delete options.get(prevCheckedOption[0])?.isDefault;
  }

  const optionValue = (event.target as HTMLInputElement).checked;
  const option = options.get(inId);

  if (option) {
    if (optionValue) {
      option.isDefault = true;
    } else {
      delete option.isDefault;
    }
  }
}

function onFormSubmit() {
  const fieldsPrepared = prepareObject();

  console.log(fieldsPrepared);

  sendObject(fieldsPrepared);
}

function isValid() {
  form.value.reportValidity();

  for (const [, field] of formConfig.value) {
    if (field.name.trim() === "") {
      field.name = "";

      return false;
    }

    if (isOptionsField(field.type) && field.options.size === 0) {
      field.isInvalid = true;

      return false;
    }
  }

  return true;
}

function prepareObject() {
  const fieldsPrepared: any = [];

  formConfig.value.forEach((field) => {
    const fieldPrepared: any = {};

    fieldPrepared._id = field._id;
    fieldPrepared.type = field.type;
    fieldPrepared.name = field.name;
    fieldPrepared.index = field.index;

    if (field.description?.trim() !== "") {
      fieldPrepared.description = field.description;
    }

    if (field.type === "checkbox" || field.type === "select") {
      fieldPrepared.options = [];

      field.options.forEach((option) => {
        const optionPrepared: any = {};

        optionPrepared.name = option.name;

        if (option.isDefault === true || option.isDefault === "true") {
          optionPrepared.isDefault = option.isDefault;
        }

        fieldPrepared.options.push(optionPrepared);
      });
    }

    if (field.type === "text" || field.type === "multiline") {
      const defaultTrimmed = field.defaultValue?.trim();

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

watch(formConfig, () => console.log(toRaw(formConfig.value)));

const form = ref();
</script>

<template>
  <form ref="form" @submit.prevent="onFormSubmit()">
    <fieldset>
      <legend>Form config</legend>

      <fieldset v-for="[id, field] in formConfig" :key="id">
        <button type="button" @click="deleteFieldSet(formConfig, id)">
          Delete</button
        ><br />

        <label :for="id">Field type</label><br />
        <select
          :id="id"
          :name="id"
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
          :name="id"
          v-model="field.name"
          required
        /><br />

        <label :for="id">Description</label><br />
        <input
          type="text"
          :id="id"
          :name="id"
          v-model="field.description"
        /><br />

        <template v-if="isTextField(field.type)">
          <label :for="id">Default value</label><br />
          <input
            type="text"
            :id="id"
            :name="id"
            v-model="field.defaultValue"
          /><br />
        </template>

        <template v-else-if="isOptionsField(field.type)">
          <template v-for="[id, option] in field.options" :key="id">
            <label :for="id">Option name</label><br />
            <input
              type="text"
              :id="id"
              :name="id"
              v-model="option.name"
              required
            />
            <input
              type="checkbox"
              name="default-option"
              value="true"
              title="Set as default"
              :checked="option.isDefault"
              @change="onOptionSetAsDefault($event, field.options, id)"
            />
            <button type="button" @click="deleteFieldSet(field.options, id)">
              Delete</button
            ><br />
          </template>

          <button type="button" @click="onNewOptionClick(field.options, field)">
            New option</button
          ><br />

          <div v-if="field.isInvalid">There needs at least one option</div>
        </template>

        <label :for="id">Is required</label>
        <input
          type="checkbox"
          :id="id"
          name="is-required"
          value="true"
          v-model="field.isRequired"
        /><br />
      </fieldset>

      <label for="new-field-type">Field type</label><br />
      <select
        name="new-field-type"
        id="new-field-type"
        @change="onTypeSelectAddField($event)"
      >
        <option value="" selected disabled hidden>Choose type</option>
        <option value="text">Text</option>
        <option value="multiline">Multiline</option>
        <option value="checkbox">Checkbox</option>
        <option value="select">Select</option>
        <option value="datetime-local">Date and time</option></select
      ><br />

      <input type="submit" value="Confirm" @click="isValid()" />
    </fieldset>
  </form>
</template>

<style scoped></style>
