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
    };

    const arrangementBinding = pane.addBinding(settings, 'arrangement', { options: arrangementOpts });
    arrangementBinding.on('change', (_e) => {
        dominoManager.switchArrangement(
            scene,
            settings.count,
            settings.spacing,
            dominoProps,
        );
    });

    const countBinding = pane.addBinding(settings, 'count', { step: 1, min: 3, max: 13 });
    countBinding.on('change', (e) => {
        const newValue = e.value;
        dominoManager.redrawDominos(
            scene,
            newValue,
            settings.spacing,
            dominoProps,
        );
    });

    const spacingBinding = pane.addBinding(settings, 'spacing', { step: 0.1, min: 0.3, max: 3 });
    spacingBinding.on('change', (e) => {
        const newValue = e.value;
        dominoManager.redrawDominos(
            scene,
            settings.count,
            newValue,
            dominoProps,
        );
    });

    const shadingBinding = pane.addBinding(settings, 'shading', { options: shadingOpts });
    shadingBinding.on('change', (_e) => {
        shaderManager.toggleShading();
    });

    const lightingBinding = pane.addBinding(settings, 'lighting', { options: lightingOpts });
    lightingBinding.on('change', (e) => {
        const newValue = e.value;
        lightingManager.setLightingMode(newValue);
    });

    const helpersBinding = pane.addBinding(settings, 'helpers');
    helpersBinding.on('change', (_e) => {
        lightingManager.toggleHelpers();
    });

    const colorsBinding = pane.addBinding(settings, 'color');
    colorsBinding.on('change', (e) => {
        const newColor = e.value;
        dominoManager.setColor(newColor);
    });

    const textureBinding = pane.addBinding(settings, 'texture', { options: textureOpts });
    textureBinding.on('change', (e) => {
        const newValue = e.value;
        texMappingBinding.hidden = (newValue === 0);
        const newTextureName = (() => {
            const currentKey = Object.keys(textureOpts)[newValue];
            return textureOpts[currentKey] === 0 ? undefined : currentKey;
        })();
        dominoManager.setTextureName(newTextureName);
    });

    const texMappingBinding = pane.addBinding(settings, 'texMapping', { 
        options: texMappingOpts,
        hidden: true,
    });
    texMappingBinding.on('change', (e) => {
        const newValue = e.value;
        const newTexMapping = Object.keys(texMappingOpts)[newValue];
        dominoManager.setTexMapping(newTexMapping);
    });
}