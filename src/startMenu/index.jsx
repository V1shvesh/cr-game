import React, { Suspense, useContext, useState } from 'react';
import { Provider, ReactReduxContext, useDispatch } from 'react-redux';
import { Canvas } from 'react-three-fiber';
import { PerspectiveCamera } from 'three';
import OrbGroup from '../gameBoard/components/OrbGroup';
import { PLAYER_COLORS } from '../gameBoard/constants';
import Text from '../shared/components';
import { goToGame } from '../store/slices/startMenu';

const StartMenu = () => {
  const { store } = useContext(ReactReduxContext);
  const [startButtonHovered, setStartButtonHovered] = useState(false);
  const selectedColor = startButtonHovered ? PLAYER_COLORS[2] : '#eeeeee';

  const dispatch = useDispatch();
  return (
    <Canvas
      onCreated={({ gl, setDefaultCamera }) => {
        gl.setClearColor('#333333');
        const camera = new PerspectiveCamera(
          40,
          window.innerWidth / window.innerHeight,
          1,
          1000
        );
        camera.position.z = 400;
        camera.position.x = 20;
        setDefaultCamera(camera);
      }}
    >
      <Provider store={store}>
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={() => null}>
          <Text hAlign="center" position={[20, 50, 0]} fontScale={5}>
            CHAIN REACTION
          </Text>
          <Text
            hAlign="center"
            position={[0, -70, 0]}
            fontScale={1}
            color={selectedColor}
          >
            start
          </Text>
        </Suspense>
        <OrbGroup
          onClick={() => dispatch(goToGame())}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
            setStartButtonHovered(true);
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'initial';
            setStartButtonHovered(false);
          }}
          position={[0, -40, 0]}
          scale={[3, 3, 3]}
          color={selectedColor}
          sphereCount={2}
        />
        {/* <axesHelper args={[500]} />
        <axesHelper args={[-500]} /> */}
      </Provider>
    </Canvas>
  );
};

export default StartMenu;
