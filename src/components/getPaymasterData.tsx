import React, { useEffect, useRef, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function GoogleSheetsDataPage() {
  const {
    siteConfig: {customFields},
  } = useDocusaurusContext();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [fetchedData, setFetchedData] = useState({});
  const cacheExpirationTime = 7 * 24 * 60 * 60; // 7 days in seconds

  useEffect(() => {
    const fetchDataFromGoogleSheet = async () => {
      try {
        const storedData = localStorage.getItem('fetchedData');
        const storedTimestamp = localStorage.getItem('fetchedDataTimestamp');
        
        if (
          storedData &&
          storedTimestamp &&
          Date.now() - Number(storedTimestamp) < cacheExpirationTime * 1000 
        ) {
          setFetchedData(JSON.parse(storedData));    
          setDataLoaded(true);
          return;      
        }

      let fetchedData = {};
      const response = await fetch(
        `https://content-sheets.googleapis.com/v4/spreadsheets/${customFields.PAYMASTER_TOKENS_GOOGLE_SHEET_ID}?includeGridData=true&key=${customFields.GOOGLE_API_KEY}`,
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const sheetsData = data.sheets;
      if (sheetsData.length) {
        sheetsData.forEach((sheet: any) => {
          const sheetTitle = sheet.properties.title;
          fetchedData[sheetTitle] = [];

          if (sheet.data) {
            sheet.data.forEach((data: any) => {
              if (data.rowData && data.rowData.length > 2) {
                const slicedData = data.rowData.slice(2);
                slicedData.forEach((row: any) => {
                  if (row.values) {
                    const rowValues = row.values.slice(0, 3);
                    const formattedRowValues = rowValues.map((cell: any) => {
                      if (cell.userEnteredValue) {
                        return cell.userEnteredValue.stringValue || cell.userEnteredValue.numberValue;
                      } else {
                        return '';
                      }
                    });
                    fetchedData[sheetTitle].push(formattedRowValues);
                  }
                });
              }
            });
          }
        });
      } else {
        console.log('No sheets found.');
      }

      localStorage.setItem('fetchedData', JSON.stringify(fetchedData));
      localStorage.setItem('fetchedDataTimestamp', String(Date.now())); // Convert to string
      setFetchedData(fetchedData);
      setDataLoaded(true);
     
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors gracefully (e.g., display an error message)
    }
    };
    fetchDataFromGoogleSheet();
  }, []);

  return (
    <div>

      {dataLoaded ? (
        Object.keys(fetchedData).map(sheetTitle => (
          <div key={sheetTitle}>
            <h3>{sheetTitle}</h3>
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {fetchedData[sheetTitle].map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}

              </tbody>
            </table>
            <br />
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>

  );
};

