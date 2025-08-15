import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@vbadvanced/properties-panel';

export function DocumentsDataSourceEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'dataSource',
    component: DocumentsDataSource,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'documentPreview',
  });

  return entries;
}

function DocumentsDataSource(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['dataSource'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  const schema = `[
  {
    "documentId": "u123",
    "endpoint": "https://api.example.com/documents/u123",
    "metadata": {
      "fileName": "Document.pdf",
      "contentType": "application/pdf"
    }
  }
]`;

  const tooltip = (
    <div>
      <p>یک منبع یک شیء JSON است که شامل فراداده برای یک سند یا آرایه‌ای از اسناد است.</p>
      <p>هر ورودی باید شامل شناسه سند، نام و نوع MIME باشد.</p>
      <p>جزئیات بیشتر اختیاری است. قالب مورد انتظار به شرح زیر است:</p>
      <pre>
        <code>{schema}</code>
      </pre>
      <p> هنگام استفاده از رابط کاربری Camunda Tasklist، ویژگی‌های مرجع سند اضافی به طور خودکار مدیریت می‌شوند. تغییر
        مرجع سند ممکن است بر عملکرد پیش‌نمایش سند تأثیر بگذارد.
      </p>
      <p>
        برای کسب اطلاعات بیشتر به{' '}
        <a
          href="https://docs.camunda.io/docs/8.7/components/modeler/forms/form-element-library/forms-element-library-document-preview/"
          target="_blank"
          rel="noopener noreferrer">
          مستندات
        </a>{' '}
        ما مراجعه کنید.
      </p>
    </div>
  );

  return FeelTemplatingEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'مرجع سند',
    feel: 'required',
    singleLine: true,
    setValue,
    variables,
    tooltip,
    validate,
  });
}

// helpers //////////

/**
 * @param {string|undefined} value
 * @returns {string|null}
 */
const validate = (value) => {
  if (typeof value !== 'string' || value.length === 0) {
    return 'مرجع سند الزامی است.';
  }
};
