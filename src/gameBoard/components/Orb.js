import React, { useRef } from 'react';

function Orb({
    position,
    color,
}) {
    const ref = useRef();

    return (
        <mesh
            ref={ref}
            position={position}
        >
            <sphereBufferGeometry args={[4, 50, 50]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}

export default Orb;