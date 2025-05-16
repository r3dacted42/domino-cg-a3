# Domino

Summary:
The group asssignment should build up on assignments-1 and 2 (A1 and A2), and hence is a combination of two subsequent assignments, A3 and A4.

- [A3] Lighting & texture mapping – 15% of final grade
- [A4] Animation – 15% of final grade
- Groups of 2-3 students

Learning Objectives:
- [A3] Implementing Gouraud and Phong shading models, and toggle between them.
- [A3] Setting up local illumination with multiple light sources using Blinn-Phong illumination models.
- [A3] Texture mapping experiments with checkerboard.
- [A4] Modeling a dynamic scene with a Scene Graph and relative transforms
- [A4] Procedural animation of a scene including collision detection
- [A4] Dynamic lights and camera

Deliverables:
- Separate submissions shall be done for A3 and A4.
- Each team member shall own up a distinct part of both A3 and A4. Both A3 and A4 are also conveniently split into 3 objectives each to allow each student to own 1-2 objectives from both.
    - The demo will involve a code walk-through by individual contributors. The expectation of completion of the objectives will be dependent on the group size.
- Both A3 and A4 will have a joint demo and viva component with the instructor.
    - The demo will involve a code walk-through by individual contributors.
- A3 requires the submission of code and a folder of screenshots on LMS.
- A4 requires the submission of code, a folder of screenshots of a demo in video format on LMS.
    - The video demo can focus on the animation generated.
- It is expected that for both A3 and A4, the team shall integrate the individual parts to submit joint work.
    - It is sufficient that the team representative makes a single submission on LMS for the entire team.
    - All team members may also submit individual contributions that are over and above the joint work as separate submissions through LMS, but this will be evaluated only after the concerned students mention the same during the demo with the instructors.
- The evaluation for A3 and A4 is based on the submissions on LMS.

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


1. The checkerboard texture can be generated as given in the function makeCheckImage in https://www.glprogramming.com/red/chapter09.html or can be downloaded as a highresolution image. Programmatic generation of the image gives more control for getting high-resolution images without the quality drop owing to compression in different image formats, and also, opportunities to experiment with image sizes for the texture.

### Implementation notes:
1. The students are strongly encouraged to use the Javascript library Three.js in this assignment. This library provides high-level objects such as scene objects, mesh objects, lights, cameras, etc. The properties and others may be manipulated using high-level operations to achieve your objectives. This implementation is to be reused for A4.
2. There is enough room for creativity and hence the A3 implementation must not appear similar to the other teams in the class.

## A4 - Domino Toppling Animation
The objective of this assignment is to simulate a domino toppling animation, with dominos using the U-turn and Split arrangements shown in Figure 4.
For some fascinating (and very advanced) demonstrations, see YouTube channel of @Hevesh5 https://www.youtube.com/channel/UCxJsQFhb8PFjtuN5gdOV6-w

![Figure 4](http://www.domino-play.com/TopplingTurn.jpg)

Figure 4: Domino Toppling with a turn and a split.

We will attempt something less ambitious and more achievable!
The animation to be designed comprises N toppling steps (N >= 3), where each step is one toppling sequence. The trigger for the toppling should be a ball rolling till it hits the starting domino of the next step (which then moves), or an object dropping till it hits a lever (which then rotates and topples the starting domino of the next step). At least one turn and one split (Figure 4) must be implemented. The remaining could be straight arrangements (Figure 2) to simplify the animations.

### Task 1: Model and Scene Graph
You can use any geometry, including simple spheres, cylinders, and cuboids, as the moving/rolling objects, and any combination of mechanisms/arrangements. Use textures and
lighting/shading models from A3 to color the objects.
Use a scene graph to model the objects in the scene, and especially to manage dependencies between objects. At least one step in the animation should involve the motion of one object 
constrained by (relative to) the motion of a second object. And this should be modeled as a dependency in the scene graph.

### Task 2: Animation including Collision Detection

Implement each animation step in 3 parts:
1. animation of one or more objects - rolling, falling, etc. The motion may be constrained by other objects (e.g. a ball rolling down a face of a box)
2. detection of collision with another object
3. reaction to the collision - on the first object and on the second, which then executes step 1 above
4. A fallen domino must be rendered of a different shade of the same color to give the effects seen in elaborate domino arrangements (ref. YouTube channel).

### Task 3: Dynamic Lights & Camera

The scene is lit by a set of 3 lights:
- a point source at a fixed location and illuminating the entire scene
- a directional spotlight fixed at a certain height on one side of the scene and lighting the middle of the scene
- a moving spotlight that follows the object that is currently moving (the focus of the animation at that point). This spotlight is at a fixed location but points toward the moving object

Each of these lights can be toggled on or off. Use different colors for each of the lights, so that their effect is visible.

The scene can be viewed through one of 2 cameras:
1. A camera located above the scene, and can be rotated about the scene using a trackball mechanism
2. A camera that is fixed a certain small distance above one of the moving objects and follows the (translation) motion of the object. The camera can be rotated about a vertical axis through user commands.
3. Controls allow switching between the camera modes.

### Implementation notes:
1. This assignment is structured to enable the maximum reuse of designs and code from A2 and A3. The students should use techniques such as rotations using quaternions and trackball, mechanisms for keyboard controls, shaders, etc.
2. Note that effects such as a ball rolling down an incline can be computed as the (constrained) translation of the ball down the incline, and a rotation at a rate proportional to the translation speed
3. For detecting collision between a moving object and a mechanism, you can build in simplifying assumptions about where and how to check for collisions, so long as the actual collision detection is done at run-time based on the position of the relevant objects.
4. There is enough room for creativity and hence the A4 implementation must not appear similar to the other teams in the class.


## Rubrics:
15% of final grade – Marks out of 30
- 10 marks for implementation of A3 .
- 10 marks for implementation of A4
- 10 marks for demo and viva

## Credits:  
- Wood Grain Texture Image: [Photo by FWStudio](https://www.pexels.com/photo/brown-wood-surface-172289/)