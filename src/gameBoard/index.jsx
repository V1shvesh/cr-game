import React, { useContext } from 'react';
import { Provider, ReactReduxContext } from 'react-redux';
import { Canvas } from 'react-three-fiber';
import { PerspectiveCamera } from 'three';
import BoxGrid from './components/BoxGrid';

const GameBoard = () => {
  const { store } = useContext(ReactReduxContext);
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
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <BoxGrid boxSize={20} rows={11} columns={6} />
        {/* <axesHelper args={[500]} /> */}
      </Provider>
    </Canvas>
  );
};

export default GameBoard;
