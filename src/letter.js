// This module represents a letter that moves across the screen
import { Text } from 'pixi.js';

export function createLetter(letterString, {x, y}) {
  const sprite = new Text(letterString);
  sprite.position.set(x, y);
  return {
    sprite,
    speed: 1
  }
}