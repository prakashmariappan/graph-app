import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';


const SortableTable = () => {
  const [tableData, setTableData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'Year', direction: 'asc' });

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

        // Extract relevant columns
        const formattedData = jsonData.map(row => ({
          Title: row['Title'] || '',
          Year: row['Year'] || '',
          LevelOfEvaluation: parseFloat(row['Level of Evaluation']) || 0,
          LevelOfDevelopment: parseFloat(row['Level of Development']) || 0,
          ProgrammingLanguages: row['Programming Language'] || '',
          ToolUsage: parseFloat(row['Tool Usage']) || 0,
        }));

        setTableData(formattedData);
      } catch (error) {
        console.error('Error loading or parsing Excel file:', error);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...tableData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setTableData(sortedData);
  };

  const calculateOpacity = (value, max) => {
    const opacity = (value / max).toFixed(2);
    return Math.max(0.2, opacity); // Ensure a minimum opacity
  };

  const getMaxValue = (key) => {
    return Math.max(...tableData.map(row => row[key] || 0));
  };

  const maxValues = {
    Year: getMaxValue('Year'),
    LevelOfEvaluation: getMaxValue('LevelOfEvaluation'),
    LevelOfDevelopment: getMaxValue('LevelOfDevelopment'),
    ToolUsage: getMaxValue('ToolUsage'),
  };

  return (
    <div className="sortable-table">
      <h2 className="table-heading">Data Table</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th className="table-header header-bg">Title</th>
            <th className="table-header sortable header-bg" onClick={() => handleSort('Year')}>
              Year {sortConfig.key === 'Year' && (sortConfig.direction === 'asc' ? '▼' : '▲')}
            </th>
            <th className="table-header sortable header-bg" onClick={() => handleSort('LevelOfEvaluation')}>
              Level of Evaluation {sortConfig.key === 'LevelOfEvaluation' && (sortConfig.direction === 'asc' ? '▼' : '▲')}
            </th>
            <th className="table-header sortable header-bg" onClick={() => handleSort('LevelOfDevelopment')}>
              Level of Development {sortConfig.key === 'LevelOfDevelopment' && (sortConfig.direction === 'asc' ? '▼' : '▲')}
            </th>
            <th className="table-header header-bg">Programming Languages</th>
            <th className="table-header sortable header-bg" onClick={() => handleSort('ToolUsage')}>
              Tool Usage {sortConfig.key === 'ToolUsage' && (sortConfig.direction === 'asc' ? '▼' : '▲')}
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} className="table-row">
              <td className="table-cell ellipsis" title={row.Title} >{row.Title}</td>
              <td className="table-cell" style={{ backgroundColor: `rgba(173, 216, 230, ${calculateOpacity(row.Year, maxValues.Year)})` }}>{row.Year}</td>
              <td className="table-cell" style={{ backgroundColor: `rgba(144, 238, 144, ${calculateOpacity(row.LevelOfEvaluation, maxValues.LevelOfEvaluation)})` }}>{row.LevelOfEvaluation}</td>
              <td className="table-cell" style={{ backgroundColor: `rgba(255, 182, 193, ${calculateOpacity(row.LevelOfDevelopment, maxValues.LevelOfDevelopment)})` }}>{row.LevelOfDevelopment}</td>
              <td className="table-cell" style={{ backgroundColor: '#D3D3D3' }}>{row.ProgrammingLanguages}</td>
              <td className="table-cell" style={{ backgroundColor: `rgba(255, 160, 122, ${calculateOpacity(row.ToolUsage, maxValues.ToolUsage)})` }}>{row.ToolUsage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;