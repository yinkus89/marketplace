import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const Analytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/vendor/analytics')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [{
      label: 'Sales Analytics',
      data: data.map(item => item.sales),
      borderColor: 'rgba(75,192,192,1)',
      fill: false,
    }]
  };

  return (
    <div>
      <h2>Sales Analytics</h2>
      <Line data={chartData} />
    </div>
  );
};

export default Analytics;
