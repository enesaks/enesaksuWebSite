
import React from 'react';
import { SocialLinkItem } from './types';
import { GithubIcon } from './components/icons/GithubIcon';
import { LinkedInIcon } from './components/icons/LinkedInIcon';
import { MediumIcon } from './components/icons/MediumIcon';
import { InstagramIcon } from './components/icons/InstagramIcon';

export const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/enesaks',
    Icon: GithubIcon,
    ariaLabel: 'Enes Aksu on GitHub',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/enesaks/',
    Icon: LinkedInIcon,
    ariaLabel: 'Enes Aksu on LinkedIn',
  },
  {
    name: 'Medium',
    url: 'https://medium.com/@enesaks',
    Icon: MediumIcon,
    ariaLabel: 'Enes Aksu on Medium',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/enesaks/', // Corrected URL
    Icon: InstagramIcon,
    ariaLabel: 'Enes Aksu on Instagram',
  },
];
