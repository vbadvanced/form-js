import { NumberFieldEntry, isNumberFieldEntryEdited } from '@vbadvanced/properties-panel';

import { get, isFunction } from 'min-dash';
import { useService } from '../hooks';

export function HeightEntry(props) {
  const { editField, field, id, description, isDefaultVisible, defaultValue } = props;

  const entries = [];

  entries.push({
    id: id + '-height',
    component: Height,
    description,
    isEdited: isNumberFieldEntryEdited,
    editField,
    field,
    defaultValue,
    isDefaultVisible: (field) => {
      if (isFunction(isDefaultVisible)) {
        return isDefaultVisible(field);
      }

      return field.type === 'spacer';
    },
  });

  return entries;
}

function Height(props) {
  const { description, editField, field, id } = props;

  const debounce = useService('debounce');

  const getValue = (e) => get(field, ['height'], null);

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, ['height'], value);
  };

  return NumberFieldEntry({
    debounce,
    description,
    label: 'ارتفاع',
    element: field,
    id,
    getValue,
    setValue,
    validate,
  });
}

// helpers //////////

/**
 * @param {number|void} value
 * @returns {string|null}
 */
const validate = (value) => {
  if (typeof value !== 'number') {
    return 'یک عدد الزامی است.';
  }

  if (!Number.isInteger(value)) {
    return 'باید یک عدد صحیح باشد.';
  }

  if (value < 1) {
    return 'باید بزرگتر از صفر باشد.';
  }
};
