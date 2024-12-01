import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Papa from "papaparse";

const BloodPressureTracker = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  const safeParseDate = (dateString) => {
    try {
      const [datePart, timePart] = dateString.split(" ");
      const [year, month, day] = datePart.split("/");
      const [hours, minutes] = timePart.split(":");

      return new Date(year, month - 1, day, hours, minutes);
    } catch (err) {
      console.error("Date parsing error:", err);
      return null;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          try {
            const processedData = results.data
              .filter((row) => row["Measurement Date"])
              .map((row) => {
                const datetime = safeParseDate(row["Measurement Date"]);
                return datetime
                  ? {
                      datetime: datetime,
                      sys: parseInt(row["SYS(mmHg)"], 10),
                      dia: parseInt(row["DIA(mmHg)"], 10),
                      pulse: parseInt(row["Pulse(bpm)"], 10),
                    }
                  : null;
              })
              .filter(Boolean)
              .sort((a, b) => a.datetime - b.datetime);

            setData(processedData);
            setError(null);
            setFileUploaded(true);
          } catch (err) {
            setError("Error processing file: " + err.message);
            setFileUploaded(false);
          }
        },
        error: (err) => {
          setError("Error parsing CSV: " + err.message);
          setFileUploaded(false);
        },
      });
    }
  };

  const calculateStatistics = () => {
    if (data.length === 0) return null;

    const sysPressures = data.map((d) => d.sys);
    const diaPressures = data.map((d) => d.dia);
    const pulseRates = data.map((d) => d.pulse);

    return {
      sys: {
        avg: (sysPressures.reduce((a, b) => a + b, 0) / sysPressures.length).toFixed(1),
        min: Math.min(...sysPressures),
        max: Math.max(...sysPressures),
      },
      dia: {
        avg: (diaPressures.reduce((a, b) => a + b, 0) / diaPressures.length).toFixed(1),
        min: Math.min(...diaPressures),
        max: Math.max(...diaPressures),
      },
      pulse: {
        avg: (pulseRates.reduce((a, b) => a + b, 0) / pulseRates.length).toFixed(1),
        min: Math.min(...pulseRates),
        max: Math.max(...pulseRates),
      },
    };
  };

  const statistics = calculateStatistics();

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="max-w-full md:max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Visualize Blood Pressure Readings</h1>
        </div>
        <div className="p-2 sm:p-4">
          {/* File Upload Area */}
          <div className="mb-6 bg-gray-50 border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {error && <p className="mt-2 text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>}
          </div>

          {/* CSV File Upload Instructions */}
          {!fileUploaded && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h2 className="text-lg font-semibold text-blue-800 mb-2">How to Export CSV from OMRON App</h2>
                  <ol className="list-decimal list-inside text-blue-700 space-y-1">
                    <li>Open OMRON Connect app</li>
                    <li>Select your blood pressure measurement history</li>
                    <li>Look for "Export" measurement data or "Share" option</li>
                    <li>Choose CSV file format</li>
                    <li>Load the file into this app to visualize your blood pressure data</li>
                    <li>
                      Your data remains completely private and never leaves your browser. Download Android APK and app source code:{" "}
                      <a href="https://github.com/vpnry/visualize-blood-pressure" target="_blank" rel="noreferrer">
                        [HERE].
                      </a>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* data graph*/}
          {data.length > 0 && (
            <>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    title: "Systolic Pressure",
                    color: "bg-blue-100 text-blue-800",
                    data: statistics.sys,
                    unit: "mmHg",
                  },
                  {
                    title: "Diastolic Pressure",
                    color: "bg-green-100 text-green-800",
                    data: statistics.dia,
                    unit: "mmHg",
                  },
                  {
                    title: "Pulse",
                    color: "bg-red-100 text-red-800",
                    data: statistics.pulse,
                    unit: "bpm",
                  },
                ].map((section, index) => (
                  <div key={index} className={`p-4 rounded-lg shadow-md ${section.color} transition transform hover:scale-105`}>
                    <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                    <p>
                      Avg: {section.data.avg} {section.unit}
                    </p>
                    <p>
                      Min: {section.data.min} {section.unit}
                    </p>
                    <p>
                      Max: {section.data.max} {section.unit}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="datetime"
                      tickFormatter={(time) => {
                        const date = new Date(time);
                        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
                      }}
                      className="text-xs"
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#f9f9f9", border: "1px solid #ddd" }}
                      labelFormatter={(time) => {
                        const date = new Date(time);
                        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
                      }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="sys" stroke="#3b82f6" activeDot={{ r: 8 }} name="Systolic" />
                    <Line yAxisId="left" type="monotone" dataKey="dia" stroke="#10b981" name="Diastolic" />
                    <Line yAxisId="right" type="monotone" dataKey="pulse" stroke="#ef4444" name="Pulse" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodPressureTracker;
