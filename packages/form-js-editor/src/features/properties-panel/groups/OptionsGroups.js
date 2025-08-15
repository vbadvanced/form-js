import {
  OptionsSourceSelectEntry,
  StaticOptionsSourceEntry,
  InputKeyOptionsSourceEntry,
  OptionsExpressionEntry,
} from '../entries';

import { getOptionsSource, OPTIONS_SOURCES } from '@vbadvanced/form-js-viewer';

import { Group, ListGroup } from '@vbadvanced/properties-panel';

import { OPTIONS_INPUTS, hasOptionsGroupsConfigured } from '../Util';

export function OptionsGroups(field, editField, getService) {
  const { type } = field;

  const formFields = getService('formFields');

  const fieldDefinition = formFields.get(type).config;

  if (!OPTIONS_INPUTS.includes(type) && !hasOptionsGroupsConfigured(fieldDefinition)) {
    return [];
  }

  const context = { editField, field };
  const id = 'valuesSource';

  /**
   * @type {Array<Group|ListGroup>}
   */
  const groups = [
    {
      id,
      label: 'منبع گزینه‌ها',
      tooltip: getValuesTooltip(),
      component: Group,
      entries: OptionsSourceSelectEntry({ ...context, id }),
    },
  ];

  const valuesSource = getOptionsSource(field);

  if (valuesSource === OPTIONS_SOURCES.INPUT) {
    const id = 'dynamicOptions';
    groups.push({
      id,
      label: 'گزینه‌های پویا',
      component: Group,
      entries: InputKeyOptionsSourceEntry({ ...context, id }),
    });
  } else if (valuesSource === OPTIONS_SOURCES.STATIC) {
    const id = 'staticOptions';
    groups.push({
      id,
      label: 'گزینه های ثابت',
      component: ListGroup,
      ...StaticOptionsSourceEntry({ ...context, id }),
    });
  } else if (valuesSource === OPTIONS_SOURCES.EXPRESSION) {
    const id = 'optionsExpression';
    groups.push({
      id,
      label: 'فرمول گزینه‌ها',
      component: Group,
      entries: OptionsExpressionEntry({ ...context, id }),
    });
  }

  return groups;
}

// helpers //////////

function getValuesTooltip() {
  return (
    '"ایستا" مجموعه‌ای ثابت و از پیش تعریف‌شده از گزینه‌های فرم را تعریف می‌کند.\n\n' +
    '"داده‌های ورودی" گزینه‌هایی را تعریف می‌کند که به صورت پویا پر می‌شوند و بر اساس داده‌های متغیر برای پاسخ‌های انعطاف‌پذیر به شرایط یا ورودی‌های مختلف تنظیم می‌شوند.\n\n' +
    '"فرمول" گزینه‌هایی را تعریف می‌کند که از یک فرمول FEEL پر می‌شوند.'
  );
}
