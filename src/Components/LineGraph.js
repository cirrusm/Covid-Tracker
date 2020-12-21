import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRation: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const LineGraph = ({casesType}) => {
  const [data, setData] = useState({});

  const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          //modifying data to make it so we display new cases and not total cases
          y: data[casesType][date] - lastDataPoint,
        };
        if(newDataPoint.y < 0){
          newDataPoint.y = 0
        }
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
      
    }
    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  return (
    <div className="app__graph">
      {data?.length > 0 && (
      <Line
        options={options}
        data={{
          datasets: [
            {
              backgroundColor: `${casesType === 'recovered' ? 'rgba(0, 255, 50 , 0.9)' : 'rgba(204, 16, 52, 0.5'}`,
              borderColor: `${casesType === 'recovered' ? 'green' : '#CC1034'}`,
              data: data,
            },
          ],
        }}
      />
      )}
    </div>
  );
};

export default LineGraph;
