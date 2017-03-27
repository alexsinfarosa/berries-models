import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
// import _ from "lodash";
// import { containsMissingValues } from "../utils";
// import { acis, flatData } from "../dummyData";
// import { table } from "../views/Results/table";

@inject("store")
@observer
class Testing extends Component {
  relativeHumidityAdjustment = (station, data) => {
    return data.map(e => {
      return e === "M" ? "M" : Math.round(e / (0.0047 * e + 0.53)).toString();
    });
  };
  render() {
    const { station } = this.props.store.app;
    console.log(
      this.relativeHumidityAdjustment(station, [1, "M", 3, 4, 5, 6, 7])
    );
    return <div />;
  }
}

export default Testing;
