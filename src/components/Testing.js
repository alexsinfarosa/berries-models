import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
// import _ from "lodash";
import { avgTwoStringNumbers } from "../utils";
import { dummyData } from "../dummyData";
// import { table } from "../views/Results/table";

@inject("store")
@observer
class Testing extends Component {
  replaceNonConsecutiveMissingValues = data => {
    let results = [];
    const dates = data.map(day => day.filter(a => typeof a === "string"));
    const dataWithNoDates = data.map(day =>
      day.filter(day => Array.isArray(day)));
    console.log(dataWithNoDates);

    dataWithNoDates.map(day => {
      day.map(param => {
        param.map((val, i) => {
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

        return param;
      });
    });
  };
  render() {
    console.log(this.replaceNonConsecutiveMissingValues(dummyData));
    return <div />;
  }
}

export default Testing;
