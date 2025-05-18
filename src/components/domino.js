import * as THREE from 'three';
import { getTextureByName } from '../lib/texture';
import { applyCylindricalUV, applySphericalUV } from '../lib/uvMapping';
import { hexStringToHexValue } from '../lib/utils';

export class DominoManager {
  constructor(shaderManager) {
    this.dominos = [];
    this.extraMeshes = []; // For sample sphere and other non-domino meshes
    this.geometries = new Map();
    this.shaderManager = shaderManager;
    this.currentArrangement = 'uniform';
    this.color = 0x00ff00;
    this.textureName = undefined;
    this.texMapping = 'cylindrical';
    this.materialVariations = [];
  }

  createDomino(width, height, depth, roughness, metalness) {
    const geometryKey = `${width}-${height}-${depth}`;
    if (!this.geometries.has(geometryKey)) {
      this.geometries.set(geometryKey, new THREE.BoxGeometry(width, height, depth));
    }
    const geometry = this.geometries.get(geometryKey);
    const material = this.shaderManager.createMaterial(this.color, roughness, metalness, this.textureName);

    material.userData.baseColor = this.color;
    material.userData.roughness = roughness;
    material.userData.metalness = metalness;

    const domino = new THREE.Mesh(geometry, material);

    domino.castShadow = true;
    domino.receiveShadow = true;

    if (this.texMapping === 'cylindrical') {
      applyCylindricalUV(domino.geometry);
    } else {
      applySphericalUV(domino.geometry);
    }

    this.shaderManager.registerMesh(domino);
    this.dominos.push(domino);
    return domino;
  }

  createMaterialVariations(count) {
    this.materialVariations = Array(count).fill().map((_, i) => {
      const t = i / (count - 1);
      return {
        roughness: 0.9 - 0.7 * t, // Range from 0.9 to 0.2
        metalness: t              // Range from 0 to 1
      };
    });
    return this.materialVariations;
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
      );

      domino.position.x = currentX;
      domino.rotation.y = (i % 2 === 0) ? Math.PI / 2 : -Math.PI / 2;

      scene.add(domino);

      if (i < count - 1) {
        currentX += spacings[i];
      }
    }
  }

  redrawDominos(scene, count, spacing, dominoProps) {
    if (this.currentArrangement === 'uniform') {
      this.createDominoLine(scene, count, spacing, dominoProps);
    } else {
      this.createNonUniformDominoLine(scene, count, spacing, dominoProps);
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

  registerExtraMesh(mesh) {
    if (!this.extraMeshes.includes(mesh)) {
      this.extraMeshes.push(mesh);
    }
  }

  setColor(colorHexStr) {
    const colorHex = hexStringToHexValue(colorHexStr);
    this.color = colorHex;
    
    // Update dominoes
    this.dominos.forEach((mesh) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        mat.uniforms.diffuseColor.value = new THREE.Color(colorHex);
        mat.needsUpdate = true;
      });
    });
    
    // Update extra meshes (like sample sphere)
    this.extraMeshes.forEach((mesh) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        if (mat.uniforms && mat.uniforms.diffuseColor) {
          mat.uniforms.diffuseColor.value = new THREE.Color(colorHex);
          mat.needsUpdate = true;
        }
      });
    });
  }

  setTextureName(name) {
    this.textureName = name;
    const tex = getTextureByName(name);
    
    // Update dominoes
    this.dominos.forEach((mesh) => {
      if (this.texMapping === 'cylindrical') {
        applyCylindricalUV(mesh.geometry);
      } else {
        applySphericalUV(mesh.geometry);
      }
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        if (mat instanceof THREE.ShaderMaterial) {
          if (!mat.uniforms.map) mat.uniforms.map = { value: tex };
          else mat.uniforms.map.value = tex;
          mat.needsUpdate = true;
        } else {
          mat.map = tex;
          mat.needsUpdate = true;
        }
      });
    });
    
    // Update extra meshes (like sample sphere)
    this.extraMeshes.forEach((mesh) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        if (mat instanceof THREE.ShaderMaterial) {
          if (!mat.uniforms.map) mat.uniforms.map = { value: tex };
          else mat.uniforms.map.value = tex;
          mat.needsUpdate = true;
        } else {
          mat.map = tex;
          mat.needsUpdate = true;
        }
      });
    });
  }

  setTexMapping(mapping) {
    this.texMapping = mapping;
    
    // Update dominoes
    this.dominos.forEach((mesh) => {
      if (this.texMapping === 'cylindrical') {
        applyCylindricalUV(mesh.geometry);
      } else {
        applySphericalUV(mesh.geometry);
      }
    });
    
    // Update extra meshes (like sample sphere)
    this.extraMeshes.forEach((mesh) => {
      if (this.texMapping === 'cylindrical') {
        applyCylindricalUV(mesh.geometry);
      } else {
        applySphericalUV(mesh.geometry);
      }
    });
  }

  updateSampleSphere(sphere, variationIndex) {
    if (!sphere || this.materialVariations.length === 0) return;
    
    // Use middle variation if index is not provided or out of bounds
    const index = variationIndex !== undefined ? 
      Math.min(Math.max(0, variationIndex), this.materialVariations.length - 1) : 
      Math.floor(this.materialVariations.length / 2);
    
    const variation = this.materialVariations[index];
    
    // Create new material with current variation
    const sphereMaterial = this.shaderManager.createMaterial(
      this.color, 
      variation.roughness, 
      variation.metalness,
      this.textureName
    );
    
    // Store properties in userData
    sphereMaterial.userData.baseColor = this.color;
    sphereMaterial.userData.roughness = variation.roughness;
    sphereMaterial.userData.metalness = variation.metalness;
    
    // Update geometry UV mapping based on current mapping mode
    if (this.texMapping === 'cylindrical') {
      applyCylindricalUV(sphere.geometry);
    } else {
      applySphericalUV(sphere.geometry);
    }
    
    // Apply new material
    sphere.material = sphereMaterial;
    this.shaderManager.registerMesh(sphere);
    
    return sphere;
  }
}
