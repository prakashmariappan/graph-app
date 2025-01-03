import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import * as XLSX from 'xlsx';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const Highlevelpriciples = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the Excel file from the public folder
        const response = await fetch('./data.xlsx');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Use the first sheet
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Extract and count categories from "High-level Principles" column
        const principlesColumn = jsonData.map(row => row['High-level Principles']).filter(Boolean);
        const categories = principlesColumn.flatMap(principle => principle.split('\n'));
        const categoryCounts = categories.reduce((acc, category) => {
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Prepare data for the radar chart
        const labels = Object.keys(categoryCounts);
        const dataValues = Object.values(categoryCounts);

        setChartData({
          labels,
          datasets: [
            {
              label: 'High-Level Principles Count',
              data: dataValues,
              fill: true,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(54, 162, 235)'
            },
          ],
        });
      } catch (error) {
        console.error('Error loading or parsing Excel file:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    elements: {
      line: {
        borderWidth: 5
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className="radar-chart">
      <h2 className='card-title'>High-Level Principles Radar Charts</h2>
      {chartData ? (
        <Radar data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default Highlevelpriciples;

