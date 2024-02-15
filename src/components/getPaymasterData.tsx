import React, { useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function GoogleSheetsDataPage() {
  const {
    siteConfig: {customFields},
  } = useDocusaurusContext();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [fetchedData, setFetchedData] = useState({});

  useEffect(() => {
    const fetchDataFromGoogleSheet = async () => {
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
          console.log('-----------------');
        });
      } else {
        console.log('No sheets found.');
      }

      setFetchedData(fetchedData);
      console.log('-----------------');
      setDataLoaded(true);
    };
    fetchDataFromGoogleSheet();
  }, []);

  console.log(fetchedData)

  return (
    <div>

      {dataLoaded ? (
        Object.keys(fetchedData).map(sheetTitle => (
          <div key={sheetTitle}>
            <h2>{sheetTitle}</h2>
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

