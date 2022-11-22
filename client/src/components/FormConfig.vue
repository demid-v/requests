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
  ChangedFields,
  DateField,
  Field,
  Fields,
  FieldType,
  Options,
  OptionField,
  OptionsField,
  TextField,
  RelativeFieldTypes,
  UnwrappedChangedFields,
} from "@/utils/types/form-structure";
import { ref, toRaw, watch, watchEffect, type Ref } from "vue";

const formStructureOld: Ref<Fields> = ref(new Map());
const formStructure: Ref<Fields> = ref(new Map());

const changedFields: Ref<ChangedFields> = ref(new Map());

const RELATIVE_FIELD_TYPES: RelativeFieldTypes = Object.freeze({
  text: ["multiline"],
  multiline: ["text"],
  checkbox: ["select"],
  select: ["checkbox"],
});

watch(formStructure, (formStructure) => console.log(toRaw(formStructure)));

function getFormStructure() {
  fetch("http://localhost:5501/form-structure", {
    method: "GET",
  }).then(async (resp) => {
    const data = await resp.json();
    console.log("form-structure:", data);

    formStructure.value = transformFieldsToMap(data);
    formStructureOld.value = Object.freeze(
      structuredClone(toRaw(formStructure.value))
    );
  });
}

watchEffect(getFormStructure);

function addField(event: Event) {
  const fieldType = (event.target as HTMLSelectElement).value as FieldType;

  const field = createField(fieldType);
  formStructure.value.set(getRandomUuid(), field);

  changedFields.value.set(field, "post");

  (event.target as HTMLSelectElement).value = "";
}

function createField(type: FieldType, fieldIn?: Field) {
  const field = {
    ...(fieldIn
      ? createDefaultField(fieldIn)
      : {
          name: "",
        }),
    type,
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
  } else {
    throw new TypeError("Unknown field type");
  }
}

function createDefaultField(fieldIn: Field) {
  const { _id, name, description, isRequired } = fieldIn;
  const descriptionTrimmed = description?.trim();

  const field = {
    ...(_id && { _id }),
    name: name?.trim() || "",
    ...(descriptionTrimmed && { description: descriptionTrimmed }),
    ...(isRequired && { isRequired }),
  };

  return field;
}

function getOperation(field: Field, newFieldType: FieldType) {
  if (changedFields.value.get(field) === "post") {
    return "post";
  } else if (RELATIVE_FIELD_TYPES[field.type].includes(newFieldType)) {
    return "patch";
  } else {
    return "put";
  }
}

function changeFieldType(event: Event, id: string) {
  const fieldType = (event.target as HTMLSelectElement).value as FieldType;
  const field = formStructure.value.get(id) as Field;

  const newField = createField(fieldType, field);
  formStructure.value.set(id, newField);

  const operation = getOperation(field, fieldType);
  changedFields.value.delete(field);
  changedFields.value.set(newField, operation);
}

function deleteField(fields: Fields, id: string) {
  changedFields.value.delete(fields.get(id) as Field);
  fields.delete(id);
}

function deleteOption(options: Options, id: string) {
  options.delete(id);
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
  const option = options.get(inId) as OptionField;

  if (optionValue) {
    option.isDefault = true;
  } else {
    delete option.isDefault;
  }
}

function configureForm() {
  for (const field of formStructure.value.values()) {
    wipeBlankInputs(field);

    if (field._id !== undefined) {
      checkForChangedInputs(field, field._id);
    }
  }
}

function wipeBlankInputs(field: Field) {
  field.name = field.name.trim();

  field.description = field.description?.trim();
  if (field.description === "" || field.description === undefined) {
    delete field.description;
  }

  if (isTextField(field)) {
    field.defaultValue = field.defaultValue?.trim();
    if (field.defaultValue === "" || field.defaultValue === undefined) {
      delete field.defaultValue;
    }
  }

  if (isOptionsField(field)) {
    for (const [_id, option] of field.options) {
      option.name = option.name.trim();
    }
  }
}

function checkForChangedInputs(field: Field, id: string) {
  // console.log(toRaw(field));
  // console.log(toRaw(formStructureOld.value.get(id)));
}

function submitForm() {
  const unwrappedChangedFields = prepareFields();
  console.log(unwrappedChangedFields);

  sendChangedFields(unwrappedChangedFields);
}

function prepareFields() {
  const unwrappedChangedFields: UnwrappedChangedFields = new Map();

  for (const [index, [field, operation]] of [
    ...toRaw(changedFields.value).entries(),
  ].entries()) {
    const unwrappedChangedField = structuredClone(field);
    unwrappedChangedField.index = index + 1;

    if (isOptionsField(field)) {
      unwrappedChangedField.options = [...field.options.values()];
    }

    unwrappedChangedFields.set(unwrappedChangedField, operation);
  }

  return unwrappedChangedFields;
}

function sendChangedFields(unwrappedChangedFields: UnwrappedChangedFields) {
  fetch("http://localhost:5501/form-structure", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([...unwrappedChangedFields.entries()]),
  }).then(async (resp) => {
    const data = await resp.json();
    console.log("resp:", data);

    getFormStructure();
  });
}
</script>

<template>
  <form @submit.prevent="submitForm()">
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
              @click="deleteOption(field.options, id)"
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

      <input type="submit" value="Confirm" @click="configureForm()" />
    </fieldset>
  </form>
</template>

<style scoped></style>
