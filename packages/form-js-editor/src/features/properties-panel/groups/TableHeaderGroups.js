import { get, isArray } from 'min-dash';

import { ColumnsExpressionEntry, HeadersSourceSelectEntry, StaticColumnsSourceEntry } from '../entries';

import { Group, ListGroup } from '@vbadvanced/properties-panel';

export function TableHeaderGroups(field, editField) {
  const { type, id: fieldId } = field;

  if (type !== 'table') {
    return [];
  }

  const areStaticColumnsEnabled = isArray(get(field, ['columns']));

  /**
   * @type {Array<Group>}
   */
  const groups = [
    {
      id: `${fieldId}-columnsSource`,
      label: 'منبع ستون‌ها',
      tooltip: TOOLTIP_TEXT,
      component: Group,
      entries: [...HeadersSourceSelectEntry({ field, editField }), ...ColumnsExpressionEntry({ field, editField })],
    },
  ];

  if (areStaticColumnsEnabled) {
    const id = `${fieldId}-columns`;

    groups.push({
      id,
      label: 'سرستون‌ها',
      component: ListGroup,
      ...StaticColumnsSourceEntry({ field, editField, id }),
    });
  }

  return groups;
}

// helpers //////////

const TOOLTIP_TEXT = `«لیست اقلام» مجموعه‌ای ثابت و از پیش تعریف‌شده از گزینه‌های فرم را تعریف می‌کند.

«فرمول» گزینه‌هایی را تعریف می‌کند که از یک فرمول FEEL پر می‌شوند.
`;
