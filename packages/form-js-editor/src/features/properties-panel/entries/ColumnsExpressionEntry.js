import { get, isString } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@vbadvanced/properties-panel';

const PATH = ['columnsExpression'];

export function ColumnsExpressionEntry(props) {
  const { editField, field } = props;

  const entries = [];
  entries.push({
    id: `${field.id}-columnsExpression`,
    component: ColumnsExpression,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'table' && isString(get(field, PATH)),
  });

  return entries;
}

function ColumnsExpression(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const getValue = () => {
    return get(field, PATH);
  };

  /**
   * @param {string|void} value
   * @param {string|void} error
   * @returns {void}
   */
  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, PATH, value);
  };

  const schema = '[\n  {\n    "key": "column_1",\n    "label": "Column 1"\n  }\n]';

  const tooltip = (
    <div>
      این عبارت می‌تواند منجر به آرایه‌ای از مقادیر ساده شود یا به طور جایگزین از این طرح پیروی کند:
      <pre>
        <code>{schema}</code>
      </pre>
    </div>
  );

  return FeelTemplatingEntry({
    debounce,
    description: 'یک فرمول برای پر کردن آیتم‌های ستون مشخص کنید',
    element: field,
    feel: 'required',
    getValue,
    id,
    label: 'فرمول',
    tooltip,
    setValue,
    singleLine: true,
    variables,
    validate,
  });
}

// helpers //////////

/**
 * @param {string|void} value
 * @returns {string|null}
 */
const validate = (value) => {
  if (!isString(value) || value.length === 0 || value === '=') {
    return 'نباید خالی باشد.';
  }

  return null;
};
