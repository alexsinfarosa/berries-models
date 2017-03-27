import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
// import _ from "lodash";
import { containsMissingValues } from "../utils";
import { acis } from "../dummyData";
// import { table } from "../views/Results/table";

@inject("store")
@observer
class Testing extends Component {
  containsMissingValues = data => {
    const numOfMissingValues = data.map(day => day[1].find(e => e === "M"));
    console.log(numOfMissingValues);
    if (numOfMissingValues.find(e => e === "M") === "M") {
      return true;
    }
    return false;
  };
  render() {
    console.log(containsMissingValues(acis));
    return <div />;
  }
}

export default Testing;
