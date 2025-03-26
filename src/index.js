import { createGame } from '@/utils/init.js';

createGame();

// if (import.meta.webpackHot) {
//   import.meta.webpackHot.accept('@/utils/init.js', () => {
//       console.log('HMR: Reloading game...');
//       if (gameInstance) {
//           destroyGame(gameInstance);
//       }
//       gameInstance = createGame();
//   });
// }
