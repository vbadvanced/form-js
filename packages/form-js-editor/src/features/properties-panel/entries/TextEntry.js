import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry } from '@vbadvanced/properties-panel';
import { TEXT_VIEW_DEFAULT_TEXT } from '@vbadvanced/form-js-viewer';
import { isEditedFromDefaultFactory } from '../Util';

const isTextEdited = isEditedFromDefaultFactory(TEXT_VIEW_DEFAULT_TEXT, false);

export function TextEntry(props) {
  const { editField, field } = props;

  const entries = [
    {
      id: 'text',
      component: Text,
      editField: editField,
      field: field,
      isEdited: isTextEdited,
      isDefaultVisible: (field) => field.type === 'text',
    },
  ];

  return entries;
}

function Text(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['text'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value || '');
  };

  return FeelTemplatingEntry({
    debounce,
    description,
    element: field,
    getValue,
    id,
    label: 'متن',
    hostLanguage: 'markdown',
    setValue,
    variables,
  });
}

const description = (
  <>
    از markdown و قالب‌بندی پشتیبانی می‌کند.{' '}
    <a
      href="https://docs.camunda.io/docs/components/modeler/forms/form-element-library/forms-element-library-text/"
      target="_blank"
      rel="noreferrer">
      بیشتر بدانید
    </a>
  </>
);
