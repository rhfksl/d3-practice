import * as d3 from 'd3';
import React, { useState } from 'react';
import Svg, { Circle, G, Path, Rect, Text, Line } from 'react-native-svg';
import styled from 'styled-components/native';
import { View } from 'react-native';


const datas = [
  { value: 2, title: 'A' },
  { value: 20, title: 'B' },
  { value: 45, title: 'C' },
  { value: 60, title: 'D' },
  { value: 55, title: 'E' },
  { value: 100, title: 'F' },
];

const nemoColor = {
  0: '#024898',
  1: '#01abb9',
  2: '#199b56',
  3: '#ffb900',
  4: '#ab0028',
  5: '#ff6582',
  6: '#78a71d',
  7: '#7839d0',
  8: '#fe2c54',
  9: '#8e9398',
};

const BarChart = () => {
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const { marginTop,
    marginRight,
    marginLeft,
    marginBottom, } = { marginTop: 30, marginRight: 38, marginLeft: 10, marginBottom: 30, };


  const xScale = d3
    .scaleBand()
    .domain(datas.map((d) => d.title))
    .padding(0.5)
    .range([0 + marginLeft, svgSize.width - marginRight]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(datas, (d) => d.value < 100 ? 100 : d.value),])
    .range([svgSize.height - marginBottom, marginTop,]);


  // logic 개선 필요
  const yTicks = [0, 25, 50, 75, 100];


  return svgSize.height < 0 ? <></> : (
    <View
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSvgSize({ width, height });
      }}
      style={{ flex: 1, }}
    >
      {svgSize.height > 0 && <Svg style={{ backgroundColor: 'aqua', width: '100%', height: '100%', }}>


        {yTicks.map((tick, idx) => {
          return (
            <G key={idx}>
              <Line
                x1={marginLeft}
                x2={svgSize.width - marginRight}
                y={yScale(tick)}
                stroke='purple'
                strokeWidth={1}
              />
              <Text
                x={svgSize.width - marginRight + 5}
                y={yScale(tick) + 4}
                fill='#000'
                textAnchor='start'
                fontSize={11}
              >
                {idx * 25}
              </Text>
            </G>
          );
        })}

        {/* bar Chart */}
        {datas.map((data, idx) => {
          return (
            <G key={idx}>
              <Text
                x={xScale(data.title) + xScale.bandwidth() / 2}
                y={yScale(data.value) - 4}
                fill='#000'
                textAnchor='middle'
                fontSize={12}
                fontWeight='bold'
              >
                {data.value + ' 억'}
              </Text>
              <Rect
                // border radius
                rx={5}
                x={xScale(data.title)}
                y={yScale(data.value)}
                width={xScale.bandwidth()}
                height={yScale(0) - yScale(data.value)}
                fill={nemoColor[idx]}
              />
              {/* make bottom border radius 0 */}
              {data.value > 0 && <Rect
                x={xScale(data.title)}
                y={yScale(data.value <= 2 ? 1 : 2)}
                height={yScale(0) - yScale(data.value <= 2 ? 1 : 2)}
                width={xScale.bandwidth()}
                fill={nemoColor[idx]}
              />}
            </G>
          )
        })}
      </Svg>}
    </View>
  );
}


export default BarChart;