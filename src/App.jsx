import React from 'react';
import { useSelector } from 'react-redux';

import StartMenu from './startMenu';
import { showMenuSelector } from './store/slices/startMenu';
import GameBoard from './gameBoard';

function App() {
  const showMenu = useSelector(showMenuSelector);
  return showMenu ? <StartMenu /> : <GameBoard />;
  // return <StartMenu />;
}

export default App;
