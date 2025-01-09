import React from 'react';

function Intro() {
  return (
    <div
      id="about"
      className="flex items-center justify-center flex-col text-center pt-20 pb-6 min-h-screen"
    >
      {/* 
  <h1 className="text-4xl md:text-7xl dark:text-white mb-1 md:mb-3 font-bold">
    Nahuel
  </h1>
*/}

      <p className="text-base md:text-xl mb-3 font-medium">
        Software Engineer & Web Developer
      </p>
      <p className="text-sm max-w-xl mb-6 font-bold"></p>
      <div className="mx-auto max-w-2xl lg:text-center mb-8">
        Hi! I'm, a full-stack developer with over 2 years of experience in the
        exciting world of web development. My expertise lies in combining both
        frontend and backend skills to build robust, scalable, and user-friendly
        web applications.
        <a
          href="https://github.com/Nahuelito97"
          target="_blank"
          className="text-cyan-600 hover:underline underline-offset-2 decoration-2 decoration-red-600"
          rel="noreferrer noopener"
        >
          Nahuelito97
        </a>
      </div>

      <div className="mx-auto max-w-2xl lg:text-center">
        I am currently an advanced Software Engineering student, which helps me
        stay up-to-date with the latest technologies and industry best
        practices. I firmly believe that software is a powerful tool that can
        enhance organizational efficiency and deliver smoother, more rewarding
        user experiences.
      </div>
    </div>
  );
}

export default Intro;
