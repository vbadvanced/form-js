import { simpleSelectEntryFactory } from './factories';

export function LayouterAppearanceEntry(props) {
  const { field } = props;

  if (!['group', 'dynamiclist'].includes(field.type)) {
    return [];
  }

  const entries = [
    simpleSelectEntryFactory({
      id: 'verticalAlignment',
      path: ['verticalAlignment'],
      label: 'تراز عمودی',
      optionsArray: [
        { value: 'start', label: 'بالا' },
        { value: 'center', label: 'وسط' },
        { value: 'end', label: 'پایین' },
      ],
      props,
    }),
  ];

  return entries;
}
