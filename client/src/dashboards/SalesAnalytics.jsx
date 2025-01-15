import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js";
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register required components for the chart
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesAnalytics = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch the sales data (from an API)
    API.get("/sales")
      .then((response) => {
        setSalesData(response.data);
      })
      .catch((err) => {
        console.error("Error fetching sales data", err);
      });
  }, []);

  const chartData = {
    labels: salesData.map((data) => data.date),
    datasets: [
      {
        label: "Total Sales",
        data: salesData.map((data) => data.totalSales),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Sales: $${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>Sales Analytics</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default SalesAnalytics;
