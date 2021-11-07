import React from 'react';
import Box from './Box';
import { useSelector } from 'react-redux';
import { endGameSelector } from '../store/slices/game';

export default function BoxGrid({
    rows = 2,
    columns = 2,
    boxSize = 1,
    ...restProps
}) {
    const isGameEnded = useSelector(state => endGameSelector(state));

    const xOffset = (columns/2) * boxSize - boxSize/2;
    const yOffset = (rows/2) * boxSize - boxSize/2;

    const boxes = Array(rows * columns).fill(0).map((_, idx) => {
        const row = Math.floor(idx / columns);
        const col = idx % columns;

        return !isGameEnded ? (
            <Box
                size={boxSize}
                position={[col * boxSize, - row * boxSize, 0]}
                row={row}
                col={col}
            />
        ) : null;
    })

    return (
        <group
        position={[-xOffset, yOffset, 0]}
            {...restProps}
        >
            {boxes}
        </group>

    );
}