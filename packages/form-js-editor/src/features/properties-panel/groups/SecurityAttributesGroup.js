import { get, set } from 'min-dash';

import { simpleBoolEntryFactory } from '../entries/factories';

import { SECURITY_ATTRIBUTES_DEFINITIONS } from '@bpmn-io/form-js-viewer';

export function SecurityAttributesGroup(field, editField) {
  const { type } = field;

  if (type !== 'iframe') {
    return null;
  }

  const entries = createEntries({ field, editField });

  if (!entries.length) {
    return null;
  }

  return {
    id: 'securityAttributes',
    label: 'ویژگی‌های امنیتی',
    entries,
    tooltip: getTooltip(),
  };
}

function createEntries(props) {
  const { editField, field } = props;

  const securityEntries = SECURITY_ATTRIBUTES_DEFINITIONS.map((definition) => {
    const { label, property } = definition;

    return simpleBoolEntryFactory({
      id: property,
      label: label,
      isDefaultVisible: (field) => field.type === 'iframe',
      path: ['security', property],
      props,
      getValue: () => get(field, ['security', property]),
      setValue: (value) => {
        const security = get(field, ['security'], {});
        editField(field, ['security'], set(security, [property], value));
      },
    });
  });

  return [{ component: Advisory }, ...securityEntries];
}

const Advisory = (props) => {
  return (
    <div class="bio-properties-panel-description fjs-properties-panel-detached-description">
      این گزینه‌ها می‌توانند خطرات امنیتی ایجاد کنند، به خصوص اگر در ترکیب با لینک‌های پویا استفاده شوند. مطمئن شوید که از آنها آگاه هستید، به آدرس اینترنتی منبع اعتماد دارید و فقط مواردی را که مورد استفاده شما هست را فعال می‌کنید.
    </div>
  );
};

// helpers //////////

function getTooltip() {
  return (
    <>
      <p>
        به iframe اجازه دهید به عملکردهای بیشتری از مرورگر شما دسترسی داشته باشد، جزئیات مربوط به گزینه‌های مختلف
        را می‌توانید در{' '}
        <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe" rel="noreferrer">
          مستندات MDN iFrame
        </a>
        بیابید.
      </p>
    </>
  );
}
