// This function will shift data from (1, 24) to (12, 24)
// Returns and array of objects where eache object has the following
// properties:
// {date: '2016-01-01', hr: ['34','44'...], temp: ['67','45'...], hrsRH: 3, avgT: 67}
export const noonToNoon = (station, data) => {
  // get all dates
  const dates = data.map(day => day[0]);

  // relative humidity
  const hum = data.map(day => day[2]);
  const humFlat = [].concat(...hum);
  let humFlatNum = humFlat.map(e => parseInt(e, 10));
  // console.log(`${humFlatNum}`);
  if (station.network === "icao") {
    humFlatNum = humFlatNum.map(e => {
      if (e === "M") {
        return "M";
      } else {
        return Math.round(e / (0.0047 * e + 0.53));
      }
    });
  }
  // console.log(`${humFlatNum}`);

  // Filter relative humidity values above the chosen percentage
  // If there are NaN values it replaces with 0
  const humFlatNumAbove95RH = humFlatNum.map(e => e > 95 ? e : 0);

  // unflatten RH array
  const humNumAbove95RH = [];
  const humFlatNumAbove95RHCopy = [...humFlatNumAbove95RH];
  while (humFlatNumAbove95RHCopy.length > 24) {
    humNumAbove95RH.push(humFlatNumAbove95RHCopy.splice(12, 24));
  }

  // determine the amount of hours with a relative humidity above the chosen percentage
  const RHCount = humNumAbove95RH.map(day => day.filter(e => e > 0).length);

  // hourly temperatures
  const temp = data.map(day => day[1]);
  const tempFlat = [].concat(...temp);
  const tempFlatNum = tempFlat.map(e => parseInt(e, 10));

  // filter hourly temperature vlues above the chosen percentage
  const tempFlatNumAbove95RH = humFlatNumAbove95RH.map(
    (e, i) => e === 0 ? 0 : tempFlatNum[i]
  );

  // unflatten the temperature array
  const tempNumAbove95RH = [];
  while (tempFlatNumAbove95RH.length > 24) {
    tempNumAbove95RH.push(tempFlatNumAbove95RH.splice(12, 24));
  }

  // calculating average temperature
  const avgT = tempNumAbove95RH.map(day => {
    const aboveVal = day.filter(e => e > 0);
    if (aboveVal.length > 0) {
      return Math.round(
        aboveVal.reduce((acc, val) => acc + val, 0) / aboveVal.length
      );
    }
    return 0;
  });

  // relative humidity (HR) array
  const hArr = [];
  while (humFlatNum.length > 24) {
    hArr.push(humFlatNum.splice(12, 24));
  }

  // temperature array
  const tArr = [];
  while (tempFlatNum.length > 24) {
    tArr.push(tempFlatNum.splice(12, 24));
  }

  let res = [];
  tArr.forEach((temps, i) => {
    res.push({
      date: dates[i],
      rh: hArr[i],
      temp: temps,
      hrsRH: RHCount[i],
      avgT: avgT[i]
    });
  });
  return res;
};
