import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { useEffect, useState } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsChart = ({ data, linkId }) => {
    const [clicksOverTime, setClicksOverTime] = useState([]);
    const [deviceData, setDeviceData] = useState([]);
    const [browserData, setBrowserData] = useState([]);

    useEffect(() => {
        const filtered = data.filter(item => item.linkId === linkId);
        const timeMap = {};
        const deviceMap = {};
        const browserMap = {};

        filtered.forEach(item => {
            const date = new Date(item.timestamp).toLocaleDateString();
            timeMap[date] = (timeMap[date] || 0) + 1;
            deviceMap[item.deviceType] = (deviceMap[item.deviceType] || 0) + 1;
            browserMap[item.browser] = (browserMap[item.browser] || 0) + 1;
        });

        setClicksOverTime(Object.entries(timeMap).map(([date, clicks]) => ({ date, clicks })));
        setDeviceData(Object.entries(deviceMap).map(([name, value]) => ({ name, value })));
        setBrowserData(Object.entries(browserMap).map(([name, value]) => ({ name, value })));
    }, [data, linkId]);

    return (
      <div className="space-y-8">
        <h2 className="text-xl font-semibold">Clicks Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clicksOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -5 }}/>
                  <YAxis allowDecimals={false} label={{ value: 'Clicks', angle: -90, position: 'insideLeft' }}/>
                  <Tooltip />
                  
                  <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
              </LineChart>
          </ResponsiveContainer>

        <h2 className="text-xl font-semibold">Device Type Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                  data={deviceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>

        <h2 className="text-xl font-semibold">Browser Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={browserData}>
                <XAxis dataKey="name" label={{ value: 'Browser', position: 'insideBottom', offset: -5 }}/>
                <YAxis allowDecimals={false} label={{ value: 'Clicks', angle: -90, position: 'insideLeft' }}/>
                <Tooltip />
                
                <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
      </div>
    );
};

export default AnalyticsChart;