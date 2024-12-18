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

const Associateprinciples = () => {
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

        // Extract and count categories from "Associate Principles" column
        const associateColumn = jsonData.map(row => row['Associate Principles']).filter(Boolean);
        const categories = associateColumn.flatMap(principle => principle.split('\n'));
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
              label: 'Associate Principles Count',
              data: dataValues,
              fill: true,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              pointBackgroundColor: 'rgb(255, 99, 132)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(255, 99, 132)'
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
      <h2 className='card-title'>Associate Principles Radar Chart</h2>
      {chartData ? (
        <Radar data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default Associateprinciples;
