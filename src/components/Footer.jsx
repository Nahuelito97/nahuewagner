import React from 'react';
import SocialLinks from './components/SocialLinks';
function Copyright() {
  return (
    <p className="text-sm mt-2  dark:text-white">
      &copy; {new Date().getFullYear()} Nahuel Wagner. All rights reserved. 🚀
    </p>
  );
}

function Footer() {
  return (
    <div className="py-5 text-center">
      <div className="container max-w-screen-lg mx-auto">
        <SocialLinks />
      </div>
      <Copyright />
    </div>
  );
}

export default Footer;
