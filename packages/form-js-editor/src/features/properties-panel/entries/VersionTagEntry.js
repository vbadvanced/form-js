import { get } from 'min-dash';

import { useService } from '../hooks';

import { TextFieldEntry, isTextFieldEntryEdited } from '@vbadvanced/properties-panel';

export function VersionTagEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'versionTag',
    component: VersionTag,
    editField: editField,
    field: field,
    isEdited: isTextFieldEntryEdited,
    isDefaultVisible: (field) => field.type === 'default',
  });

  return entries;
}

function VersionTag(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const path = ['versionTag'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    return editField(field, path, value);
  };

  const tooltip = <div>برچسب نسخه‌ای که می‌توان با آن به این فرم ارجاع داد.</div>;

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'برچسب نسخه‌',
    setValue,
    tooltip,
  });
}
