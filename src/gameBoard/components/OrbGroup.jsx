import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import Orb from './Orb';

function closeness(max, value) {
  return 1 - Math.abs(max - value) / max;
}

function initSpherePositions(sphereCount) {
  return sphereCount < 4
    ? Array(sphereCount)
        .fill(0)
        .map((_, idx) => {
          const theta = (Math.PI / 2) * idx;
          const r = 2.5;
          const spherePos = new THREE.Vector3(
            r * Math.cos(theta),
            r * Math.sin(theta),
            0
          );
          return spherePos;
        })
    : [];
}

function OrbGroup({ sphereCount = 1, color, ...restProps }) {
  const groupRef = useRef();

  useLayoutEffect(() => {
    const { position, rotation } = groupRef.current;

    if (sphereCount >= 4) {
      rotation.x = 0;
      rotation.y = 0;
      position.x = 0;
    }
  }, [sphereCount]);

  const orbs = useMemo(
    () =>
      initSpherePositions(sphereCount).map((spherePos) => (
        <Orb position={spherePos} color={color} key={0} />
      )),
    [sphereCount, color]
  );

  useFrame(({ clock }) => {
    const { position, rotation } = groupRef.current;
    if (sphereCount < 4) {
      position.x = Math.sin(
        20 * clock.elapsedTime * closeness(3 - 1, sphereCount - 1)
      );
      rotation.x = (rotation.y += 0.01 * sphereCount) * 0.8;
    }
  });

  return (
    <group {...restProps} ref={groupRef}>
      {orbs}
    </group>
  );
}

export default OrbGroup;
