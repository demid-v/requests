import type {
  DateType,
  Fields,
  FieldType,
  OptionsType,
  RawFields,
  TextType,
} from "@/utils/types/form-config";
import type {
  RequestFields,
  Requests,
  RawRequestFields,
  RawRequests,
} from "@/utils/types/form-request";

function isTextField(type: FieldType): type is TextType {
  return type === "text" || type === "multiline";
}

function isOptionsField(type: FieldType): type is OptionsType {
  return type === "checkbox" || type === "select";
}

function isDateField(type: FieldType): type is DateType {
  return type === "datetime-local";
}

const getRandomUuid = () => crypto.randomUUID();

function transformFieldsToMap(fields: RawFields | RawRequestFields) {
  const fieldsMap: Fields = new Map();

  fields.forEach((field) => {
    if (isOptionsField(field.type)) {
      const options = new Map();

      field.options.forEach((option) => options.set(getRandomUuid(), option));

      field.options = options;
    }

    fieldsMap.set(field._id, field);
  });

  return fieldsMap;
}

function transformFieldsToMapForRequestForm(fields: RawFields) {
  const fieldsMap: RequestFields = new Map();

  fields.forEach((field) => {
    if (isOptionsField(field.type)) {
      const options = new Map();

      field.options.forEach((option) => {
        if (option.isDefault !== undefined) {
          option.isValue = option.isDefault;
          delete option.isDefault;
        }

        options.set(getRandomUuid(), option);
      });

      field.options = options;
    } else if ("defaultValue" in field) {
      field.value = field.defaultValue;
      delete field.defaultValue;
    }

    fieldsMap.set(field._id, field);
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
  isTextField,
  isOptionsField,
  isDateField,
  getRandomUuid,
  transformFieldsToMap,
  transformFieldsToMapForRequestForm,
  transformRequestsToMap,
};
