import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { acis } from "../dummyData";

@inject("store")
@observer
class Testing extends Component {
  above90 = data => {
    let results = [];

    for (const day of data) {
      let currentDay = [day[0], [], [], [], []];

      for (let [i, e] of day[3].entries()) {
        if (e !== "M") {
          console.log(e);
        }
      }
      results.push(currentDay);
    }
    return results;
  };
  render() {
    console.log(this.above90(acis));
    return <div />;
  }
}

export default Testing;
