const Diagnostics = require('Diagnostics');
const Patches = require('Patches');
const Scene = require('Scene');

const GameState = 0;


// Locate the font in the Assets and the text in the Scene
var msgText = Scene.root.find('helpText');

//const NativeUI = require('NativeUI');
 const TouchGestures = require('TouchGestures');
 
// Set the initial text value
 
/*
// Subscribe to tap gestures
TouchGestures.onTap(msgText).subscribe(function () {

  // Enter text editing mode
  var score = Patches.getScalarValue('HatTapCount').lastValue;

  if ( score > 1 ) {
    msgText.text="** " + score.toString() + "  **"; 
  //  Diagnostics.log(msgText.text);
  }

});

*/