import React from 'react';
import socialLinksData from '../data/socialLinksData';

function SocialLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {socialLinksData.map((link, index) => (
        <a
          key={index}
          href={link.href}
          title={link.title}
          className="bg-stone-400 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded-full transition duration-300 ease-in-out transform hover:bg-blue-500 hover:shadow-lg hover:scale-110"
        >
          {link.svg}
        </a>
      ))}
    </div>
  );
}

export default SocialLinks;
