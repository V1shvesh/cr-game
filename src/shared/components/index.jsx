import * as THREE from 'three';
import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { extend, useLoader } from 'react-three-fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import boldUrl from '../assets/font.blob';

extend({ TextGeometry });

const interpolateAlignment = (align, maxDimension) => {
  if (align === 'center') {
    return -maxDimension / 2;
  }

  if (align === 'right' || align === 'top') {
    return 0;
  }
  return -maxDimension;
};

export default function Text({
  children,
  vAlign = 'center',
  hAlign = 'center',
  fontScale = 1.5,
  color = '#777',
  ...props
}) {
  const font = useLoader(FontLoader, boldUrl);
  const config = useMemo(
    () => ({
      font,
      size: 40,
      height: 30,
      curveSegments: 32,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 8,
    }),
    [font]
  );
  const mesh = useRef();
  useLayoutEffect(() => {
    const size = new THREE.Vector3();
    mesh.current.geometry.computeBoundingBox();
    mesh.current.geometry.boundingBox.getSize(size);
    mesh.current.position.x = interpolateAlignment(hAlign, size.x);
    mesh.current.position.y = interpolateAlignment(vAlign, size.y);
  }, [children]);
  return (
    <group {...props} scale={[0.1 * fontScale, 0.1 * fontScale, 0.1]}>
      <mesh ref={mesh}>
        <textGeometry args={[children, config]} />
        <meshStandardMaterial color={color} emissive={color} />
      </mesh>
    </group>
  );
}
