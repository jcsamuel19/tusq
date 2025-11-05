import type { PhoneContentData } from '@/types';

export const HERO_HEADING_LINES = [
  'Discover the',
  'hidden',
  'Parts of the',
  'world',
] as const;

export const HERO_DESCRIPTION =
  'Lorem ipsum dolor sit amet consectetur, adipisicing elit Lorem ipsum dolor sit amet.';

export const PHONE_CONTENT_DATA: PhoneContentData = {
  topImage: '/assets/images/home/hiking1.jpg',
  locationTag: 'LONDON',
  heading: 'Discover the world',
  description:
    'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  bottomImage: '/assets/images/home/hiking2.jpg',
};

export const PHONE_SCREEN_POSITION = {
  top: '6%',
  left: '7%',
  right: '7%',
  bottom: '6%',
  width: '86%',
  height: '88%',
} as const;
