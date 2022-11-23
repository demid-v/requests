import type {
  DateType,
  Field,
  OptionsType,
  RawFields,
  TextType,
  TextField,
  OptionsField,
  DateField,
  FieldType,
  RawOptionsField,
  RawField,
  RawTextField,
} from "@/utils/types/form-structure";
import type {
  Requests,
  RawRequestFields,
  RawRequests,
  RawRequestField,
} from "@/utils/types/form-request";

function isTextType(type: FieldType): type is TextType {
  return type === "text" || type === "multiline";
}

function isOptionsType(type: FieldType): type is OptionsType {
  return type === "checkbox" || type === "select";
}

function isDateType(type: FieldType): type is DateType {
  return type === "datetime-local";
}

function isTextField(field: Field): field is TextField {
  return isTextType(field.type);
}

function isOptionsField(field: Field): field is OptionsField {
  return isOptionsType(field.type);
}

function isDateField(field: Field): field is DateField {
  return isDateType(field.type);
}

function isRawTextField(field: RawField): field is RawTextField {
  return isTextType(field.type);
}

function isRawOptionsField(
  field: RawField | RawRequestField
): field is RawOptionsField {
  return isOptionsType(field.type);
}

const getRandomUuid = () => crypto.randomUUID();

function transformFieldsToMap(fields: RawFields | RawRequestFields) {
  const fieldsMap = new Map();

  fields.forEach((field) => {
    const newField = structuredClone(field);

    if (isRawOptionsField(field)) {
      const options = new Map();

      field.options.forEach((option) => options.set(getRandomUuid(), option));
      newField.options = options;
    }

    fieldsMap.set(field._id, newField);
  });

  return fieldsMap;
}

function transformFieldsToMapForRequestForm(fields: RawFields) {
  const fieldsMap = new Map();

  fields.forEach((field) => {
    const transformedField = structuredClone(field);

    if (isRawTextField(field)) {
      transformedField.value = field.defaultValue;
    } else if (isRawOptionsField(field)) {
      transformedField.options = new Map();

      field.options.forEach((option) => {
        const { isDefault, ...optionProps } = option;

        transformedField.options.set(getRandomUuid(), {
          ...optionProps,
          ...(isDefault && { isValue: isDefault }),
        });
      });
    }

    fieldsMap.set(transformedField._id, transformedField);
  });

  return fieldsMap;
}

function transformRequestsToMap(requests: RawRequests) {
  const requestsMap: Requests = new Map();

  requests.forEach((request) => {
    requestsMap.set(request._id, {
      ...request,
      fields: transformFieldsToMap(request.fields),
    });
  });

  return requestsMap;
}

export {
  isTextType,
  isOptionsType,
  isDateType,
  isTextField,
  isOptionsField,
  isDateField,
  isRawOptionsField,
  getRandomUuid,
  transformFieldsToMap,
  transformFieldsToMapForRequestForm,
  transformRequestsToMap,
};
