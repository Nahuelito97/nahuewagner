import React from 'react';
import timeline from '../data/timeline';
import TimelineItem from './components/TimelineItem';
import Title from './Title';

function Timeline() {
  return (
    <div
      id="timeline"
      className="flex items-center justify-center flex-col min-h-screen py-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-stone-900 dark:text-white">
        Work history
      </h2>
      <div className="w-full md:w-7/12 px-4">
        <Title>Timeline</Title>
        {timeline.map((item) => (
          <TimelineItem
            key={item.year}
            year={item.year}
            title={item.title}
            duration={item.duration}
            details={item.details}
            achievements={item.achievements}
          />
        ))}
      </div>
    </div>
  );
}

export default Timeline;
