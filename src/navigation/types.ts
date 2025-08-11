export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  FreightRequest: undefined;
  RequestDetails: { requestId: string };
  OfferDetails: { offerId: string };
  JobDetails: { jobId: string };
  LocationPicker: { 
    onLocationSelect: (location: any) => void;
    title: string;
  };
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  RoleSelection: undefined;
  DriverSetup: undefined;
};

export type MainTabParamList = {
  ConsumerNavigator: undefined;
  DriverNavigator: undefined;
};

export type ConsumerTabParamList = {
  Home: undefined;
  MyRequests: undefined;
  History: undefined;
  Profile: undefined;
};

export type DriverTabParamList = {
  Home: undefined;
  AvailableRequests: undefined;
  MyJobs: undefined;
  Earnings: undefined;
  Profile: undefined;
};