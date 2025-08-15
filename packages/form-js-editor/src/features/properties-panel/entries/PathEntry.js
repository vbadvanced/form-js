import { get } from 'min-dash';

import { useService } from '../hooks';

import { TextFieldEntry, isTextFieldEntryEdited } from '@vbadvanced/properties-panel';

import { isProhibitedPath, isValidDotPath, hasIntegerPathSegment } from '../Util';
import { useCallback } from 'preact/hooks';

export function PathEntry(props) {
  const { editField, field, getService } = props;

  const { type } = field;

  const entries = [];

  const formFieldDefinition = getService('formFields').get(type);

  if (formFieldDefinition && formFieldDefinition.config.pathed) {
    entries.push({
      id: 'path',
      component: Path,
      editField: editField,
      field: field,
      isEdited: isTextFieldEntryEdited,
    });
  }

  return entries;
}

function Path(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');
  const pathRegistry = useService('pathRegistry');
  const fieldConfig = useService('formFields').get(field.type).config;
  const isRepeating = fieldConfig.repeatable && field.isRepeating;

  const path = ['path'];

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
      if (!value && isRepeating) {
        return 'نباید خالی باشد';
      }

      // Early return for empty value in non-repeating cases or if the field path hasn't changed
      if ((!value && !isRepeating) || value === field.path) {
        return null;
      }

      // Validate dot-separated path format
      if (!isValidDotPath(value)) {
        const msg = isRepeating
          ? 'باید یک متغیر یا یک مسیر جدا شده با نقطه باشد'
          : 'باید خالی، یک متغیر یا یک مسیر جدا شده با نقطه باشد';
        return msg;
      }

      // Check for integer segments in the path
      if (hasIntegerPathSegment(value)) {
        return 'نباید شامل بخش‌های مسیر عددی باشد.';
      }

      // Check for special prohibited paths
      if (isProhibitedPath(value)) {
        return 'نباید یک مسیر ممنوعه باشد.';
      }

      // Check for path collisions
      const options = {
        replacements: {
          [field.id]: value.split('.'),
        },
      };

      const canClaim = pathRegistry.executeRecursivelyOnFields(field, ({ field, isClosed, isRepeatable }) => {
        const path = pathRegistry.getValuePath(field, options);
        return pathRegistry.canClaimPath(path, { isClosed, isRepeatable, claimerId: field.id });
      });

      if (!canClaim) {
        return 'نباید باعث برخورد دو مسیر اتصال شود';
      }

      // If all checks pass
      return null;
    },
    [field, isRepeating, pathRegistry],
  );

  const tooltip = isRepeating
    ? 'فرزندان این کامپوننت را به یک متغیر فرم هدایت می‌کند، می‌تواند برای مسیریابی در سطح ریشه خالی بماند.'
    : 'فرزندان این کامپوننت را به یک متغیر فرم هدایت می‌کند.';

  return TextFieldEntry({
    debounce,
    description: 'جایی که متغیرهای فرزند این کامپوننت به آن مسیردهی می‌شوند.',
    element: field,
    getValue,
    id,
    label: 'مسیر',
    tooltip,
    setValue,
    validate,
  });
}
