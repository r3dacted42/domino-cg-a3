import * as THREE from 'three';
import woodJpeg from '../assets/textures/wood.jpg';
const textureLoader = new THREE.TextureLoader();

// Wood grain (external JPG)
export const woodTexture = textureLoader.load(woodJpeg, t => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
});

// Programmatically generated checkerboard (CanvasTexture)
export function createCheckerboard(size = 512, squares = 8) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  const sq = size / squares;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#000000';
  for (let i = 0; i < squares; i++) {
    for (let j = 0; j < squares; j++) {
      if ((i + j) % 2 === 0) ctx.fillRect(i * sq, j * sq, sq, sq);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}
export const checkerboardTexture = createCheckerboard();

const whiteTex = new THREE.DataTexture(
  new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat
);
whiteTex.needsUpdate = true;

export function getTextureByName(textureName) {
  if (!textureName) return whiteTex;
  if (textureName === 'wood grain') return woodTexture;
  if (textureName === 'checkerboard') return checkerboardTexture;
  throw new Error("unknown texture name ⁉");
}
