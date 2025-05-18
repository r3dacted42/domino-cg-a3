import { Pane } from "tweakpane";

const arrangementOpts = {
    "uniform": 0,
    "non uniform": 1,
};

const shadingOpts = {
    "phong": 0,
    "gouraud": 1,
};

const lightingOpts = {
    "single": 1,
    "double": 2,
    "triple": 3,
};

const textureOpts = {
    "none": 0,
    "wood grain": 1,
    "checkerboard": 2,
};

const texMappingOpts = {
    "cylindrical": 0,
    "spherical": 1,
};

export function setupControls(
    dominoManager,
    shaderManager,
    scene,
    dominoCount,
    dominoSpacing,
    dominoProps,
    lightingManager,
    sceneManager,
) {
    const pane = new Pane({
        title: "controls",
        container: document.getElementById("controls"),
    });

    const settings = {
        arrangement: 0,
        count: dominoCount,
        spacing: dominoSpacing,
        shading: 0,
        lighting: 1,
        helpers: true,
        color: "#00ff00",
        texture: 0,
        texMapping: 0,
        showSampleSphere: false,
        sphereVariation: 4, // Default to middle domino (for 9 dominoes)
    };

    // Create a folder for scene settings
    const sceneFolder = pane.addFolder({
        title: 'Scene Settings',
    });

    const arrangementBinding = sceneFolder.addBinding(settings, 'arrangement', { options: arrangementOpts });
    arrangementBinding.on('change', (_e) => {
        dominoManager.switchArrangement(
            scene,
            settings.count,
            settings.spacing,
            dominoProps,
        );
    });

    const countBinding = sceneFolder.addBinding(settings, 'count', { step: 1, min: 3, max: 13 });
    countBinding.on('change', (e) => {
        const newValue = e.value;
        dominoManager.redrawDominos(
            scene,
            newValue,
            settings.spacing,
            dominoProps,
        );
        
        // Update sphere variation slider max value
        if (sphereVariationBinding) {
            sphereVariationBinding.max = newValue - 1;
            // Ensure sphere variation is valid for new count
            if (settings.sphereVariation >= newValue) {
                settings.sphereVariation = Math.floor(newValue / 2);
                updateSampleSphere();
            }
        }
    });

    const spacingBinding = sceneFolder.addBinding(settings, 'spacing', { step: 0.1, min: 0.3, max: 3 });
    spacingBinding.on('change', (e) => {
        const newValue = e.value;
        dominoManager.redrawDominos(
            scene,
            settings.count,
            newValue,
            dominoProps,
        );
    });

    // Create a folder for material and lighting settings
    const materialFolder = pane.addFolder({
        title: 'Material & Lighting',
    });

    const sampleSphereBinding = materialFolder.addBinding(settings, 'showSampleSphere');
    sampleSphereBinding.on('change', (e) => {
        sceneManager.toggleSampleSphere(e.value);
    });
    
    // Function to update the sample sphere
    function updateSampleSphere() {
        if (sceneManager.sampleSphere) {
            dominoManager.updateSampleSphere(sceneManager.sampleSphere, settings.sphereVariation);
        }
    }
    
    // Add control for sphere variation
    const sphereVariationBinding = materialFolder.addBinding(settings, 'sphereVariation', { 
        step: 1, 
        min: 0, 
        max: dominoCount - 1,
    });
    sphereVariationBinding.on('change', () => {
        updateSampleSphere();
    });

    const shadingBinding = materialFolder.addBinding(settings, 'shading', { options: shadingOpts });
    shadingBinding.on('change', (_e) => {
        shaderManager.toggleShading();
    });

    const lightingBinding = materialFolder.addBinding(settings, 'lighting', { options: lightingOpts });
    lightingBinding.on('change', (e) => {
        const newValue = e.value;
        lightingManager.setLightingMode(newValue);
    });

    const helpersBinding = materialFolder.addBinding(settings, 'helpers');
    helpersBinding.on('change', (_e) => {
        lightingManager.toggleHelpers();
    });

    const colorsBinding = materialFolder.addBinding(settings, 'color');
    colorsBinding.on('change', (e) => {
        const newColor = e.value;
        dominoManager.setColor(newColor);
    });

    const textureBinding = materialFolder.addBinding(settings, 'texture', { options: textureOpts });
    textureBinding.on('change', (e) => {
        const newValue = e.value;
        texMappingBinding.hidden = (newValue === 0);
        const newTextureName = (() => {
            const currentKey = Object.keys(textureOpts)[newValue];
            return textureOpts[currentKey] === 0 ? undefined : currentKey;
        })();
        dominoManager.setTextureName(newTextureName);
    });

    const texMappingBinding = materialFolder.addBinding(settings, 'texMapping', { 
        options: texMappingOpts,
        hidden: true,
    });
    texMappingBinding.on('change', (e) => {
        const newValue = e.value;
        const newTexMapping = Object.keys(texMappingOpts)[newValue];
        dominoManager.setTexMapping(newTexMapping);
    });
}