import type { RelativeFieldTypes } from "./types/form-structure";

const RELATIVE_FIELD_TYPES: RelativeFieldTypes = Object.freeze({
  text: ["multiline"],
  multiline: ["text"],
  checkbox: ["select"],
  select: ["checkbox"],
});

export { RELATIVE_FIELD_TYPES };
