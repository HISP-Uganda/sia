import React from "react";
import {BarGraph, HeatMap} from "../charts/ResponsiveGraphs";
import {observer} from "mobx-react";

export const DisplayChart = observer(({item, orgUnitChange}) => {
  switch (item.itemType) {
    case 'column':
    case 'bar':
      return <BarGraph configurations={item.configurations}/>;
    case 'heat':
      return <HeatMap configurations={item.configurations}/>;
    default:
      return <div>Under implementation</div>
  }
});
