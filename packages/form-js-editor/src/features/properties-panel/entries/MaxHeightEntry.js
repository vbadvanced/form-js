import { get } from 'min-dash';

import { useService } from '../hooks';

import { NumberFieldEntry, isNumberFieldEntryEdited } from '@vbadvanced/properties-panel';

export function MaxHeightEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'maxHeight',
    component: MaxHeight,
    editField: editField,
    field: field,
    isEdited: isNumberFieldEntryEdited,
    isDefaultVisible: (field) => field.type === 'documentPreview',
  });

  return entries;
}

function MaxHeight(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const path = ['maxHeight'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return NumberFieldEntry({
    debounce,
    label: 'حداکثر ارتفاع کانتینر پیش‌نمایش',
    element: field,
    id,
    getValue,
    setValue,
    validate,
    description,
  });
}

// helpers //////////

/**
 * @param {string|number|undefined} value
 * @returns {string|null}
 */
const validate = (value) => {
  if (value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'string') {
    return 'مقدار باید یک عدد باشد.';
  }

  if (!Number.isInteger(value)) {
    return 'باید یک عدد صحیح باشد.';
  }

  if (value < 1) {
    return 'باید بزرگتر از صفر باشد.';
  }
};

const description = <>اسنادی که ارتفاع آنها از مقدار تعریف شده بیشتر باشد، قابلیت پیمایش عمودی خواهند داشت.</>;
