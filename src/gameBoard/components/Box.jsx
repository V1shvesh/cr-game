import React, {
  useState, useCallback, useLayoutEffect, useMemo,
} from 'react';
import { BoxBufferGeometry } from 'three';
import { useSelector, useDispatch } from 'react-redux';

import OrbGroup from './OrbGroup';
import OrbExplosion from './OrbExplosion';
import {
  explodeCell,
  incrementSphereCount,
  cellSelector,
  gameStateSelector,
  updateCellsToBeIncremented,
  activePlayerSelector,
  endGameSelector,
} from '../../store/slices/game';
import { getCellNeighbours, getPlayerColor } from '../utils';
import { GAME_STATES } from '../constants';

export default function Box({
  size, row, col, ...props
}) {
  const boxDimens = Array(3).fill(size);
  const boxGeom = new BoxBufferGeometry(...boxDimens);

  const [isHovered, setHover] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  const dispatch = useDispatch();

  const activePlayer = useSelector((state) => activePlayerSelector(state));
  const isGameEnded = useSelector((state) => endGameSelector(state));

  const { sphereCount, playerId } = useSelector((state) => cellSelector(state, row, col));
  const gameState = useSelector((state) => gameStateSelector(state));

  const neighbours = useMemo(() => getCellNeighbours(row, col), [row, col]);

  useLayoutEffect(() => {
    if (sphereCount >= neighbours.length) {
      dispatch(explodeCell({ row, col }));
      return setIsExploding(true);
    }
  }, [sphereCount, row, col, dispatch, neighbours]);

  const handleClick = useCallback(() => {
    if (gameState === GAME_STATES.CAPTURE) return;
    if (playerId && playerId !== activePlayer) return;
    if (isGameEnded) return;
    dispatch(updateCellsToBeIncremented({ count: 1 }));
    dispatch(incrementSphereCount({ row, col, playerId: activePlayer }));
  }, [dispatch, row, col, playerId, gameState, activePlayer, isGameEnded]);

  const handleOnExplosionEnd = useCallback(() => {
    setIsExploding(false);
    neighbours.forEach((dir) => {
      dispatch(incrementSphereCount({
        row: row + (dir % 2) * (dir - 2),
        col: col + (1 - (dir % 2)) * (dir - 1),
        playerId: activePlayer,
      }));
    });
  }, [dispatch, row, col, neighbours, activePlayer]);

  return (
    <group
      {...props}
      renderOrder={isHovered ? 10 : 0}
    >
      <mesh
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={handleClick}
        position={[0, 0, -size / 2]}
      >
        <planeBufferGeometry args={[size, size]} />
        <meshStandardMaterial color={getPlayerColor(activePlayer)} opacity={0.1} transparent />
      </mesh>
      <mesh>
        <lineSegments>
          <edgesGeometry args={[boxGeom]} />
          <lineBasicMaterial color={isHovered ? 'green' : getPlayerColor(activePlayer)} />
        </lineSegments>
      </mesh>
      <OrbGroup
        color={getPlayerColor(playerId)}
        sphereCount={sphereCount}
      />
      {isExploding && (
        <OrbExplosion
          color={getPlayerColor(activePlayer)}
          directions={neighbours}
          onEnd={handleOnExplosionEnd}
        />
      )}
    </group>
  );
}
