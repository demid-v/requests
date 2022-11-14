<script setup lang="ts">
import {
  isTextField,
  isOptionsField,
  getRandomUuid,
  transformFieldsToMap,
  isOptionsType,
  isTextType,
  isDateType,
} from "@/utils/funtions";
import type {
  DateField,
  Fields,
  FieldType,
  Options,
  OptionsField,
  RawFields,
  TextField,
} from "@/utils/types/form-structure";
import { ref, toRaw, watch, watchEffect, type Ref } from "vue";

const formStructure: Ref<Fields> = ref(new Map());

watch(formStructure, (formStructure) => console.log(toRaw(formStructure)));

const form = ref();

function getFormStructure() {
  fetch("http://localhost:5501/form-structure", {
    method: "GET",
  }).then(async (resp) => {
    const data = await resp.json();
    console.log("form-structure:", data);

    formStructure.value = transformFieldsToMap(data);
  });
}

watchEffect(getFormStructure);

function createField(type: FieldType, name?: string, description?: string) {
  const descriptionTrimmed = description?.trim();

  const field = {
    type: type,
    name: name?.trim() || "",
    ...(descriptionTrimmed && { description: descriptionTrimmed }),
  };

  if (isTextType(type)) {
    return field as TextField;
  } else if (isDateType(type)) {
    return field as DateField;
  } else if (isOptionsType(type)) {
    (field as OptionsField).options = new Map([
      [getRandomUuid(), { name: "" }],
    ]);

    return field as OptionsField;
  } else throw new TypeError("Unknown field type");
}

function addField(event: Event) {
  const fieldType = (event.target as HTMLSelectElement).value as FieldType;

  const field = createField(fieldType);
  formStructure.value.set(getRandomUuid(), field);

  (event.target as HTMLSelectElement).value = "";
}

function changeFieldType(event: Event, id: string) {
  const fieldType = (event.target as HTMLSelectElement).value as FieldType;
  const field = formStructure.value.get(id);

  const newField = createField(fieldType, field?.name, field?.description);
  formStructure.value.set(id, newField);
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

function wipeBlankInputs() {
  for (const [_id, field] of formStructure.value) {
    field.name = field.name.trim();

    if ((field.description = field.description?.trim()) === "") {
      delete field.description;
    }

    if (isTextField(field)) {
      if ((field.defaultValue = field.defaultValue?.trim()) === "") {
        delete field.defaultValue;
      }
    }

    if (isOptionsField(field)) {
      for (const [_id, option] of field.options) {
        option.name = option.name.trim();
      }
    }
  }
}

function prepareObject() {
  const fieldsPrepared = (
    structuredClone([...toRaw(formStructure.value).values()]) as RawFields
  ).map((field, index) => {
    field.index = index + 1;

    if (isOptionsField(field)) {
      return { ...field, options: [...field.options.values()] };
    }

    return field;
  });

  return fieldsPrepared;
}

function sendObject(fieldsPrepared: any) {
  fetch("http://localhost:5501/form-structure", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fieldsPrepared),
  }).then(async (resp) => {
    const data = await resp.json();
    console.log("resp:", data);
  });
}
</script>

<template>
  <form ref="form" @submit.prevent="submitForm()">
    <fieldset>
      <legend>Form structure</legend>

      <fieldset v-for="[id, field] in formStructure" :key="id">
        <button type="button" @click="deleteField(formStructure, id)">
          Delete</button
        ><br />

        <label :for="'field-type-' + id">Field type</label><br />
        <select
          :id="'field-type-' + id"
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
          v-model="field.name"
          required
        /><br />

        <label :for="'description-' + id">Description</label><br />
        <input
          type="text"
          :id="'description-' + id"
          v-model="field.description"
        /><br />

        <template v-if="isTextField(field)">
          <label :for="'default-value-' + id">Default value</label><br />
          <input
            type="text"
            :id="'default-value-' + id"
            v-model="field.defaultValue"
          /><br />
        </template>

        <template v-else-if="isOptionsField(field)">
          <template v-for="[id, option] in field.options" :key="id">
            <label :for="id">Option name</label><br />
            <input type="text" :id="id" v-model="option.name" required />
            <input
              type="checkbox"
              title="Set as default"
              :value="true"
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

      <input type="submit" value="Confirm" @click="wipeBlankInputs()" />
    </fieldset>
  </form>
</template>

<style scoped></style>
