import React from 'react';
import { useParams, Link } from 'react-router-dom';
import portfolio from '../../data/portfolio';

function ProjectDetails() {
  const { title } = useParams<{ title: string }>();
  const decodedTitle = title ? decodeURIComponent(title) : '';
  const project = portfolio.find((p) => p.title === decodedTitle);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-stone-900">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Proyecto no encontrado
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-stone-900">
      {/* Feature Section */}
      <div className="flex items-center justify-center flex-col text-center pt-20 pb-6 min-h-screen">
        <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl xl:text-5xl sm:tracking-tight">
          Create and share your own examples
        </h1>
        <p className="mt-6 text-lg leading-7 text-black/70 lg:leading-8 lg:text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <div className="mt-8">
          <a href="#" target="_blank" className="block">
            <button
              className="flex content-center transition items-center justify-center text-center px-8 py-4 text-xl font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200"
              style={{ flexShrink: 0 }}
            >
              <div className="flex items-center justify-start space-x-1.5">
                <div className="w-5 h-5 flex items-center justify-center bg-white rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="24"
                    viewBox="0 0 16 24"
                    fill="none"
                    className="w-3 h-3"
                  >
                    <g clipPath="url(#clip0_506:6462)">
                      <path
                        d="M4.00066 24.0001C6.20822 24.0001 7.99986 22.2081 7.99986 20V16H4.00066C1.79311 16 0.00146484 17.792 0.00146484 20C0.00146484 22.2081 1.79311 24.0001 4.00066 24.0001Z"
                        fill="#0ACF83"
                      ></path>
                      <path
                        d="M0.00146484 12C0.00146484 9.79199 1.79311 8 4.00066 8H7.99986V16H4.00066C1.79311 16 0.00146484 14.208 0.00146484 12Z"
                        fill="#A259FF"
                      ></path>
                      <path
                        d="M0.00183105 4C0.00183105 1.792 1.79347 0 4.00103 0H8.00023V8H4.00103C1.79347 8 0.00183105 6.208 0.00183105 4Z"
                        fill="#F24E1E"
                      ></path>
                      <path
                        d="M8.00012 0H11.9993C14.2069 0 15.9986 1.792 15.9986 4C15.9986 6.208 14.2069 8 11.9993 8H8.00012V0Z"
                        fill="#FF7262"
                      ></path>
                      <path
                        d="M15.9986 12C15.9986 14.208 14.2069 16 11.9993 16C9.79177 16 8.00012 14.208 8.00012 12C8.00012 9.79199 9.79177 8 11.9993 8C14.2069 8 15.9986 9.79199 15.9986 12Z"
                        fill="#1ABCFE"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_506:6462">
                        <rect width="16" height="24" fill="white"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <span>Get the plugin</span>
              </div>
            </button>
          </a>
        </div>
        <p className="mt-8 text-sm font-normal text-gray-600">
          100% Free • No credit card required
        </p>
      </div>
      <div className="flex pt-12 px-6 md:px-20 items-center justify-center bg-hero md:h-screen overflow-hidden">
        <div className="flex flex-col gap-6 md:flex-row items-center max-w-7xl mx-auto">
          {/* Texto y botones */}
          <div className="w-full md:w-1/2 lg:pr-32">
            <h2 className="text-4xl lg:text-5xl text-center md:text-left text-blue-900 leading-tight font-medium">
              There’s a better way to talk with your customers.
            </h2>
            <h3 className="mt-6 md:mt-10 text-md lg:text-xl text-center md:text-left text-gray-700 font-light tracking-wider leading-relaxed">
              Help Scout is designed with your customers in mind. Provide email
              and live chat with a personal touch, and deliver help content
              right where your customers need it, all in one place, all for one
              low price.
            </h3>
            <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <button className="w-full sm:w-40 px-4 py-3 rounded font-semibold text-md bg-blue-500 text-white border-2 border-blue-500">
                Get started
              </button>
              <button className="w-full sm:w-40 px-4 py-3 rounded font-semibold text-md bg-white text-blue-500 border-2 border-gray-500">
                Watch a Demo
              </button>
            </div>
          </div>
          {/* Imagen */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img
              src="https://loremflickr.com/g/600/600/girl"
              alt="Demo"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Project Details Section */}
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg mt-10">
        <div className="p-6">
          <Link to="/" className="text-blue-600 hover:underline mt-4 block">
            Volver a los proyectos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
