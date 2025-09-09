import { isString, get } from 'min-dash';

import { hasIntegerPathSegment, isProhibitedPath, isValidDotPath } from '../Util';

import { useService } from '../hooks';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useCallback } from 'preact/hooks';

export function KeyEntry(props) {
  const { editField, field, getService } = props;

  const entries = [];

  entries.push({
    id: 'key',
    component: Key,
    editField: editField,
    field: field,
    isEdited: isTextFieldEntryEdited,
    isDefaultVisible: (field) => {
      const formFields = getService('formFields');
      const { config } = formFields.get(field.type);
      return config.keyed;
    },
  });

  return entries;
}

function Key(props) {
  const { editField, field, id } = props;

  const pathRegistry = useService('pathRegistry');

  const debounce = useService('debounce');

  const path = ['key'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    return editField(field, path, value);
  };

  const validate = useCallback(
    (value) => {
      if (value === field.key) {
        return null;
      }

      if (!isString(value) || value.length === 0) {
        return 'نباید خالی باشد.';
      }

      if (!isValidDotPath(value)) {
        return 'باید یک متغیر یا مسیر جدا شده با نقطه از هم باشد.';
      }

      if (hasIntegerPathSegment(value)) {
        return 'نباید شامل بخش‌های عددی باشد.';
      }

      if (isProhibitedPath(value)) {
        return 'نباید مسیر ممنوعه باشد.';
      }

      const replacements = {
        [field.id]: value.split('.'),
      };

      const oldPath = pathRegistry.getValuePath(field);
      const newPath = pathRegistry.getValuePath(field, { replacements });

      // unclaim temporarily to avoid self-conflicts
      pathRegistry.unclaimPath(oldPath);
      const canClaim = pathRegistry.canClaimPath(newPath, { isClosed: true, claimerId: field.id });
      pathRegistry.claimPath(oldPath, { isClosed: true, claimerId: field.id });

      return canClaim ? null : 'نباید با سایر تخصیص‌های کلید/مسیر تداخل داشته باشد.';
    },
    [field, pathRegistry],
  );

  return TextFieldEntry({
    debounce,
    description: 'به یک متغیر فرم متصل می‌شود',
    element: field,
    getValue,
    id,
    label: 'Key',
    tooltip:
      'از یک «کلید» منحصر به فرد برای پیوند دادن عنصر فرم و داده‌های ورودی/خروجی مرتبط استفاده کنید. هنگام کار با داده‌های تو در تو، قبل از استفاده، آن را در نگاشت ورودی User Task تجزیه کنید.',
    setValue,
    validate,
  });
}
