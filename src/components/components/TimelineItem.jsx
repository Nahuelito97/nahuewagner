import React, { useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { FaCalendarAlt } from 'react-icons/fa';

function TimelineItem({ year, title, duration, details, achievements }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);

  return (
    <>
      <ol className="flex flex-col md:flex-row relative border-l border-stone-200 dark:border-stone-700">
        <li className="mb-10 ml-4">
          <div className="absolute w-3 h-3 bg-stone-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-stone-900 dark:bg-stone-700" />
          <div
            className="p-4 bg-white dark:bg-stone-800 rounded-md shadow-md transition duration-300 ease-in-out cursor-pointer hover:shadow-xl hover:scale-105 hover:bg-stone-100 dark:hover:bg-stone-700"
            onClick={toggleModal}
          >
            <p className="flex flex-wrap gap-4 flex-row items-center justify-start text-xs md:text-sm">
              <span className="inline-block px-2 py-1 font-semibold text-white dark:text-stone-900 bg-stone-900 dark:bg-white rounded-md">
                {year}
              </span>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-white">
                {title}
              </h3>
              <div className="my-1 text-sm font-normal leading-none text-stone-400 dark:text-stone-500">
                {duration}
              </div>
            </p>
            <p className="my-2 text-base font-normal text-stone-500 dark:text-stone-400">
              {details}
            </p>         
          </div>
        </li>
      </ol>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-stone-900 rounded-lg p-6 shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={toggleModal}
                className="flex items-center justify-center w-10 h-10 text-stone-500 bg-stone-200 dark:text-stone-400 dark:bg-stone-800 rounded-full hover:text-stone-900 hover:bg-stone-300 dark:hover:text-white dark:hover:bg-stone-700 transition duration-300 ease-in-out"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center text-stone-500 dark:text-stone-400">
                <FaCalendarAlt className="mr-2" />
                <span>{duration}</span>
              </div>
              <p className="mt-2 text-stone-500 dark:text-stone-400">
                {details}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-stone-900 dark:text-white mb-3">
                Tasks/Achievements:
              </h4>
              <ul className="list-disc ml-5 text-stone-500 dark:text-stone-400">
                {achievements?.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TimelineItem;
