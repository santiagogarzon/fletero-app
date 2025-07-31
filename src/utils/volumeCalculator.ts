export interface VolumeEstimate {
  type: string;
  averageVolume: number; // in m³
  minVolume: number;
  maxVolume: number;
}

export const ITEM_VOLUMES: Record<string, VolumeEstimate> = {
  box: {
    type: 'Caja',
    averageVolume: 0.05, // 50L
    minVolume: 0.02, // 20L
    maxVolume: 0.1, // 100L
  },
  fridge: {
    type: 'Heladera',
    averageVolume: 0.5, // 500L
    minVolume: 0.3, // 300L
    maxVolume: 0.8, // 800L
  },
  bed: {
    type: 'Cama',
    averageVolume: 0.3, // 300L
    minVolume: 0.2, // 200L
    maxVolume: 0.5, // 500L
  },
  table: {
    type: 'Mesa',
    averageVolume: 0.15, // 150L
    minVolume: 0.1, // 100L
    maxVolume: 0.25, // 250L
  },
  chair: {
    type: 'Silla',
    averageVolume: 0.05, // 50L
    minVolume: 0.03, // 30L
    maxVolume: 0.08, // 80L
  },
  appliance: {
    type: 'Electrodoméstico',
    averageVolume: 0.2, // 200L
    minVolume: 0.1, // 100L
    maxVolume: 0.4, // 400L
  },
  other: {
    type: 'Otro',
    averageVolume: 0.1, // 100L
    minVolume: 0.05, // 50L
    maxVolume: 0.2, // 200L
  },
};

export const calculateTotalVolume = (items: Array<{ type: string; quantity: number }>): number => {
  return items.reduce((total, item) => {
    const volumeEstimate = ITEM_VOLUMES[item.type];
    if (volumeEstimate) {
      return total + (volumeEstimate.averageVolume * item.quantity);
    }
    return total + (ITEM_VOLUMES.other.averageVolume * item.quantity);
  }, 0);
};

export const getVolumeEstimate = (type: string): VolumeEstimate => {
  return ITEM_VOLUMES[type] || ITEM_VOLUMES.other;
};

export const formatVolume = (volume: number): string => {
  if (volume < 1) {
    return `${(volume * 1000).toFixed(0)}L`;
  }
  return `${volume.toFixed(1)}m³`;
};

export const getItemTypes = () => {
  return Object.entries(ITEM_VOLUMES).map(([key, value]) => ({
    key,
    label: value.type,
    averageVolume: value.averageVolume,
  }));
}; 