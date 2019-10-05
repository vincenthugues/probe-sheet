import React from 'react';
import C3Chart from 'react-c3js';

export default () => (
  <C3Chart
    style={{ maxWidth: '60%', margin: '40px auto' }}
    data={{
      labels: true,
      padding: { left: 0, right: 0 },
      axis: {
        x: { min: 1, padding: { left: 0 }, tick: { outer: false } },
        y: { min: 0, padding: { bottom: 0 }, tick: { outer: false } },
      },
      columns: [
        ['Semaine', 1, 2, 3, 4, 5, 6],
        ['Cibles retenues', 0, 4, 6, 9, 12, 13],
      ],
      x: 'Semaine',
    }}
  />
);
