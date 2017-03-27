// Returns the average of two numbers.
// Inputs are of type String
export const avgTwoStringNumbers = (a, b) => {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  return Math.round((aNum + bNum) / 2).toString();
};

// It replaces non consecutive values in data with the average
// of the left and the right values
export const replaceNonConsecutiveMissingValues = data => {
  return data.map(day => {
    return day.map(param => {
      if (Array.isArray(param)) {
        return param.map((val, i) => {
          if (i === 0 && val === "M") {
            return param[i + 1];
          } else if (i === param.length - 1 && val === "M") {
            return param[i - 1];
          } else if (
            val === "M" && param[i - 1] !== "M" && param[i + 1] !== "M"
          ) {
            return avgTwoStringNumbers(param[i - 1], param[i + 1]);
          } else {
            return val;
          }
        });
      }
      return param;
    });
  });
};

// Returns acis with replaced consecutive values
export const replaceConsecutiveMissingValues = (sister, acis) => {
  return acis.map((day, d) => {
    return day.map((param, p) => {
      if (Array.isArray(param)) {
        return param.map((e, i) => {
          if (e === "M") {
            return sister[d][p][i];
          } else {
            return e;
          }
        });
      }
      return param;
    });
  });
};

// Returns true if the there are Missing values in the sub arrays (TP, RH, LW, PT)
export const containsMissingValues = data => {
  const TPandRH = data
    .map(day => day[1].filter(e => e === "M").length)
    .reduce((acc, val) => acc + val, 0);

  const LW = data
    .map(day => day[3].filter(e => e === "M").length)
    .reduce((acc, val) => acc + val, 0);

  const PT = data
    .map(day => day[4].filter(e => e === "M").length)
    .reduce((acc, val) => acc + val, 0);

  return (TPandRH && LW && PT) > 0 ? true : false;
};

// Handling Temperature parameter and Michigan network id adjustment
export const networkTemperatureAdjustment = network => {
  // Handling different temperature parameter for each network
  if (network === "newa" || network === "icao" || network === "njwx") {
    return "23";
  } else if (network === "miwx" || network === "cu_log") {
    return "126";
  }
};

// Returns an array similar to ACIS with the rh sub array containing new values.
// The new values are calculated according to the equation below.
export const RHAdjustment = data => {
  let results = [];

  data.forEach(day => {
    let currentDay = [day[0], day[1], []];

    day[2].map((e, i) => {
      let rh;
      if (e !== "M") {
        rh = Math.round(parseFloat(e) / (0.0047 * parseFloat(e) + 0.53));
      } else {
        rh = e;
      }
      currentDay[2].push(rh.toString());
    });
    results.push(currentDay);
  });

  return results;
};

// Handling Relative Humidity Adjustment
export const networkHumidityAdjustment = network =>
  network === "miwx" ? "143" : "24";

// Returns and array of Accumulation Infection Values
export const accumulationInfectionValues = data => {
  const arr = [];
  data.reduce((prev, curr, i) => arr[i] = prev + curr, 0);
  return arr;
};

// Handling Michigan state network adjustment
export const michiganIdAdjustment = station => {
  if (
    station.state === "MI" &&
    station.network === "miwx" &&
    station.id.slice(0, 3) === "ew_"
  ) {
    // example: ew_ITH
    return station.id.slice(3, 6);
  }
  return station.id;
};

// Returns an array similar to ACIS. The rh array contains only values
// above 95. The temp array contains only temperature values where rh was
// above 95.
export const above95Only = data => {
  let results = [];

  data.forEach(day => {
    let currentDay = [day[0], [], []];

    day[2].map((e, i) => {
      if (parseFloat(e) > 95) {
        currentDay[1].push(day[1][i]);
        currentDay[2].push(e);
      }
    });
    if (currentDay[2].length > 0) {
      results.push(currentDay);
    }
  });

  return results;
};

export const relativeHumidityAdjustment = (station, data) => {
  return data.map(e => {
    return e === "M" ? "M" : Math.round(e / (0.0047 * e + 0.53)).toString();
  });
};

