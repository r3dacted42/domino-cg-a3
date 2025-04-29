import * as THREE from 'three';

export class DominoManager {
  constructor(shaderManager) {
    this.dominos = [];
    this.geometries = new Map();
    this.shaderManager = shaderManager;
    this.currentArrangement = 'uniform';
  }

  createDomino(width, height, depth, roughness, metalness, color = 0x00ff00) {
    const geometryKey = `${width}-${height}-${depth}`;
    if (!this.geometries.has(geometryKey)) {
      this.geometries.set(geometryKey, new THREE.BoxGeometry(width, height, depth));
    }
    const geometry = this.geometries.get(geometryKey);
    const material = this.shaderManager.createMaterial(color, roughness, metalness);
    
    material.userData.baseColor = color;
    material.userData.roughness = roughness;
    material.userData.metalness = metalness;
    
    const domino = new THREE.Mesh(geometry, material);
    
    domino.castShadow = true;
    domino.receiveShadow = true;

    this.shaderManager.registerMesh(domino);
    this.dominos.push(domino);
    return domino;
  }

  createMaterialVariations(count) {
    return Array(count).fill().map((_, i) => {
      const t = i / (count - 1);
      return {
        roughness: 0.9 - 0.7 * t, // Range from 0.9 to 0.2
        metalness: t              // Range from 0 to 1
      };
    });
  }
  
  createDominoLine(scene, count, spacing, dominoProps) {
    this.clearDominos(scene);
    
    const { width, height, depth } = dominoProps;
    const materialVariations = this.createMaterialVariations(count);
    
    for (let i = 0; i < count; i++) {
      const domino = this.createDomino(
        width, 
        height, 
        depth, 
        materialVariations[i].roughness,
        materialVariations[i].metalness,
        0x00ff00 
      );
      
      domino.position.x = (i - (count - 1) / 2) * spacing;
      domino.rotation.y = (i % 2 === 0) ? Math.PI / 2 : -Math.PI / 2;
      scene.add(domino);
    }
  }
  
  createNonUniformDominoLine(scene, count, baseSpacing, dominoProps) {
    this.clearDominos(scene);
    
    const { width, height, depth } = dominoProps;
    const materialVariations = this.createMaterialVariations(count);
    
    const spacings = [];
    let totalDistance = 0;
    
    for (let i = 0; i < count - 1; i++) {
      const variationFactor = 1 + 0.2 * Math.sin(i * Math.PI / 3);
      const currentSpacing = baseSpacing * variationFactor;
      spacings.push(currentSpacing);
      totalDistance += currentSpacing;
    }
    
    let currentX = -totalDistance / 2;
    for (let i = 0; i < count; i++) {
      const domino = this.createDomino(
        width, 
        height, 
        depth, 
        materialVariations[i].roughness,
        materialVariations[i].metalness,
        0x00ff00 
      );
      
      domino.position.x = currentX;
      domino.rotation.y = (i % 2 === 0) ? Math.PI / 2 : -Math.PI / 2;
      
      scene.add(domino);
      
      if (i < count - 1) {
        currentX += spacings[i];
      }
    }
  }
  
  switchArrangement(scene, count, spacing, dominoProps) {
    this.currentArrangement = (this.currentArrangement === 'uniform') ? 'nonuniform' : 'uniform';
    
    if (this.currentArrangement === 'uniform') {
      this.createDominoLine(scene, count, spacing, dominoProps);
    } else {
      this.createNonUniformDominoLine(scene, count, spacing, dominoProps);
    }
    
    return this.currentArrangement;
  }
  
  clearDominos(scene) {
    for (const domino of this.dominos) {
      scene.remove(domino);
    }
    this.dominos = [];
  }
}
