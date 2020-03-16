//==============================================================================
// The following example demonstrates how to subscribe to all touch events to
// control the rotation, scale, position, material and opacity of a plane.
//
// Project setup:
// - Insert a plane
// - Increase the x and y-axis scale values of the plane to 2
// - Create two materials with different colors
// - Assign one of the materials to the plane
// - Enable all Touch Gestures under the Touch Gesture capability
//==============================================================================

// Load in the required modules
const Materials = require('Materials');
const Scene = require('Scene');
const TouchGestures = require('TouchGestures');

// Locate the plane in the Scene
const plane = Scene.root.find('planeTracker0');
const rabbit = Scene.root.find('Rabbit');
//==============================================================================
// Change the material applied to the plane when the plane is tapped
//==============================================================================

/*
// Locate the materials in the Assets
const material = Materials.get('defaultMaterial0');
const material2 = Materials.get('defaultMaterial1');

// Subscribe to tap gestures on the plane
TouchGestures.onTap(plane).subscribe(function (gesture) {

  // Switch materials depending on which one is currently applied to the plane
  if(plane.materialIdentifier === material.identifier) {
    plane.material = material2;
  } else {
    plane.material = material;
  }

});
*/
//==============================================================================
// Move the plane across the screen when dragging it with a finger
//==============================================================================

// Store a reference to the transform of the plane
const planeTransform = plane.transform;

// Subscribe to pan gestures on the plane
TouchGestures.onPan(plane).subscribe(function (gesture) {

  // Translate the position of the finger on the screen to the plane's
  // co-ordinate system
  const gestureTransform = Scene.unprojectToFocalPlane(gesture.location);

  // Update the position of the plane
  planeTransform.y = gestureTransform.y;
  planeTransform.x = gestureTransform.x;
 

});

//==============================================================================
// Scale the plane when pinching it with two fingers
//==============================================================================

// Subscribe to pinch gestures on the plane
TouchGestures.onPinch(plane).subscribe(function (gesture) {
/*
  if (planeTransform.scaleX < 0.2   ) {
      return;
  }
  */
  // Store the last known x and y-axis scale values of the plane
  const lastScaleX = planeTransform.scale.x.pinLastValue();
  const lastScaleY = planeTransform.scale.y.pinLastValue();
  const lastScaleZ = planeTransform.scale.z.pinLastValue();

  // Update the scale of the plane by multiplying the last known scale with the
  // scale returned by the gesture

  planeTransform.scaleX = gesture.scale.mul(lastScaleX);
  planeTransform.scaleY = gesture.scale.mul(lastScaleY);
  planeTransform.scaleZ = gesture.scale.mul(lastScaleZ);

});
/*
//==============================================================================
// Rotate the plane when rotating it with two fingers
//==============================================================================

// Subscribe to rotation gestures on the plane
TouchGestures.onRotate(plane).subscribe(function (gesture) {

  // Store the last known z-axis rotation value of the plane
  const lastRotationZ = planeTransform.rotationZ.pinLastValue();

  // Update the z-axis rotation of the plane by adding the gesture rotation and
  // multiply it by -1 to have it rotate in the correct direction
  planeTransform.rotationZ = gesture.rotation.mul(-1).add(lastRotationZ);

});
*/