import React from 'react'
import {ResponsiveBar} from '@nivo/bar';
import {ResponsiveHeatMap} from '@nivo/heatmap'

export const BarGraph = ({configurations}) => {
  return <ResponsiveBar
    {...configurations}
  />
};

export const HeatMap = ({configurations}) => {
  return <ResponsiveHeatMap
  {...configurations}
  />
};
