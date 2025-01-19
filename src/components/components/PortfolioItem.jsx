import React from 'react';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaPython } from 'react-icons/fa';
import { SiTailwindcss, SiVite, SiCplusplus } from 'react-icons/si';
import { FiCode } from 'react-icons/fi'; // Ícono </>

const techIcons = {
  html: <FaHtml5 className="text-orange-500" />,
  css: <FaCss3Alt className="text-blue-500" />,
  javascript: <FaJs className="text-yellow-500" />,
  react: <FaReact className="text-blue-400" />,
  python: <FaPython className="text-green-500" />,
  tailwind: <SiTailwindcss className="text-blue-400" />,
  vite: <SiVite className="text-purple-500" />,
  cplusplus: <SiCplusplus className="text-blue-600" />,
};

function PortfolioItem({ title, imgUrl, stack, description, sourceCodeLink }) {
  return (
    <div className="relative border-2 border-stone-900 dark:border-white rounded-md overflow-hidden group hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className="relative">
        <img
          src={imgUrl}
          alt="portfolio"
          className="w-full h-36 md:h-48 object-cover cursor-pointer transform group-hover:scale-110 transition duration-300 ease-in-out"
        />
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out p-4">
        <p className="text-center text-sm md:text-base">{description}</p>
      </div>

      <div className="w-full p-4 relative">
        <h3 className="text-lg md:text-xl dark:text-white mb-2 md:mb-3 font-semibold">
          {title}
        </h3>
        <div className="flex flex-wrap gap-4 items-center justify-start text-xs md:text-sm">
          {stack.map((item) => (
            <div
              key={item}
              className="flex items-center justify-center w-12 h-12 text-white bg-stone-900 dark:bg-stone-800 rounded-full hover:bg-stone-700 transition duration-300 ease-in-out cursor-pointer"
              title={item}
            >
              <div className="text-2xl">{techIcons[item.toLowerCase()]}</div>
            </div>
          ))}
        </div>

        <a
          href={sourceCodeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 flex items-center justify-center w-10 h-10 text-blue-400 bg-stone-900 dark:bg-stone-800 rounded-full hover:bg-stone-700 transition duration-300 ease-in-out"
          title="Ver código fuente"
        >
          <FiCode className="text-lg" />
        </a>
      </div>
    </div>
  );
}

export default PortfolioItem;
