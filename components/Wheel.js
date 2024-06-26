import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, Animated, Dimensions, Alert } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Svg, { Path, G, Circle, Image as SvgImage } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import color from 'randomcolor';
import { snap } from '@popmotion/popcorn';
import Icon from 'react-native-vector-icons/FontAwesome5';
import randomColor from 'randomcolor';
import clientLogo from '../assets/images/client_logo.png';
import porteMonnaieImage from '../assets/gifts/porte-monnaie.png';
import sacPoubelleImage from '../assets/gifts/sac-poubelle.png';
import gantsImage from '../assets/gifts/gants.png';
import giletDoudouneImage from '../assets/gifts/gilet-doudoune.png';
import supportPhoneImage from '../assets/gifts/support-phone.png';

const { width } = Dimensions.get('screen');
const wheelSize = width * 0.95;
const fontSize = 16;
const oneTurn = 360;
const knobFill = color({ hue: 'purple' });

const makeWheel = (items) => {
  const validItems = items.filter(item => item.quantity > 0);
  const data = Array.from({ length: validItems.length }).fill(1);
  const arcs = d3Shape.pie()(data);
  const colors = randomColor({
    count: validItems.length,
    luminosity: 'bright',
  });

  return arcs.map((arc, index) => {
    const instance = d3Shape
      .arc()
      .padAngle(0.01)
      .outerRadius(wheelSize / 2)
      .innerRadius(30); // Adjusted to create a central circle

    return {
      path: instance(arc),
      color: colors[index],
      value: validItems[index],
      centroid: instance.centroid(arc)
    };
  });
};

