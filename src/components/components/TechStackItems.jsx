import React from 'react';

function TechStackItems({ name, icon: Icon, color }) {
  return (
    <div className="flex flex-col items-center text-center space-y-2 group">
      <div
        className={`p-4 bg-white dark:bg-stone-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out`}
      >
        <Icon style={{ color: color }} className="text-4xl" />
      </div>
      <span className="text-sm font-medium text-stone-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-teal-400">
        {name}
      </span>
    </div>
  );
}

export default TechStackItems;
