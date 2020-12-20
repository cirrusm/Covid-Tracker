import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import InfoBox from "./Components/InfoBox";
import Map from "./Components/Map";
import Table from './Components/Table'
import {sortData} from './config'
import LineGraph from './Components/LineGraph'
import "leaflet/dist/leaflet.css"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat: 41, lng: 20})
  const [mapZoom, setMapZoom] = useState(4)
  const [mapCountries, setMapCountries] = useState([])

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data)
          setTableData(sortedData);
          setMapCountries(data)
          setCountries(countries);
        });
    };
    //Now call the function you just created
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter({lat : data.countryInfo.lat, lng: data.countryInfo.long})
        setMapZoom(2)
        
      });
  };
  console.log(countryInfo);
  return (
    <div className="App">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid Tracker</h1>
          <FormControl>
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            title="Cases"
            total={countryInfo.cases}
            cases={countryInfo.todayCases}
          />
          <InfoBox
            title="Recovered"
            total={countryInfo.recovered}
            cases={countryInfo.todayRecovered}
          />
          <InfoBox
            title="Deaths"
            total={countryInfo.deaths}
            cases={countryInfo.todayDeaths}
          />
        </div>
        <Map center ={mapCenter}
        zoom = {mapZoom}
        countries={mapCountries}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by country</h3>
          <Table countries={tableData} />
          <h3>worldwide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
