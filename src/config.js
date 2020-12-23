import { Circle, Popup } from "react-leaflet";
import React from "react";
import numeral from "numeral";

const casesTypeColors = {
  cases: {
    hex: "red",
    multiplier: 300,
  },
  recovered: {
    hex: "green",
    multiplier: 400,
  },
  deaths: {
    hex: "red",
    multiplier: 900,
  },
};

export const sortData = (data) => {
  const sortedData = [...data]; // [...data] just copies out whatever was passed into an array

  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

//Draw circles
export const showDataOnMap = (data, casesType) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className= "info-container">
          <div
          className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className = "info-name">{country.country}</div>
          <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
          <div  className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
          <div  className="info-deaths">Deaths: {numeral(country.deaths).format("0, 0")}</div>
        </div>
      </Popup>
    </Circle>
  ));

  export const prettyPrintStat = (stat) => {
    return stat ? `+${numeral(stat).format("0.0a")}` : "+0"
  }