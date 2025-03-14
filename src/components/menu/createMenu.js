import Phaser from 'phaser'
import { GameScene } from "@/GameScene";
import { MenuScene } from "@/MenuScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MenuScene, GameScene],
  
  // pixelArt: true,
  // transparent: true,
  // physics: {
  //   default: 'arcade',
  //   arcade: {
  //     debug: false
  //   }
  // },
  // scene: [PreloadScene, PlayScene]
};

export function createMenu() {
  const body = document.body;

  // Create the main game menu container
  const menuContainer = document.createElement('div');
  menuContainer.setAttribute('id', 'game-menu');
  menuContainer.classList.add('menu');
  
  // Create game title
  const title = document.createElement('h1');
  title.textContent = 'Space Invaders';
  menuContainer.appendChild(title);

  // Create Start Game button
  const startButton = document.createElement('button');
  startButton.textContent = 'Start Game';
  startButton.id = 'start-btn';
  startButton.addEventListener('click', () => startGame());
  menuContainer.appendChild(startButton);

  // Create Options button
  const optionsButton = document.createElement('button');
  optionsButton.textContent = 'Options';
  optionsButton.id = 'options-btn';
  optionsButton.addEventListener('click', () => openOptionsMenu());
  menuContainer.appendChild(optionsButton);

  // Create Exit button
  const exitButton = document.createElement('button');
  exitButton.textContent = 'Exit';
  exitButton.id = 'exit-btn';
  exitButton.addEventListener('click', () => window.close());  // Or navigate away
  menuContainer.appendChild(exitButton);

  body.appendChild(menuContainer);
}

// Handling Game Start
function startGame() {
  document.getElementById('game-menu').style.display = 'none';
  // Start Phaser game
  const game = new Phaser.Game(config);
}

// Options Menu Logic
function openOptionsMenu() {
  console.log('Opening options...');
  // Implement options menu (volume, difficulty, etc.)
}