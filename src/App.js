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
import {prettyPrintStat} from './config'

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat: 38, lng: -97})
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')

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
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
        
      });
  };
  console.log(countryInfo);
  return (
    <div className="App">
      <div className="app__left">
        <div className="app__header">
          
          <h1 className="title">COVID-19 Tracker</h1>
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
          isRed 
          active={casesType === 'cases'}
          onClick={(e) => setCasesType('cases')}
            title="Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
          />
          <InfoBox
          active = {casesType === 'recovered'}
          onClick = {(e) => setCasesType('recovered')}
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
          />
          <InfoBox
          isRed
          active = {casesType === 'deaths'}
          onClick = {(e) => setCasesType('deaths')}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
          />
        </div>
        <Map casesType = {casesType}
        center ={mapCenter}
        zoom = {mapZoom}
        countries={mapCountries}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3 className="chartheader">Live Cases by country</h3>
          <Table countries={tableData} />
          <h3 className = "chartheader">Daily New {casesType} Worldwide</h3>
          <LineGraph casesType = {casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
