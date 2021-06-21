import * as d3 from 'd3';
import React, { useState } from 'react';
import Svg, { Circle, G, Path, Rect, Text } from 'react-native-svg';
import { View } from 'react-native'

const PieChart = () => {
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

  const datas = [
    { "value": 20.9, "name": "10대" },
    { "value": 16.5, "name": "20대" },
    { "value": 15.8, "name": "30대" },
    { "value": 15.5, "name": "40대" },
    { "value": 13.7, "name": "50대" },
    { "value": 11.6, "name": "60대" },
    { "value": 6.0, "name": "70대" },
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

  const pies = d3.pie()(datas.map(data => data.value)).map((item: any, idx) => {
    const arc = d3.arc()
      .outerRadius(50)  // Radius of the pie 
      .innerRadius(100)  // Inner radius: to create a donut or pie
    // .startAngle(item.startAngle + 0.6) // 시작지점 미는 방법 !!! startAngle과 endAngle 값을 밀어주고 싶은 만큼 더해준다
    // .endAngle(item.endAngle + 0.6)
    // .padAngle(.05)    // Angle between sections

    // place text into center
    const center = arc.centroid(item);

    return (
      <React.Fragment key={idx}>
        <Path
          key={idx}
          d={arc(item)}
          fill={idx <= 6 ? nemoColor[idx] : 'red'}
        />
        <Text
          x={center[0]}
          y={center[1]}
          textAnchor='middle'
          fontWeight='bold'
          fontSize='12px'
          fill='white'
        >
          {item.data >= 10 && item.data + '%'}
        </Text>
      </React.Fragment>
    );
  })

  return (
    <View
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSvgSize({ width, height });
      }}
      style={{ flex: 1, }}
    >
      <Svg style={{ backgroundColor: 'pink', width: '100%', height: '100%', }}>
        <G x={svgSize.width / 2} y={svgSize.height / 2}>
          {pies}
        </G>
      </Svg>
    </View>
  );
}


export default PieChart;