import React, { useMemo, useState } from 'react';
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import Orb from './Orb';

function initSpherePositions(directions) {
  return directions.map((dir) => {
    const theta = (Math.PI / 2) * dir;
    const r = 20;
    const spherePos = new THREE.Vector3(
      r * -Math.cos(theta),
      r * Math.sin(theta),
      0
    );
    return spherePos;
  });
}

function OrbExplosion({ color, directions, onEnd, ...restProps }) {
  const [scaleFactor, setScaleFactor] = useState(0);

  const spherePositions = useMemo(
    () => initSpherePositions(directions),
    [directions]
  );

  const orbs = spherePositions.map((spherePos) => {
    const scaledSpherePos = spherePos.clone().multiplyScalar(scaleFactor);
    return <Orb key={0} color={color} position={scaledSpherePos} />;
  });

  useFrame(() => {
    if (scaleFactor >= 1) {
      onEnd();
    }
    setScaleFactor(scaleFactor + 0.05);
  });

  return <group {...restProps}>{orbs}</group>;
}

export default OrbExplosion;
