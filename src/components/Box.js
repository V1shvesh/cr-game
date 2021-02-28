import React, { useState, useCallback, useLayoutEffect, useMemo } from 'react';
import { BoxBufferGeometry } from 'three';
import { useSelector, useDispatch } from 'react-redux'

import OrbGroup from './OrbGroup';
import OrbExplosion from './OrbExplosion';
import { resetCell, incrementSphereCount } from '../store/slices/cell';
import { getCellIndex, getCellNeighbours } from '../utils';


export default function Box({size, row, col, ...props}) {
    const boxDimens = Array(3).fill(size);
    const boxGeom = new BoxBufferGeometry(...boxDimens);

    const [isHovered, setHover] = useState(false);
    const [isExploding, setIsExploding] = useState(false);

    const dispatch = useDispatch();

    const sphereCount = useSelector(state => 
        state.cell[getCellIndex(row, col)] ? state.cell[getCellIndex(row, col)].sphereCount : 0
    );
    const neighbours = useMemo(() => getCellNeighbours(row, col), [row, col]);

    useLayoutEffect(() => {
        if(sphereCount >= neighbours.length) {
            dispatch(resetCell({row, col}));
            return setIsExploding(true);
        }
    }, [sphereCount, row, col, dispatch, neighbours])

    const handleClick = useCallback(() => {
        dispatch(incrementSphereCount({row, col}))
    }, [row, col, dispatch])

    const handleOnExplosionEnd = useCallback(() => {
        setIsExploding(false);

        neighbours.forEach((dir) => {
            dispatch(incrementSphereCount({
                row: row + (dir%2)*(dir - 2),
                col: col + (1 - dir%2)*(dir - 1),
            }))
        })
    }, [row, col, dispatch, neighbours])

    return (
        <group
            {...props}
            renderOrder={isHovered ? 10 : 0}
        >
            <mesh
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                onClick={handleClick}
                position={[0, 0, -size/2]}
            >
                <planeBufferGeometry args={[size, size]} />
                <meshStandardMaterial color="blue" opacity={0.1} transparent/>
            </mesh>
            <mesh>
                <lineSegments>
                    <edgesGeometry args={[boxGeom]} />
                    <lineBasicMaterial color={isHovered ? 'green' : 'blue'} />
                </lineSegments>
            </mesh>
            <OrbGroup
                sphereCount={sphereCount}
            />
            {isExploding && (
                <OrbExplosion
                    directions={neighbours}
                    onEnd={handleOnExplosionEnd}
                />
            )}
        </group>
    );
}