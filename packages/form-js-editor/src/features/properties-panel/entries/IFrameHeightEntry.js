import { HeightEntry } from './HeightEntry';

export function IFrameHeightEntry(props) {
  return [
    ...HeightEntry({
      ...props,
      description: 'ارتفاع کانتینر بر حسب پیکسل.',
      isDefaultVisible: (field) => field.type === 'iframe',
    }),
  ];
}
