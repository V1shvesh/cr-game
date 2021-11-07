import React from 'react';
import Box from './Box';

export default function BoxGrid({
    rows = 2,
    columns = 2,
    boxSize = 1,
    ...restProps
}) {

    const xOffset = (columns/2) * boxSize - boxSize/2;
    const yOffset = (rows/2) * boxSize - boxSize/2;

    const boxes = Array(rows * columns).fill(0).map((_, idx) => {
        const row = Math.floor(idx / columns);
        const col = idx % columns;

        return (
            <Box
                size={boxSize}
                position={[col * boxSize, - row * boxSize, 0]}
                row={row}
                col={col}
            />
        );
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