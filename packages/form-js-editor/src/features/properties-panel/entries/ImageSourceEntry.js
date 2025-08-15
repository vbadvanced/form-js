import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@vbadvanced/properties-panel';

export function ImageSourceEntry(props) {
  const { editField, field } = props;

  const entries = [];
  entries.push({
    id: 'source',
    component: Source,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'image',
  });

  return entries;
}

function Source(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['source'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelTemplatingEntry({
    debounce,
    description: 'فرمول یا مقدار ثابت (link/data URI)',
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: 'منبع تصویر',
    tooltip: 'پیوندی که به یک تصویر میزبانی‌شده اشاره می‌کند، یا از یک data URI مستقیماً برای جاسازی داده‌های تصویر در فرم استفاده کنید.',
    setValue,
    singleLine: true,
    variables,
  });
}
