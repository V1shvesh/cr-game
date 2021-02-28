import React, { useRef } from 'react';

function Orb({
    position,
}) {
    const ref = useRef();

    return (
        <mesh
            ref={ref}
            position={position}
        >
            <sphereBufferGeometry args={[4, 50, 50]} />
            <meshStandardMaterial color='blue' />
        </mesh>
    );
}

export default Orb;