import { PropertiesPanelRenderer } from './PropertiesPanelRenderer';
import { PropertiesProvider } from './PropertiesProvider';

import { FeelPopupModule } from '@vbadvanced/properties-panel';

export const PropertiesPanelModule = {
  __depends__: [FeelPopupModule],
  __init__: ['propertiesPanel', 'propertiesProvider'],
  propertiesPanel: ['type', PropertiesPanelRenderer],
  propertiesProvider: ['type', PropertiesProvider],
};