// This function will shift data from (1, 24) to (12, 24)
export const noonToNoon = (station, data) => {
  let results = [];

  // get all dates
  const dates = data.map(day => day[0]);

  // shifting Temperature array
  const TP = data.map(day => day[1]);
  const TPFlat = [].concat(...TP);
  let TPShifted = [];
  while (TPFlat.length > 24) {
    TPShifted.push(TPFlat.splice(12, 24));
  }

  // shifting relative humidity array
  const RH = data.map(day => day[2]);
  let RHFlat = [].concat(...RH);
  RHFlat = relativeHumidityAdjustment(station, RHFlat);
  let RHShifted = [];
  while (RHFlat.length > 24) {
    RHShifted.push(RHFlat.splice(12, 24));
  }

  // shifting leaf wetness array
  const LW = data.map(day => day[3]);
  const LWFlat = [].concat(...LW);
  let LWShifted = [];
  while (LWFlat.length > 24) {
    LWShifted.push(LWFlat.splice(12, 24));
  }

  // shifting precipitation array
  const PT = data.map(day => day[4]);
  const PTFlat = [].concat(...PT);
  let PTShifted = [];
  while (PTFlat.length > 24) {
    PTShifted.push(PTFlat.splice(12, 24));
  }

  for (const [i, el] of dates.entries()) {
    results[i] = [el, TPShifted[i], RHShifted[i], LWShifted[i], PTShifted[i]];
  }

  return results;
};

export const IndexStrawberryGreyMold = data => {
  const W = 0;
  const T = 0;

  const index = -4.268 + 0.0294 * W * T - 0.0901 * W - 0.0000235 * (T ^ 3);
};
// Determine Daily Infection Condition Values (DICV) from the table
export const lookUpToTable = (table, hrsRH, avgT) => {
  const temps = table.filter(e => e[hrsRH])[0][hrsRH];
  const hums = temps.filter(e => Object.keys(e)[0] === avgT)[0];
  return hums[avgT];
};

// Returns an array with cumulative Daily Infection Critical Values
export const cumulativeDICV = dicv => {
  const arr = [];
  dicv.reduce((prev, curr, i) => arr[i] = prev + curr, 0);
  return arr;
};

// Returns an array of objects. Each object is a station with the following
// properties: TO DO...
export const matchIconsToStations = (stations, state) => {
  const arr = [];
  const newa = "http://newa.nrcc.cornell.edu/gifs/newa_small.png";
  const newaGray = "http://newa.nrcc.cornell.edu/gifs/newa_smallGray.png";
  const airport = "http://newa.nrcc.cornell.edu/gifs/airport.png";
  const airportGray = "http://newa.nrcc.cornell.edu/gifs/airportGray.png";
  const culog = "http://newa.nrcc.cornell.edu/gifs/culog.png";
  const culogGray = "http://newa.nrcc.cornell.edu/gifs/culogGray.png";

  stations.forEach(station => {
    if (
      station.network === "newa" ||
      station.network === "njwx" ||
      station.network === "miwx" ||
      (station.network === "cu_log" && station.state !== "NY")
    ) {
      const newObj = station;
      station.state === state.postalCode || state.postalCode === "ALL"
        ? (newObj["icon"] = newa)
        : (newObj["icon"] = newaGray);
      arr.push(newObj);
    } else if (station.network === "cu_log") {
      const newObj = station;
      station.state === state.postalCode || state.postalCode === "ALL"
        ? (newObj["icon"] = culog)
        : (newObj["icon"] = culogGray);
      newObj["icon"] = culog;
      arr.push(newObj);
    } else if (station.network === "icao") {
      const newObj = station;
      station.state === state.postalCode || state.postalCode === "ALL"
        ? (newObj["icon"] = airport)
        : (newObj["icon"] = airportGray);
      arr.push(newObj);
    }
  });
  return arr;
};

export const logData = data => {
  // const label = ([raw]) => {
  //   const [color, label, ...message] = raw.split(" ");
  //   return [
  //     `%c${label}%c ${message.join(" ")}`,
  //     `color: white;
  //       background: ${color};
  //       padding: .2em .2em`,
  //     ""
  //   ];
  // };

  return data.map(day => {
    const M = day
      .filter(d => Array.isArray(d))
      .map(e => e.filter(d => d === "M").length);

    console.log(`%c${day[0]}`, `color: red; font-size: 12px`);
    console.log(
      `TP -> %c${M[0]} %c${day[1]}`,
      `color: red;
        font-size: 12px;
        margin-right: 10px;
      `,
      `background: #FFA8A8`
    );
    console.log(
      `RH -> %c${M[1]} %c${day[2]}`,
      `color: red;
        font-size: 12px;
        margin-right: 10px;
      `,
      `background: #D8D8D8`
    );
    console.log(
      `LW -> %c${M[2]} %c${day[3]}`,
      `color: red;
        font-size: 12px;
        margin-right: 10px;
      `,
      `background: #73EBC3`
    );
    console.log(
      `PT -> %c${M[3]} %c${day[4]}`,
      `color: red;
        font-size: 12px;
        margin-right: 10px;
      `,
      `background: #81CCF4`
    );
  });
};
