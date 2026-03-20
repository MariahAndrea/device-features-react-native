export interface TravelEntry {
  id: string;
  title: string;
  image: string;
  address: string;
  desc: string;
  timestamp: number;
  dateText: string;
}

export type RootStackParamList = {
  Home: undefined;
  AddEntry: { editItem?: TravelEntry } | undefined;
};
