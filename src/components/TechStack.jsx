import React from 'react';
import skills from '../data/skills';
import TechStackItems from './components/TechStackItems';

function TechStack() {
  return (
    <div id="tech-stack" className="py-12 bg-white dark:bg-stone-900">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-stone-900 dark:text-white mb-8">
        Tech Stack
      </h2>
      {Object.entries(skills).map(([category, techs]) => (
        <div key={category} className="mb-10">
          <h3 className="text-2xl font-semibold text-stone-900 dark:text-white mb-4 capitalize">
            {category}
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {techs.map((tech, index) => (
              <TechStackItems
                key={index}
                name={tech.name}
                icon={tech.icon}
                color={tech.color}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TechStack;
