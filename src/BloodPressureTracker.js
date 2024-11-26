import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Papa from "papaparse";

const BloodPressureTracker = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const safeParseDate = (dateString) => {
    try {
      // Split the date string and create a new Date object
      const [datePart, timePart] = dateString.split(" ");
      const [year, month, day] = datePart.split("/");
      const [hours, minutes] = timePart.split(":");

      // Months are 0-indexed in JS Date
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
            // Process and transform the data
            const processedData = results.data
              .filter((row) => row["Measurement Date"]) // Remove empty rows
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
              .filter(Boolean) // Remove any null entries
              .sort((a, b) => a.datetime - b.datetime);

            setData(processedData);
            setError(null);
          } catch (err) {
            setError("Error processing file: " + err.message);
          }
        },
        error: (err) => {
          setError("Error parsing CSV: " + err.message);
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
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {data.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="border p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Systolic Pressure</h3>
              <p>Avg: {statistics.sys.avg} mmHg</p>
              <p>Min: {statistics.sys.min} mmHg</p>
              <p>Max: {statistics.sys.max} mmHg</p>
            </div>
            <div className="border p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Diastolic Pressure</h3>
              <p>Avg: {statistics.dia.avg} mmHg</p>
              <p>Min: {statistics.dia.min} mmHg</p>
              <p>Max: {statistics.dia.max} mmHg</p>
            </div>
            <div className="border p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Pulse</h3>
              <p>Avg: {statistics.pulse.avg} bpm</p>
              <p>Min: {statistics.pulse.min} bpm</p>
              <p>Max: {statistics.pulse.max} bpm</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="datetime"
                tickFormatter={(time) => {
                  const date = new Date(time);
                  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
                }}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                labelFormatter={(time) => {
                  const date = new Date(time);
                  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="sys" stroke="#8884d8" activeDot={{ r: 8 }} name="Systolic" />
              <Line yAxisId="left" type="monotone" dataKey="dia" stroke="#82ca9d" name="Diastolic" />
              <Line yAxisId="right" type="monotone" dataKey="pulse" stroke="#ffc658" name="Pulse" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default BloodPressureTracker;
