export type AssetType = 'stock' | 'etf' | 'crypto' | 'cash';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  quantity: number;
  currentPrice: number;
  buyPrice: number;
  lastUpdated: string;
  currency?: string;
  description?: string;
}

export interface PortfolioState {
  assets: Asset[];
  totalValue: number;
  isLoading: boolean;
  error: string | null;
}

export interface AddAssetFormData {
  symbol: string;
  quantity: string;
  type: AssetType;
  currency?: string;
  description?: string;
  buyPrice: string;
}

export interface PriceData {
  symbol: string;
  price: number;
  lastUpdated: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'consumer' | 'driver';
  isAnonymous?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DriverProfile {
  id: string;
  userId: string;
  vehicleType: 'pickup' | 'truck' | 'van';
  capacity: number; // in m³
  offersHelp: boolean;
  licensePlate: string;
  documents: {
    license: string;
    insurance: string;
    vehicleRegistration: string;
  };
  rating: number;
  totalJobs: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
}

export interface FreightItem {
  type: string;
  quantity: number;
  size?: 'small' | 'medium' | 'large'; // for boxes
  description?: string;
  volume?: number; // in m³
}

export interface FreightRequest {
  id: string;
  consumerId: string;
  title: string;
  description: string;
  origin: Location;
  destination: Location;
  items: FreightItem[];
  totalVolume: number; // in m³
  propertyType: 'house' | 'apartment';
  needsHelp: boolean;
  hasElevator: boolean;
  preferredDate: Date;
  budget?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  id: string;
  requestId: string;
  driverId: string;
  price: number;
  estimatedTime: number; // in minutes
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  requestId: string;
  consumerId: string;
  driverId: string;
  offerId: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  actualPrice?: number;
  rating?: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  jobId: string;
  amount: number;
  method: 'mercadopago' | 'cash' | 'transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  data?: any;
  createdAt: Date;
}

// App State Types
export interface AppState {
  isLoading: boolean;
  error: string | null;
  networkStatus: 'online' | 'offline';
}

export interface FreightState {
  requests: FreightRequest[];
  currentRequest: FreightRequest | null;
  offers: Offer[];
  jobs: Job[];
  filters: {
    dateFilter: string;
    statusFilter: string;
    locationFilter: string;
  };
}

export interface NavigationState {
  currentRoute: string;
  previousRoute: string;
} 