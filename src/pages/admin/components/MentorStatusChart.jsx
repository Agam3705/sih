import React, { useRef, useMemo } from 'react';
import { Doughnut, getElementAtEvent } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { mockMentorApplications } from '../mockData';

ChartJS.register(ArcElement, Tooltip, Legend);

const chartOptions = {
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: '#333',
                font: { size: 16 },
                padding: 20,
            }
        },
        tooltip: {
            backgroundColor: 'rgba(40, 40, 40, 0.9)',
            padding: 12,
            displayColors: true,
            boxWidth: 14,
            boxHeight: 14,
            boxPadding: 2,
            
            bodyFont: { // <-- This was the fix for bold tooltip text
                size: 16,
                weight: 'bold',
            },
            bodyColor: 'white',

            callbacks: {
                title: function(context) { return null; },
                label: function(context) { return context.label || ''; },
                labelColor: function(context) {
                    return {
                        borderColor: 'white',
                        borderWidth: 1,
                        backgroundColor: context.dataset.backgroundColor[context.dataIndex],
                        width: 16,
                        height: 20,
                    };
                },
                labelFont: function(context) {
                    return { size: 16, weight: 'bold' };
                }
            }
        }
    },
    maintainAspectRatio: false, // Important: allows us to control the height of the chart via parent
    responsive: true,
    // --- NEW: Add layout padding within the chart canvas ---
    layout: {
        padding: 10 // Give ample internal space for the expanded slice
    }
  };


export default function MentorStatusChart({ mentors = [], onSliceClick }) {
  const chartRef = useRef();

  const chartData = useMemo(() => {
    const statusCounts = { pending: 0, approved: 0, rejected: 0 };
    mentors.forEach(mentor => {
        const status = mentor.status || 'pending';
        if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
        }
    });

    return {
      labels: [
        `Approved (${statusCounts.approved})`, 
        `Pending (${statusCounts.pending})`, 
        `Rejected (${statusCounts.rejected})`
      ],
      datasets: [{
          data: [statusCounts.approved, statusCounts.pending, statusCounts.rejected],
          backgroundColor: ['#14b8a6', '#f97316', '#ef4444'],
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 30, // <-- Increased hoverOffset again for more pronounced lift
      }],
    };
  }, [mentors]);
  
  const handleClick = (event) => {
    const element = getElementAtEvent(chartRef.current, event);
    if (!element.length) return;

    const dataIndex = element[0].index;
    const label = chartData.labels[dataIndex];

    if (label.toLowerCase().includes('approved')) onSliceClick('approved');
    else if (label.toLowerCase().includes('pending')) onSliceClick('pending');
    else if (label.toLowerCase().includes('rejected')) onSliceClick('rejected');
  };

  if (!mentors.length) {
    return <p style={{ textAlign: 'center' }}>No mentor data to display.</p>;
  }

  return (
    // --- NEW: Using aspect-ratio for consistent sizing, generous min-height ---
    <div style={{ width: '120%', aspectRatio: '1 / 1', minHeight: '450px' , margin: '-30px'}}>
      <Doughnut ref={chartRef} data={chartData} options={chartOptions} onClick={handleClick} />
    </div>
  );
}