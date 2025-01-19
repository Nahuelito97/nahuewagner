import React from 'react';
import portfolio from '../data/portfolio';
import PortfolioItem from './components/PortfolioItem';

function Portfolio() {
  return (
    <div
      id="work"
      className="flex items-center justify-center flex-col min-h-screen py-12 w-full"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-stone-900 dark:text-white">
        Projects
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4">
        {portfolio.map((project) => (
          <PortfolioItem
            key={project.title}
            imgUrl={project.imgUrl}
            title={project.title}
            stack={project.stack}
            link={project.link}
            description={project.description}
            sourceCodeLink={project.sourceCodeLink}
          />
        ))}
      </div>
    </div>
  );
}

export default Portfolio;
