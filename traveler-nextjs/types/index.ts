export interface NavigationItem {
  label: string;
  href: string;
  isButton?: boolean;
}

export interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
}

export interface PhoneContentData {
  topImage: string;
  locationTag: string;
  heading: string;
  description: string;
  bottomImage: string;
}
