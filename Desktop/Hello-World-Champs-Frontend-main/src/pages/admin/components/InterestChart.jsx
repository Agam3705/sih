import React, { useMemo, useRef } from 'react';
import { Doughnut, getElementAtEvent } from 'react-chartjs-2';

export default function InterestChart({ users, theme, onClick }) {
  const chartRef = useRef();

  const chartData = useMemo(() => {
    const counts = users.reduce((acc, user) => {
      const interests = user.quizAnswers["Which career fields interest you the most?"] || [];
      if (Array.isArray(interests)) {
        interests.forEach(interest => {
          acc[interest] = (acc[interest] || 0) + 1;
        });
      }
      return acc;
    }, {});

    return {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E57373', '#81C784'],
        borderColor: theme === 'dark' ? '#282828' : '#ffffff',
        borderWidth: 3,
        hoverOffset: 20,
      }],
    };
  }, [users, theme]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right', 
        labels: { 
          color: theme === 'dark' ? '#e0e0e0' : '#212529',
          usePointStyle: true,
          boxWidth: 10,
        } 
      },
      title: { 
        display: true, 
        text: 'Top Career Interests', 
        color: theme === 'dark' ? '#e0e0e0' : '#212529', 
        font: { size: 18, weight: 'bold' },
        padding: {
          bottom: 20
        }
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

  return <Doughnut ref={chartRef} data={chartData} options={chartOptions} onClick={handleClick} />;
}