const Wheel = forwardRef(({ items, winner, setWinner, setModalVisible, enabled, setEnabled, setItems }, ref) => {
  const _angle = useRef(new Animated.Value(0)).current;
  const angleRef = useRef(0);
  const wheelPaths = makeWheel(items);
  const numberOfSegments = wheelPaths.length;
  const angleBySegment = oneTurn / numberOfSegments;
  const angleOffset = angleBySegment / 2;

  useEffect(() => {
    _angle.addListener(event => {
      angleRef.current = event.value;
    });
    return () => _angle.removeAllListeners();
  }, [_angle]);

  const _getWinnerIndex = () => {
    const deg = Math.abs(Math.round(angleRef.current % oneTurn));
    const correctedDeg = (oneTurn - deg + angleOffset) % oneTurn;
    const winnerIndex = Math.floor(correctedDeg / angleBySegment);
    return winnerIndex < numberOfSegments ? winnerIndex : winnerIndex % numberOfSegments;
  };

  const _onPan = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END && enabled) {
      const { velocityY } = nativeEvent;

      Animated.decay(_angle, {
        velocity: velocityY / 1000,
        deceleration: 0.999,
        useNativeDriver: true
      }).start(() => {
        _angle.setValue(angleRef.current % oneTurn);
        const snapTo = snap(oneTurn / items.length);
        Animated.timing(_angle, {
          toValue: snapTo(angleRef.current),
          duration: 300,
          useNativeDriver: true
        }).start(() => {
          const winnerIndex = _getWinnerIndex();
          if (winnerIndex < 0 || winnerIndex >= numberOfSegments) {
            Alert.alert('Error', 'Invalid winner index.');
            setEnabled(true);
            return;
          }
          const winnerItem = wheelPaths[winnerIndex].value;
          const itemIndex = items.findIndex(item => item.name === winnerItem.name);

          if (itemIndex !== -1 && items[itemIndex].quantity > 0) {
            setItems(prev => {
              const updatedItems = [...prev];
              updatedItems[itemIndex].quantity -= 1;
              return updatedItems;
            });
            setWinner({ name: winnerItem.name, logo: winnerItem.logo, image: winnerItem.image });
            setModalVisible(true);
            setEnabled(true);
          } else {
            Alert.alert('Désolé, ce cadeau n\'est plus disponible.');
          }
        });
      });
    }
  };

  useImperativeHandle(ref, () => ({
    spinWheel: () => {
      const randomVelocity = Math.random() * 1000 + 500; // Random velocity for spinning the wheel
      Animated.decay(_angle, {
        velocity: randomVelocity / 1000,
        deceleration: 0.999,
        useNativeDriver: true
      }).start(() => {
        _angle.setValue(angleRef.current % oneTurn);
        const snapTo = snap(oneTurn / items.length);
        Animated.timing(_angle, {
          toValue: snapTo(angleRef.current),
          duration: 300,
          useNativeDriver: true
        }).start(() => {
          const winnerIndex = _getWinnerIndex();
          if (winnerIndex < 0 || winnerIndex >= numberOfSegments) {
            Alert.alert('Error', 'Invalid winner index.');
            setEnabled(true);
            return;
          }
          const winnerItem = wheelPaths[winnerIndex].value;
          const itemIndex = items.findIndex(item => item.name === winnerItem.name);

          if (itemIndex !== -1 && items[itemIndex].quantity > 0) {
            setItems(prev => {
              const updatedItems = [...prev];
              updatedItems[itemIndex].quantity -= 1;
              return updatedItems;
            });
            setWinner({ name: winnerItem.name, logo: winnerItem.logo, image: winnerItem.image });
            setModalVisible(true);
            setEnabled(true);
          } else {
            Alert.alert('Désolé, ce cadeau n\'est plus disponible.');
          }
        });
      });
    }
  }));

  const _renderKnob = () => {
    const knobSize = 30;
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(Animated.subtract(_angle, angleOffset), oneTurn),
        new Animated.Value(angleBySegment)
      ),
      1
    );

    return (
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize * 2,
          justifyContent: 'flex-end',
          zIndex: 1,
          transform: [
            {
              rotate: YOLO.interpolate({
                inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                outputRange: ['0deg', '0deg', '35deg', '-35deg', '0deg', '0deg']
              })
            }
          ]
        }}
      >
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 57}
          viewBox="0 0 57 100"
          style={{ transform: [{ translateY: 8 }] }}
        >
          <Path
            d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
            fill={knobFill}
          />
        </Svg>
      </Animated.View>
    );
  };

  const renderWheel = () => {
    return (
      <Svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
        <G y={wheelSize / 2} x={wheelSize / 2}>
          {wheelPaths.map((arc, i) => {
            const [x, y] = arc.centroid;
            let image = null;
            switch (arc.value.logo) {
              case "wallet":
                image = porteMonnaieImage;
                break;
              case "trash":
                image = sacPoubelleImage;
                break;
              case "hand-paper":
                image = gantsImage;
                break;
              case "vest":
                image = giletDoudouneImage;
                break;
              case "mobile-alt":
                image = supportPhoneImage;
                break;
              default:
                image = null;
            }
            return (
              <G key={`arc-${i}`}>
                <Path d={arc.path} fill={arc.color} stroke="white" strokeWidth={2} />
                <G
                  rotation={(i * oneTurn) / wheelPaths.length + angleOffset}
                  origin={`${x}, ${y}`}
                >
                  {image ? (
                    <SvgImage
                      href={image}
                      width={fontSize * 2}
                      height={fontSize * 2}
                      x={x - fontSize}
                      y={y - fontSize}
                    />
                  ) : (
                    <Icon
                      name={arc.value.logo}
                      size={fontSize * 2}
                      color="#fff"
                      style={{
                        position: 'absolute',
                        left: x + (wheelSize / 2) - fontSize,
                        top: y + (wheelSize / 2) - fontSize
                      }}
                    />
                  )}
                </G>
              </G>
            );
          })}
          <Circle cx={0} cy={0} r={30} fill="none" />
          <SvgImage
            href={clientLogo}
            width={60}
            height={60}
            x={-30}
            y={-30}
            preserveAspectRatio="xMidYMid slice"
          />
        </G>
      </Svg>
    );
  };

  return (
    <View style={styles.wheelContainer}>
      {_renderKnob()}
      <PanGestureHandler
        onGestureEvent={Animated.event(
          [{ nativeEvent: { translationY: _angle } }],
          { useNativeDriver: true }
        )}
        onHandlerStateChange={_onPan}
      >
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              {
                rotate: _angle.interpolate({
                  inputRange: [-oneTurn, 0, oneTurn],
                  outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`]
                })
              }
            ]
          }}
        >
          {renderWheel()}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
});

const styles = StyleSheet.create({
  wheelContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default Wheel;