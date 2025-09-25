import React, { useMemo, useRef } from 'react';
import { Bar, getElementAtEvent } from 'react-chartjs-2';

const educationStatusColors = {
    "Completed Class 10": 'rgba(54, 162, 235, 0.7)',
    "Completing Class 10 this year": 'rgba(255, 99, 132, 0.7)',
    "Completed Class 12": 'rgba(255, 206, 86, 0.7)',
    "Completing Class 12 this year": 'rgba(75, 192, 192, 0.7)',
    "Pursuing graduation": 'rgba(153, 102, 255, 0.7)',
    "Other": 'rgba(255, 159, 64, 0.7)',
    "Unknown": 'rgba(128, 128, 128, 0.7)'
};

export default function EducationChart({ users, theme, onClick }) {
  const chartRef = useRef();

  const chartData = useMemo(() => {
    const counts = users.reduce((acc, user) => {
      const status = user.quizAnswers["What is your current educational status?"] || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    const labels = Object.keys(counts);
    const dataValues = Object.values(counts);
    const backgroundColors = labels.map(status => educationStatusColors[status] || educationStatusColors["Unknown"]);

    return {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 0,
        borderRadius: 5,
      }],
    };
  }, [users]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // --- NEW: Makes the bar chart horizontal ---
    indexAxis: 'y', 
    plugins: {
      // --- FIX: Legend is now disabled ---
      legend: { 
        display: false,
      },
      title: { 
        display: true, 
        text: 'User Educational Status', 
        color: theme === 'dark' ? '#e0e0e0' : '#212529', 
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 25 }
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      // --- FIX: Display labels on the Y-axis ---
      y: { 
          ticks: { 
            color: theme === 'dark' ? '#a0a0a0' : '#6c757d',
            font: { size: 12 }
          },
          grid: { display: false }
      },
      x: { 
          ticks: { color: theme === 'dark' ? '#a0a0a0' : '#6c757d' }, 
          grid: { color: theme === 'dark' ? '#444' : '#dee2e6' } 
      }
    }
  };
  
  const handleClick = (event) => {
    const element = getElementAtEvent(chartRef.current, event);
    if (element.length > 0) {
      const clickedIndex = element[0].index;
      const clickedLabel = chartData.labels[clickedIndex];
      onClick(clickedLabel);
    }
  };

  return <Bar ref={chartRef} data={chartData} options={chartOptions} onClick={handleClick} />;
}