import type {
  DateType,
  Fields,
  Field,
  OptionsType,
  RawFields,
  TextType,
  TextField,
  OptionsField,
  DateField,
  FieldType,
} from "@/utils/types/form-config";
import type {
  RequestFields,
  Requests,
  RawRequestFields,
  RawRequests,
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

const getRandomUuid = () => crypto.randomUUID();

function transformFieldsToMap(fields: RawFields | RawRequestFields) {
  const fieldsMap: Fields = new Map();

  fields.forEach((field) => {
    if (isOptionsField(field)) {
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
    const transformedField: any = field;

    if (isTextField(field)) {
      transformedField.value = field.defaultValue;
    } else if (isOptionsField(field)) {
      transformedField.options = new Map();

      field.options.forEach((option) => {
        const { isDefault, ...optionProps } = option;

        transformedField.options.set(getRandomUuid(), {
          ...optionProps,
          isValue: isDefault,
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
  getRandomUuid,
  transformFieldsToMap,
  transformFieldsToMapForRequestForm,
  transformRequestsToMap,
};
