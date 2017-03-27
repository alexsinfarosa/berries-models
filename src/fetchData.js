import axios from "axios";
import format from "date-fns/format";
import addDays from "date-fns/add_days";
import {
  michiganIdAdjustment,
  networkTemperatureAdjustment,
  networkHumidityAdjustment // logData
} from "./utils";

// Fetch acis data -------------------------------------------------------------------------
export const fetchACISData = (station, startDate, endDate) => {
  const params = {
    sid: `${michiganIdAdjustment(station)} ${station.network}`,
    sdate: startDate,
    // Plus 6 days because we account for the noonToNoon function
    edate: format(addDays(endDate, 6), "YYYY-MM-DD"),
    elems: [
      // temperature
      networkTemperatureAdjustment(station.network),
      // relative humidity
      networkHumidityAdjustment(station.network),
      // leaf wetness
      "118",
      // precipitation
      "5"
    ]
  };

  console.log(params);

  return axios
    .post("http://data.test.rcc-acis.org/StnData", params)
    .then(res => {
      if (!res.data.hasOwnProperty("error")) {
        console.log(res.data.data.slice(0, 3));
        return res.data.data;
      }
      console.log(res.data.error);
    })
    .catch(err => {
      console.log(err);
    });
};

// Get sister station Id and network --------------------------------------------------------
export const getSisterStationIdAndNetwork = station => {
  return axios(
    `https://newa2.nrcc.cornell.edu/newaUtil/stationSisterInfo/${station.id}/${station.network}`
  )
    .then(res => {
      return res.data.temp;
    })
    .catch(err => {
      console.log(err);
    });
};

// Fetch sister station data --------------------------------------------------------------
export const fetchSisterStationData = (
  idAndNetwork,
  station,
  startDate,
  endDate,
  currentYear,
  startDateYear
) => {
  const [id, network] = idAndNetwork.split(" ");

  const params = {
    sid: `${id} ${network}`,
    sdate: startDate,
    edate: format(addDays(endDate, 6), "YYYY-MM-DD"),
    elems: [
      // temperature
      networkTemperatureAdjustment(station.network),
      // relative humidity
      networkHumidityAdjustment(station.network),
      // leaf wetness
      "118",
      // precipitation
      "5"
    ]
  };

  // console.log(params);

  return axios
    .post("http://data.test.rcc-acis.org/StnData", params)
    .then(res => {
      if (!res.data.hasOwnProperty("error")) {
        return res.data.data;
      }
      console.log(res.data.error);
    })
    .catch(err => {
      console.log(err);
    });
};

// Fetch forecast temperature ---------------------------------------------------------------
export const fetchForecastTemps = (station, startDate, endDate) => {
  return axios
    .get(
      `https://newa2.nrcc.cornell.edu/newaUtil/getFcstData/${station.id}/${station.network}/temp/${startDate}/${format(addDays(endDate, 6), "YYYY-MM-DD")}`
    )
    .then(res => {
      if (!res.data.hasOwnProperty("error")) {
        return res.data.data;
      }
      console.log(res.data.error);
    })
    .catch(err => {
      console.log(err);
    });
};

// Fetch forecast relative humidity ---------------------------------------------------------
export const fetchForecastRH = (station, startDate, endDate) => {
  return axios
    .get(
      `https://newa2.nrcc.cornell.edu/newaUtil/getFcstData/${station.id}/${station.network}/rhum/${startDate}/${format(addDays(endDate, 6), "YYYY-MM-DD")}`
    )
    .then(res => {
      if (!res.data.hasOwnProperty("error")) {
        return res.data.data;
      }
      console.log(res.data.error);
    })
    .catch(err => {
      console.log(err);
    });
};

// Fetch forecast relative humidity ---------------------------------------------------------
export const fetchPrecipitation = (station, startDate, endDate) => {
  return axios
    .get(
      `https://newa2.nrcc.cornell.edu/newaUtil/getFcstData/${station.id}/${station.network}/qpf/${startDate}/${format(addDays(endDate, 6), "YYYY-MM-DD")}`
    )
    .then(res => {
      if (!res.data.hasOwnProperty("error")) {
        return res.data.data;
      }
      console.log(res.data.error);
    })
    .catch(err => {
      console.log(err);
    });
};

// Fetch forecast data ----------------------------------------------------------------------
export const fetchForecastData = (station, startDate, endDate) => {
  return axios
    .all([
      fetchForecastTemps(station, startDate, endDate),
      fetchForecastRH(station, startDate, endDate),
      fetchPrecipitation(station, startDate, endDate)
    ])
    .then(res => {
      const dates = res[0].map(day => day[0]);
      const TP = res[0].map(day => day[1]);
      const RH = res[1].map(day => day[1]);
      const PT = res[2].map(day => day[1]);
      let results = [];
      dates.map((day, i) => {
        results.push([dates[i], TP[i], RH[i], PT[i]]);
      });
      return results;
    })
    .catch(err => {
      console.log(err);
    });
};
