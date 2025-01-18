import React, { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Logo, Sections } from './components';

const Navbar = ({ theme, handleThemeSwitch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sun = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );

  const moon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="white"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  );

  return (
    <header>
      <nav className="fixed top-4 left-0 w-full z-10">
        <div className="container mx-auto px-10 flex items-center justify-between">
          <Logo />
          <div className="hidden lg:flex items-center space-x-6">
            <Sections />
            <button
              type="button"
              onClick={handleThemeSwitch}
              className="bg-violet-300 dark:bg-orange-300 text-lg p-2 rounded-md"
            >
              {theme === 'dark' ? sun : moon}
            </button>
          </div>

          <button
            className="lg:hidden p-2.5 rounded-md text-gray-700 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-300 min-h-screen font-inter" />
        <DialogPanel className="fixed inset-y-0 right-0 z-20 w-3/4 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-300 min-h-screen font-inter">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-700 dark:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-6">
            <Sections />
            <button
              type="button"
              onClick={handleThemeSwitch}
              className="bg-violet-300 dark:bg-orange-300 text-lg p-2 rounded-md bg-center"
            >
              {theme === 'dark' ? sun : moon}
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Navbar;
