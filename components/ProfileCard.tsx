
import React from 'react';
import { SocialLinkItem } from '../types';

interface ProfileCardProps {
  name: string;
  imageUrl: string;
  socialLinks: SocialLinkItem[];
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, imageUrl, socialLinks }) => {
  return (
    <div className="bg-custom-light-card dark:bg-custom-dark-card shadow-2xl rounded-xl p-8 md:p-12 text-center animate-fade-in max-w-md w-full mx-auto transition-colors duration-300">
      <img
        src={imageUrl}
        alt={`${name}'s profile`}
        className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-6 border-4 border-accent-light dark:border-accent-dark shadow-lg"
      />
      <h1 className="text-3xl md:text-4xl font-bold text-custom-light-text dark:text-custom-dark-text mb-2">
        {name}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm md:text-base">
        Computer Engineer | .Net Developer | Devops | Cloud
      </p>
      <div className="flex justify-center space-x-5 md:space-x-6">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel}
            className="text-gray-500 dark:text-gray-400 hover:text-accent-light dark:hover:text-accent-dark transition-transform duration-200 hover:scale-110"
          >
            <link.Icon className="w-7 h-7 md:w-8 md:h-8" />
          </a>
        ))}
      </div>
    </div>
  );
};
