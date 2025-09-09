import { get, set } from 'min-dash';

import {
  CheckboxEntry,
  isCheckboxEntryEdited,
  isFeelEntryEdited,
  FeelNumberEntry,
  isTextFieldEntryEdited,
  TextFieldEntry,
  SelectEntry,
} from '@bpmn-io/properties-panel';

import { useService, useVariables } from '../hooks';

import { INPUTS } from '../Util';

const VALIDATION_TYPE_OPTIONS = {
  custom: {
    value: '',
    label: 'سفارشی',
  },
  email: {
    value: 'email',
    label: 'ایمیل',
  },
  phone: {
    value: 'phone',
    label: 'تلفن',
  },
};

export function ValidationGroup(field, editField) {
  const { type } = field;
  const validate = get(field, ['validate'], {});
  const isCustomValidation = [undefined, VALIDATION_TYPE_OPTIONS.custom.value].includes(validate.validationType);
  const hasPattern = !!get(field, ['validate', 'pattern']);

  const onChange = (key) => {
    return (value) => {
      const validate = get(field, ['validate'], {});

      editField(field, ['validate'], set(validate, [key], value));
    };
  };

  const getValue = (key) => {
    return () => {
      return get(field, ['validate', key]);
    };
  };

  let entries = [
    {
      id: 'required',
      component: Required,
      getValue,
      field,
      isEdited: isCheckboxEntryEdited,
      onChange,
      isDefaultVisible: (field) => INPUTS.includes(field.type),
    },
  ];

  entries.push({
    id: 'validationType',
    component: ValidationType,
    getValue,
    field,
    editField,
    isEdited: isTextFieldEntryEdited,
    onChange,
    isDefaultVisible: (field) => field.type === 'textfield',
  });

  entries.push(
    {
      id: 'minLength',
      component: MinLength,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
      isDefaultVisible: (field) =>
        INPUTS.includes(field.type) && (type === 'textarea' || (type === 'textfield' && isCustomValidation)),
    },
    {
      id: 'maxLength',
      component: MaxLength,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
      isDefaultVisible: (field) =>
        INPUTS.includes(field.type) && (type === 'textarea' || (type === 'textfield' && isCustomValidation)),
    },
  );

  entries.push({
    id: 'pattern',
    component: Pattern,
    getValue,
    field,
    isEdited: isTextFieldEntryEdited,
    onChange,
    isDefaultVisible: (field) => INPUTS.includes(field.type) && type === 'textfield' && isCustomValidation,
  });

  entries.push({
    id: 'patternErrorMessage',
    component: PatternErrorMessage,
    getValue,
    field,
    isEdited: isTextFieldEntryEdited,
    onChange,
    isDefaultVisible: (field) =>
      INPUTS.includes(field.type) &&
      type === 'textfield' &&
      isCustomValidation && hasPattern,
  });

  entries.push(
    {
      id: 'min',
      component: Min,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
      isDefaultVisible: (field) => field.type === 'number',
    },
    {
      id: 'max',
      component: Max,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
      isDefaultVisible: (field) => field.type === 'number',
    },
  );

  return {
    id: 'validation',
    label: 'اعتبارسنجی',
    entries,
  };
}

function Required(props) {
  const { field, getValue, id, onChange } = props;

  return CheckboxEntry({
    element: field,
    getValue: getValue('required'),
    id,
    label: 'الزامی است',
    setValue: onChange('required'),
  });
}

function MinLength(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  return FeelNumberEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue: getValue('minLength'),
    id,
    label: 'حداقل طول',
    min: 0,
    setValue: onChange('minLength'),
    variables,
  });
}

function MaxLength(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  return FeelNumberEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue: getValue('maxLength'),
    id,
    label: 'حداکثر طول',
    min: 0,
    setValue: onChange('maxLength'),
    variables,
  });
}

function Pattern(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  return TextFieldEntry({
    debounce,
    element: field,
    getValue: getValue('pattern'),
    id,
    label: 'عبارت منظم (REGEX) سفارشی',
    setValue: onChange('pattern'),
  });
}

function PatternErrorMessage(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  return TextFieldEntry({
    debounce,
    element: field,
    getValue: getValue('patternErrorMessage'),
    id,
    label: 'پیغام خطای سفارشی',
    tooltip: 'پیام خطایی که هنگام عدم تطابق ورودی با عبارت منظم نمایش داده می‌شود.',
    setValue: onChange('patternErrorMessage'),
  });
}

function Min(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  return FeelNumberEntry({
    debounce,
    element: field,
    feel: 'optional',
    id,
    label: 'حداقل',
    step: 'any',
    getValue: getValue('min'),
    setValue: onChange('min'),
    variables,
  });
}

function Max(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  return FeelNumberEntry({
    debounce,
    element: field,
    feel: 'optional',
    id,
    label: 'حداکثر',
    step: 'any',
    getValue: getValue('max'),
    setValue: onChange('max'),
    variables,
  });
}

function ValidationType(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  const setValue = (validationType) => {
    onChange('validationType')(validationType || undefined);
  };

  return SelectEntry({
    debounce,
    element: field,
    getValue: getValue('validationType'),
    id,
    label: 'الگوی اعتبارسنجی',
    setValue,
    getOptions: () => Object.values(VALIDATION_TYPE_OPTIONS),
    tooltip:
      getValue('validationType')() === VALIDATION_TYPE_OPTIONS.phone.value
        ? 'الگوی اعتبارسنجی تلفن بر اساس استاندارد E.164 و بدون فاصله است. مثال: +491234567890'
        : undefined,
  });
}
