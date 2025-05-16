# domino-cg-a3

## A3 - Lighting and Texture Mapping
The objective of this assignment is to set up lighting, implement local illumination shading models, and texture mapping using a checkerboard pattern. The implementation of A3 is to be considered as a sandbox/experimental testbed for that for A4. There are 3 tasks in this assignment.

### Model: 
Take 9 different thin cuboids (dominos) of the same size and color but different optical properties, similar to the spheres in Figure 1. These are a set of objects in a scene in A3. Place these dominos with a straight line patterns as shown in Figure 2. For A3, experiment with one uniform and one non-uniform spacing arrangement. The order of the dominos can be permuted, i.e., the positions can be shuffled. Keyboard controls may be used to toggle between the scenes, and shuffling the positions. 

### Task-1 (Shading Model):
Implement Gouraud and Phong shading using vertex and fragment shaders, respectively.
Gouraud shading may be set as the default shader for all meshes. Keyboard control is to be used to toggle between Gouraud and Phong shading.

### Task-2 (Local Illumination Model):
Implement Blinn-Phong (local) illumination model to perform lighting using 2 or more light sources. Here, use scenarios of (a) 1 light source (to reproduce the result in Figure 1), and (b) light sources. These light sources are stationary.

![Figure 1](https://in.mathworks.com/help/matlab/creating_plots/lite2_new.png)

Figure 1: Results rendering using lighting with varying specular and diffuse reflectances.

![Figure 2](http://www.domino-play.com/TopplingStraightLine.jpg)

Figure 2: Straight-Line Domino Arrangement with Uniform Spacing.

### Task-3 (Texture Mapping):
There are two texture patterns -- use the wood-grain texture and the checkerboard texture.
For the checkerboard pattern, perform both spherical and cylindrical texture maps for a domino arrangement. An example rendering of a multi-object scene is given in Figure 3.

![Figure 3.1 a Spherical Mapping](https://education.siggraph.org/static/HyperGraph/mapping/r_wolfe/s97slides/slide14.jpg)

![Figure 3.1 b Spherical Mapping](https://education.siggraph.org/static/HyperGraph/mapping/r_wolfe/s97slides/slide15.jpg)

Spherical Mapping

![Figure 3.2 a Cylindrical mapping](https://education.siggraph.org/static/HyperGraph/mapping/r_wolfe/s97slides/slide11.jpg)

![Figure 3.2 b Cylindrical mapping](https://education.siggraph.org/static/HyperGraph/mapping/r_wolfe/s97slides/slide12.jpg)


Cylindrical mapping

Figure 3: Texture mapping rendering using spherical and cylindrical mapping.

## Credits:  
- Wood Grain Texture Image: [Photo by FWStudio](https://www.pexels.com/photo/brown-wood-surface-172289/)
