export type PlaceLabel = "Home" | "School" | "Work" | "Business" | "Parents' Home" | "Custom";

export interface UserPlace {
  id: string;
  deviceId: string;
  label: PlaceLabel;
  customLabel?: string;
  addressText: string;
  notificationEnabled: boolean;
  createdAt: string;
}
