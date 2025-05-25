
import React from 'react';

export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <title>Sun icon</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25c0 1.33.53 2.512 1.383 3.364A4.5 4.5 0 0012 16.5a4.5 4.5 0 004.5-4.5c0-.74-.173-1.433-.487-2.067A4.484 4.484 0 0012 9.75a2.25 2.25 0 00-2.25 2.25z"
    />
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v.01M12 21v-.01M4.22 4.22l.01.01M19.78 19.78l.01.01M3 12h.01M21 12h-.01M4.22 19.78l.01-.01M19.78 4.22l.01.01M12 6a6 6 0 100 12 6 6 0 000-12z" />
  </svg>
);
