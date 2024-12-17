import React, { useEffect, useState } from 'react';
import { Bar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  elements,
  
} from 'chart.js';
import * as XLSX from 'xlsx';

// Register Chart.js components
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const ScatterChart = () => {
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

        //console.log('Raw Excel Data:', jsonData); // Debug log

        // Filter the data for "Level of Evaluation" and "Level of Development"
        const scatterData = jsonData
          .map(row => {
            const evalValue = parseFloat(row['Level of Evaluation']);
            const devValue = parseFloat(row['Level of Development']);
            //console.log('Eval Value:', evalValue, 'Dev Value:', devValue); // Log the values to verify
            return { evalValue, devValue };
          })
          .filter(({ evalValue, devValue }) =>
            !isNaN(evalValue) && !isNaN(devValue) // Only include valid numeric values
          )
          .map(({ evalValue, devValue }) => ({
            x: evalValue,
            y: devValue,
          }));

        //console.log('Filtered Scatter Data:', scatterData); // Debug log

        if (scatterData.length === 0) {
          console.warn('No valid data points found!');
        }

        // Set the data for the chart
        setChartData({
          datasets: [
            {
              label: 'Evaluation vs Development',
              data: scatterData,
              backgroundColor: `rgba(255, 0, 0, 0.6)`,
              pointRadius: 5,
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
    /*elements: {
      Bar: {
        borderWidth: 10,
      },
    },*/
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Evaluation',
          position: 'bottom',
        },

      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Development',
          position: 'left',
        },
      },
    },
  };

  return (
    <div className="scatter-chart">
      {chartData ? (
        <Scatter data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default ScatterChart;
