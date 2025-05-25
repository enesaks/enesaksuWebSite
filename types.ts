
import React from 'react';

export interface SocialLinkItem {
  name: string;
  url: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  ariaLabel: string;
}
