import React from 'react';
import timeline from '../data/timeline';
import TimelineItem from './components/TimelineItem';
import Title from './Title';

function Timeline() {
  return (
    <div 
    id='timeline'
    className="flex items-center justify-center flex-col min-h-screen py-12">
      <div className="w-full md:w-7/12 px-4">
        <Title>Timeline</Title>
        {timeline.map((item) => (
          <TimelineItem
            key={item.year}
            year={item.year}
            title={item.title}
            duration={item.duration}
            details={item.details}
          />
        ))}
      </div>
    </div>
  );
}

export default Timeline;
