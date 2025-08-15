import { get } from 'min-dash';

import { INPUTS } from '../Util';

import { ToggleSwitchEntry, isToggleSwitchEntryEdited } from '@vbadvanced/properties-panel';

export function DisabledEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'disabled',
    component: Disabled,
    editField: editField,
    field: field,
    isEdited: isToggleSwitchEntryEdited,
    isDefaultVisible: (field) => INPUTS.includes(field.type),
  });

  return entries;
}

function Disabled(props) {
  const { editField, field, id } = props;

  const path = ['disabled'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return ToggleSwitchEntry({
    element: field,
    getValue,
    id,
    label: 'غیرفعال',
    tooltip:
      'این فیلد را زمانی که نباید برای کاربران نهایی تعاملی باشد، غیرفعال کنید. داده‌های آن ارسال نخواهند شد. این تنظیم بر حالت فقط خواندنی اولویت دارد.',
    inline: true,
    setValue,
  });
}
