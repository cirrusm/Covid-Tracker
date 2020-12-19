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

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
        });
    };
    //Now call the function you just created
    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
  };
  return (
    <div className="App">
      <div className="app__header">
        <h1>Covid Tracker</h1>
        <FormControl>
          <Select variant="outlined" onChange={onCountryChange} value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="app__stats">
        <InfoBox title="Cases" total={2000} cases={1234} />
        <InfoBox title="Recovered" total={3000} cases={1234} />
        <InfoBox title="Deaths" total={4000} cases={1234} />
      </div>
      <Map />

      {/* Table */}
      {/* Graph */}

      {/* Map */}
    </div>
  );
}

export default App;
