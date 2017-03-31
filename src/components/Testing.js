import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { acis } from "../dummyData";
import flatten from "lodash/flatten";

@inject("store")
@observer
class Testing extends Component {
  average = data => {
    if (data.length === 0) {
      return 0;
    }
    let results = data.map(e => parseFloat(e));
    return Math.round(results.reduce((acc, val) => acc + val, 0) / data.length);
  };

  leafWetnessAndTemps = data => {
    // Returns true if leaf wetness values are greater than 0
    const LW = flatten(data.map(day => day[3].map(e => e > 0)));
    // Returns true if relative humidity values are greater than or equal to 90
    const RH = flatten(data.map(day => day[2].map(e => e >= 90)));
    // Returns true if precipitation values are greater than 0
    const PT = flatten(data.map(day => day[4].map(e => e > 0)));

    let params = [LW, RH, PT];
    const transpose = m => m[0].map((x, i) => m.map(x => x[i]));
    // Returns a true values if there is at least one true value in the array
    const transposed = transpose(params).map(e => e.find(e => e === true));

    let filteredLW = [];
    while (transposed.length > 0) {
      filteredLW.push(transposed.splice(0, 24));
    }
    console.log(filteredLW);

    // const wetnessInterval = [];
    // let partial = []
    // for (const [i,e] of flatten(filteredLW).entries()) {
    //   wetnessInterval.push(e)
    //   if (e === true) {
    //     partial.push(e)
    //   }
    //   if (partial.length > 0 && partial.length < 7)
    //
    // }

    const dates = data.map(day => day[0]);

    const temps = filteredLW.map((day, d) => {
      return day.map((e, i) => {
        if (e === true) {
          return data[d][1][i];
        }
        return e;
      });
    });

    let results = [];
    for (const [i, d] of dates.entries()) {
      results.push([d, [...temps[i]], [...filteredLW[i]]]);
    }

    // for (const [i, day] of results.entries()) {
    // const avgT = this.average(day[1].filter(e => e !== undefined));
    // console.log(avgT);
    // }

    return results;
  };

  render() {
    console.log(this.leafWetnessAndTemps(acis));
    return <div />;
  }
}

export default Testing;
