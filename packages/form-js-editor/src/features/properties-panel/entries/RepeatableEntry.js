import { simpleRangeIntegerEntryFactory, simpleBoolEntryFactory } from './factories';

export function RepeatableEntry(props) {
  const { field, getService } = props;

  const { type } = field;

  const formFieldDefinition = getService('formFields').get(type);

  if (!formFieldDefinition || !formFieldDefinition.config.repeatable) {
    return [];
  }

  const entries = [
    simpleRangeIntegerEntryFactory({
      id: 'defaultRepetitions',
      path: ['defaultRepetitions'],
      label: 'تعداد پیش‌فرض موارد',
      min: 1,
      max: 100,
      props,
    }),
    simpleBoolEntryFactory({
      id: 'allowAddRemove',
      path: ['allowAddRemove'],
      label: 'اجازه اضافه کردن/حذف موارد',
      props,
    }),
    simpleBoolEntryFactory({
      id: 'disableCollapse',
      path: ['disableCollapse'],
      label: 'جمع کردن غیرفعال باشد',
      props,
    }),
  ];

  if (!field.disableCollapse) {
    const nonCollapseItemsEntry = simpleRangeIntegerEntryFactory({
      id: 'nonCollapsedItems',
      path: ['nonCollapsedItems'],
      label: 'تعداد اقلام غیرقابل جمع شدن',
      min: 1,
      defaultValue: 5,
      props,
    });

    entries.push(nonCollapseItemsEntry);
  }

  return entries;
}
