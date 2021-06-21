import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import Svg, { Circle, G, Path, Rect, Text, Line as SVGLine, PathProps } from 'react-native-svg';
import { View, Animated } from 'react-native';
import { svg } from 'd3';

// 분명히 onLayout과 ref를 넣을 수 있는데 tyepscript가 인식 못함;;
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedLine = Animated.createAnimatedComponent(SVGLine);

const datas = [
  { date: new Date(2007, 3, 22), value: 0, title: '1월' },
  { date: new Date(2007, 3, 23), value: 50.13, title: '2월' },
  { date: new Date(2007, 3, 24), value: 20.24, title: '3월' },
  { date: new Date(2007, 3, 25), value: 32, title: '4월' },
  { date: new Date(2007, 3, 26), value: 20, title: '5월' },
  { date: new Date(2007, 3, 27), value: 32, title: '6월' },
  { date: new Date(2007, 3, 30), value: 30.80, title: '7월' },
  { date: new Date(2007, 4, 1), value: 50, title: '8월' },
  { date: new Date(2007, 4, 1), value: 8, title: '9월' },
  { date: new Date(2007, 4, 1), value: 32.47, title: '10월' },
  { date: new Date(2007, 4, 1), value: 10, title: '11월' },
  { date: new Date(2007, 4, 1), value: 83.1, title: '12월' },
];

const LineChart = () => {
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

  const { marginTop,
    marginRight,
    marginLeft,
    marginBottom, } = { marginTop: 20, marginRight: 50, marginLeft: 20, marginBottom: 50, };

  const fadeOutRectValue = new Animated.Value(svgSize.width - marginRight - marginLeft);
  const fadeOutYTickeValue = new Animated.Value(marginLeft);

  // line Data x scale
  const scaleX = d3
    .scaleBand()
    .domain(datas.map((d) => d.title))
    // x가 올수 있는 범위
    .range([marginLeft, svgSize.width - marginRight]);

  const scaleY = d3
    .scaleLinear()
    // last tick 범위 생각할것, 여기서 최대 범위를 75까지만 주면 75에 꽉 채운 형태로 그래프 생성
    .domain([0, d3.max(datas, (d) => d.value < 100 ? 100 : d.value),])
    // range는 value값이 올 수 있는 최소 최대 범위, domain값이 range값에 맞추어 들어가는 형태 인듯???
    // range [최대, 최소]가 들어가기 때문에 잘 계산할것. [최소, 최대]의 형태로 들어가는 것이 아님.
    .range([svgSize.height - marginBottom, marginTop,])

  const line = d3.line()(datas.map((data, idx) => { return [scaleX(data.title) + scaleX.bandwidth() / 2, scaleY(data.value)] }));

  const yTicks = [];
  // tick 계산하는 Logic 필요
  for (let i = 0; i < 5; i++) {
    yTicks.push(i * 25)
  }

  useEffect(() => {
    // chart fade in 효과 
    Animated.parallel([

      // rect
      Animated.timing(fadeOutRectValue, {
        toValue: 0,
        duration: 1800,
        useNativeDriver: false,
      }),

      // yTick
      Animated.timing(fadeOutYTickeValue, {
        toValue: svgSize.width - marginRight,
        // toValue: marginLeft,
        duration: 1800,
        useNativeDriver: false,
      }),
    ]).start()
  }, [svgSize]);

  return (
    <View
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSvgSize({ width, height });
      }}
      style={{ flex: 1, }}
    >
      <Svg style={{ backgroundColor: 'white', width: '100%', height: '100%', }}>
        {/* yTick */}
        {yTicks.map((tick, idx) => {
          return (
            <G key={idx}>
              <Text
                x={svgSize.width - marginRight + 5}
                y={scaleY(tick) + 4}
                fill='#000'
                textAnchor='start'
                fontSize={11}
              >
                {idx * 25}
              </Text>
              <SVGLine
                x1={marginLeft}
                x2={svgSize.width - marginRight}
                y={scaleY(tick)}
                stroke='purple'
                strokeWidth={1}
              />
            </G>
          );
        })}

        {/* draw line  */}
        <Path
          d={line}
          stroke={'#fe2c54'}
          strokeWidth={3}
        />

        {/* xTick */}
        {datas.map((data, idx) => {
          return (<G key={idx}>
            <SVGLine
              x={scaleX(data.title) + scaleX.bandwidth() / 2}
              y1={scaleY(0)}
              y2={scaleY(-5)}
              stroke='purple'
              strokeWidth={1}
            />
            <Text
              x={scaleX(data.title) + scaleX.bandwidth() / 2}
              y={scaleY(-12)}
              fill='#000'
              textAnchor='middle'
              fontSize={11}
            >
              {data.title}
            </Text>
            {/* circle은 tick은 아니지만 data맵 돌때 일단 같이 처리함 */}
            {/* outerCircle */}
            <Circle
              x={scaleX(data.title) + scaleX.bandwidth() / 2}
              y={scaleY(data.value)}
              r={5}
              cx={0}
              cy={0}
              fill='white'
            />
            {/* inner Circle */}
            <Circle
              x={scaleX(data.title) + scaleX.bandwidth() / 2}
              y={scaleY(data.value)}
              r={3}
              cx={0}
              cy={0}
              fill='#fe2c54'
              onPress={() => { console.log("월 데이터", data) }}
            />
          </G>);
        })}

        {/* fade out line chart */}
        <AnimatedRect
          x={-svgSize.width + marginRight}
          y={-svgSize.height + marginBottom}
          width={fadeOutRectValue}
          height={svgSize.height - marginTop - marginBottom + 10}
          fill='white'
          rotation={180}
        />
        {/* fade out Y Ticks */}
        {yTicks.map((tick, idx) => {
          return (
            <G key={idx}>
              <AnimatedLine
                x1={fadeOutYTickeValue}
                x2={svgSize.width - marginRight}
                y={scaleY(tick)}
                stroke='purple'
                strokeWidth={1}
              />
            </G>
          );
        })}

      </Svg>
    </View>
  );
}


export default LineChart;




// line
// Animated.timing(animatedLineValue, {
//   toValue: 0,
//   duration: 1200,
//   useNativeDriver: false,
// }).start();


// line animation 주는 법
{/* <AnimatedPath
          ref={animatedRef}
          onLayout={() => { setLineLength(animatedRef.current.getTotalLength()) }}
          d={line}
          stroke={'#fe2c54'}
          strokeWidth={4}
          strokeDashoffset={animatedLineValue}
          strokeDasharray={lineLength}
        /> */}