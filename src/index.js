import { createGame, destroyGame } from '@/utils/init.js';

let gameInstance = createGame();

// if (import.meta.webpackHot) {
//   import.meta.webpackHot.accept('@/utils/init.js', () => {
//       console.log('HMR: Reloading game...');
//       if (gameInstance) {
//           destroyGame(gameInstance);
//       }
//       gameInstance = createGame();
//   });
// }
