import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

const HTTPS_PATTERN = /^(https):\/\/*/i;

export function IFrameUrlEntry(props) {
  const { editField, field } = props;

  const entries = [];
  entries.push({
    id: 'url',
    component: Url,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'iframe',
  });

  return entries;
}

function Url(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['url'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelTemplatingEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: 'آدرس URL',
    setValue,
    singleLine: true,
    tooltip: getTooltip(),
    validate,
    variables,
  });
}

// helper //////////////////////

function getTooltip() {
  return (
    <>
      <p>
        یک آدرس اینترنتی HTTPS به یک منبع وارد کنید یا آن را به صورت پویا از طریق یک الگو یا یک فرمول (مثلاً برای ارسال یک مقدار از متغیر) پر کنید.
      </p>
      <p>لطفاً مطمئن شوید که آدرس اینترنتی ایمن است زیرا ممکن است خطرات امنیتی ایجاد کند.</p>
      <p>
        همه منابع خارجی را نمی‌توان در iFrame نمایش داد. برای اطلاعات بیشتر در مورد آن به{' '}
        <a
          target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options"
          rel="noreferrer">
          مستندات X-FRAME-OPTIONS
        </a>{' '}
        مراجعه کنید.
      </p>
    </>
  );
}

/**
 * @param {string|void} value
 * @returns {string|null}
 */
const validate = (value) => {
  if (!value || value.startsWith('=')) {
    return;
  }

  if (!HTTPS_PATTERN.test(value)) {
    return 'به دلایل امنیتی، آدرس اینترنتی (URL) باید با "https" شروع شود.';
  }
};
