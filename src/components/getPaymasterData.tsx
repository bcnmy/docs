
import 'stream-browserify';
import 'stream-http';
import "https-browserify";
import "querystring-es3";
import "os-browserify/browser";
import "path-browserify";
import "crypto-browserify"
import "browserify-zlib";
import "process/browser"
import {google} from 'googleapis';

const API_KEY= 'AIzaSyC2VUDR-zCiXnQ0CXmI64c_L67CxgZiE9o';
import React, { useEffect, useState } from 'react';
const sheets = google.sheets({ version: 'v4', auth: API_KEY });
console.log(sheets);

export default function GoogleSheetsDataPage() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [fetchedData, setFetchedData] = useState({});
  useEffect(() => {
  const fetchDataFromGoogleSheet = async () => {
    let fetchedData = {};
    
       sheets.spreadsheets.get({
        spreadsheetId: '1V4mZ9fYJ4KJom3NEgdWy6ZEHr7xouh_zB-8ILaKhqHo',
        includeGridData: true,
      }, (err:any, res:any) => {
        const sheetsData = res.data.sheets;
        if (err) return console.log('The API returned an error: ' + err);
        if (sheetsData.length) {
          console.log('Data retrieved:');
        
          sheetsData.forEach((sheet:any) => {
              const sheetTitle = sheet.properties.title;
              console.log('Sheet title:', sheet.properties.title);
              fetchedData[sheetTitle] = [];
          
            console.log('Data:');
            if (sheet.data) {
              sheet.data.forEach((data:any) => {
                if (data.rowData) {
                  data.rowData.forEach((row: any) => {
                    if (row.values) {
                      const rowValues = row.values.slice(0, -1);
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
      });
      setFetchedData(fetchedData);
      setDataLoaded(true);
    };
      fetchDataFromGoogleSheet();
  }, []);
  return (
    <div>
      hi
    </div>
  )
  return (
    <div>
      <h1>Google Sheets Data</h1>
       {dataLoaded  && typeof fetchedData === 'object' && Object.keys(fetchedData).length > 0 ? (
        Object.keys(fetchedData).map(sheetTitle => (
        <div key={sheetTitle}>
          <h2>{sheetTitle}</h2>
          <table>
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column 3</th>
                {/* Add more column headings if needed */}
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
        </div>
      ))
       ) : (
        <p>Loading...</p>
      )}
      </div>
   
  );
};

