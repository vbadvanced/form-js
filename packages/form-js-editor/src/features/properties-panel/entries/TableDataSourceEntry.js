import { get, isString } from 'min-dash';

import { hasIntegerPathSegment, isValidDotPath } from '../Util';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export function TableDataSourceEntry(props) {
  const { editField, field } = props;

  const entries = [];
  entries.push({
    id: 'dataSource',
    component: Source,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'table',
  });

  return entries;
}

function Source(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['dataSource'];

  const getValue = () => {
    return get(field, path, field.id);
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, path, value);
  };

  return FeelTemplatingEntry({
    debounce,
    description: 'منبعی را که جدول از آن پر می‌شود، مشخص کنید',
    element: field,
    feel: 'required',
    getValue,
    id,
    label: 'منبع داده‌ها',
    tooltip:
      'یک متغیر ورودی فرم وارد کنید که شامل داده‌های جدول باشد یا فرمولی را برای پر کردن پویای داده‌ها تعریف کنید.',
    setValue,
    singleLine: true,
    variables,
    validate,
  });
}

// helper ////////////////

/**
 * @param {string|void} value
 * @returns {string|null}
 */
const validate = (value) => {
  if (!isString(value) || value.length === 0) {
    return 'نباید خالی باشد.';
  }

  if (value.startsWith('=')) {
    return null;
  }

  if (!isValidDotPath(value)) {
    return 'باید یک متغیر یا مسیری باشد که با نقطه از هم جدا شده است.';
  }

  if (hasIntegerPathSegment(value)) {
    return 'نباید شامل بخش‌های مسیر عددی باشد.';
  }

  return null;
};
