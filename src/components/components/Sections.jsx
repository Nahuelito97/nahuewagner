import React from 'react';



const sections = [
  { name: 'Home', href: '' },
  { name: 'About', href: '#about' },
  { name: 'Work', href: '#work' },
  { name: 'Experience', href: '#timeline' },
  { name: 'Contact', href: '#contact' },
];



const Sections = ({ className = '' }) => (
  <div className={`flex flex-col md:flex-row md:space-x-6 mb-4 ${className}`}>
    <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 text-lg font-medium">
      {sections.map((section) => (
        <li key={section.name}>
          <a
            href={section.href}
            className="hover:underline dark:text-stone-300 text-stone-900"
          >
            {section.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Sections;
