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
  RawFields,
} from "@/utils/types/form-config";
import { ref, toRaw, watch, watchEffect, type Ref } from "vue";

const formConfig: Ref<Fields> = ref(new Map());

watch(formConfig, (formConfig) => console.log(toRaw(formConfig)));

const form = ref();

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

function addField(event: Event) {
  const type = (event.target as HTMLSelectElement).value as FieldType;

  formConfig.value.set(getRandomUuid(), {
    type,
    name: "",
    ...(isOptionsField(type) && {
      options: new Map([[getRandomUuid(), { name: "" }]]),
    }),
  });

  (event.target as HTMLSelectElement).value = "";
}

function changeFieldType(event: Event, id: string) {
  const type = (event.target as HTMLSelectElement).value as FieldType;

  const field = formConfig.value.get(id);

  if (field) {
    formConfig.value.set(id, {
      type,
      name: field.name || "",
      description: field.description || "",
      ...(isOptionsField(field.type) && {
        options: new Map([[getRandomUuid(), { name: "" }]]),
      }),
    });
  }
}

function deleteField(list: Fields | Options, id: string) {
  list.delete(id);
}

function addOption(options: Options) {
  options.set(getRandomUuid(), { name: "" });
}

function setDefaultOption(event: Event, options: Options, inId: string) {
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

function submitForm() {
  const fieldsPrepared = prepareObject();

  console.log(fieldsPrepared);

  // sendObject(fieldsPrepared);
}

function isValid() {
  for (const [_id, field] of formConfig.value) {
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

function prepareObject() {
  const fieldsPrepared = (
    structuredClone([...toRaw(formConfig.value).values()]) as RawFields
  ).map((field, index) => {
    if (isOptionsField(field.type)) {
      field.options = [...field.options.values()];
    }

    field.index = index + 1;

    return field;
  });

  return fieldsPrepared;
}

function sendObject(fieldsPrepared: any) {
  fetch("http://localhost:5501/form-config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fieldsPrepared),
  }).then(async (resp) => {
    const data = await resp.json();
    console.log("resp:", data);
  });
}

function onOptionalFieldChange(event: Event, id: string, property: string) {
  const value = (event.target as HTMLInputElement).value;

  const field = formConfig.value.get(id);

  if (value) {
    field[property] = value;
  } else {
    delete field[property];
  }
}

function onDescriptionChange(event: Event, id: string) {
  onOptionalFieldChange(event, id, "description");
}

function onDefaultValueChange(event: Event, id: string) {
  onOptionalFieldChange(event, id, "defaultValue");
}
</script>

<template>
  <form ref="form" @submit.prevent="submitForm()">
    <fieldset>
      <legend>Form config</legend>

      <fieldset v-for="[id, field] in formConfig" :key="id">
        <button type="button" @click="deleteField(formConfig, id)">
          Delete</button
        ><br />

        <label :for="'field-type-' + id">Field type</label><br />
        <select
          :id="'field-type-' + id"
          :name="id"
          required
          @change="changeFieldType($event, id)"
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

        <label :for="'field-name-' + id">Field name</label><br />
        <input
          type="text"
          :id="'field-name-' + id"
          :name="id"
          v-model="field.name"
          required
        /><br />

        <label :for="'description-' + id">Description</label><br />
        <input
          type="text"
          :id="'description-' + id"
          :name="id"
          :value="field.description"
          @change="onDescriptionChange($event, id)"
        /><br />

        <!-- Using type guards here and elsewhere gives the following error: 
          "Property 'defaultValue' does not exist on type 'Field'. 
          Property 'defaultValue' does not exist on type 'OptionsField'."
          Writing "field.type === 'text' || field.type === 'multiline'", 
          which is supposedly the same thing, gets rig of the messages of this kind. -->
        <template v-if="isTextField(field.type)">
          <label :for="'default-value-' + id">Default value</label><br />
          <input
            type="text"
            :id="'default-value-' + id"
            :name="id"
            :value="field.defaultValue"
            @change="onDefaultValueChange($event, id)"
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
              @change="setDefaultOption($event, field.options, id)"
            />
            <button
              v-if="field.options.size !== 1"
              type="button"
              @click="deleteField(field.options, id)"
            >
              Delete</button
            ><br />
          </template>

          <button type="button" @click="addOption(field.options)">
            New option</button
          ><br />
        </template>

        <label :for="'is-required-' + id">Is required</label>
        <input
          type="checkbox"
          :id="'is-required-' + id"
          name="is-required"
          value="true"
          v-model="field.isRequired"
        /><br />
      </fieldset>

      <label for="field-type">Field type</label><br />
      <select id="field-type" @change="addField($event)">
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
