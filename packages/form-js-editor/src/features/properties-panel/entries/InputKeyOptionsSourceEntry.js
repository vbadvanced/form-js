import { TextFieldEntry, isTextFieldEntryEdited } from '@vbadvanced/properties-panel';
import { get } from 'min-dash';
import { useService } from '../hooks';
import { OPTIONS_SOURCES, OPTIONS_SOURCES_PATHS } from '@vbadvanced/form-js-viewer';

export function InputKeyOptionsSourceEntry(props) {
  const { editField, field, id } = props;

  return [
    {
      id: id + '-key',
      component: InputValuesKey,
      isEdited: isTextFieldEntryEdited,
      editField,
      field,
    },
  ];
}

function InputValuesKey(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const path = OPTIONS_SOURCES_PATHS[OPTIONS_SOURCES.INPUT];

  const schema = '[\n  {\n    "label": "dollar",\n    "value": "$"\n  }\n]';

  const tooltip = (
    <div>
      ویژگی ورودی ممکن است آرایه‌ای از مقادیر ساده باشد یا از این طرح پیروی کند:
      <pre>
        <code>{schema}</code>
      </pre>
    </div>
  );

  const getValue = () => get(field, path, '');

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, path, value || '');
  };

  return TextFieldEntry({
    debounce,
    description: 'مشخص می کند که از کدام خصوصیت ورودی مقادیر را پر کند',
    tooltip,
    element: field,
    getValue,
    id,
    label: 'کلید مقادیر ورودی',
    setValue,
    validate,
  });
}

// helpers //////////

/**
 * @param {string|void} value
 * @returns {string|null}
 */
const validate = (value) => {
  if (typeof value !== 'string' || value.length === 0) {
    return 'نباید خالی باشد.';
  }

  if (/\s/.test(value)) {
    return 'نباید شامل فاصله (space) باشد.';
  }

  return null;
};
