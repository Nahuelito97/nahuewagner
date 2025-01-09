import React from 'react';

const Sections = () => (
  <div className="flex items-center space-x-6">
    <ul className="flex space-x-6 text-lg font-medium">
      <li>
        <a
          href=""
          className="hover:underline dark:text-stone-300 text-stone-900"
        >
          Home
        </a>
      </li>
      <li>
        <a
          href="#about"
          className="hover:underline dark:text-stone-300 text-stone-900"
        >
          About
        </a>
      </li>
      <li>
        <a
          href="#work"
          className="hover:underline dark:text-stone-300 text-stone-900"
        >
          Work
        </a>
      </li>
      <li>
        <a
          href="#timeline"
          className="hover:underline dark:text-stone-300 text-stone-900"
        >
          Experience
        </a>
      </li>
      <li>
        <a
          href="#contact"
          className="hover:underline dark:text-stone-300 text-stone-900"
        >
          Contact
        </a>
      </li>
    </ul>
  </div>
);

export default Sections;
