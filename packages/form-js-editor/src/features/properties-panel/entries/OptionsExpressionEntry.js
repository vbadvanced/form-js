import { FeelEntry, isFeelEntryEdited } from '@vbadvanced/properties-panel';
import { get } from 'min-dash';
import { useService, useVariables } from '../hooks';
import { OPTIONS_SOURCES, OPTIONS_SOURCES_PATHS } from '@vbadvanced/form-js-viewer';

export function OptionsExpressionEntry(props) {
  const { editField, field, id } = props;

  return [
    {
      id: id + '-expression',
      component: OptionsExpression,
      isEdited: isFeelEntryEdited,
      editField,
      field,
    },
  ];
}

function OptionsExpression(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = OPTIONS_SOURCES_PATHS[OPTIONS_SOURCES.EXPRESSION];

  const schema = '[\n  {\n    "label": "dollar",\n    "value": "$"\n  }\n]';

  const tooltip = (
    <div>
      این عبارت می‌تواند منجر به آرایه‌ای از مقادیر ساده شود یا به طور جایگزین از این طرح پیروی کند:
      <pre>
        <code>{schema}</code>
      </pre>
    </div>
  );

  const getValue = () => get(field, path, '');

  const setValue = (value) => editField(field, path, value || '');

  return FeelEntry({
    debounce,
    description: 'یک عبارت برای پر کردن گزینه ها تعریف کنید.',
    tooltip,
    element: field,
    feel: 'required',
    getValue,
    id,
    label: 'فرمول گزینه‌ها',
    setValue,
    variables,
  });
}
