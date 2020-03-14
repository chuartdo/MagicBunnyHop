//Animate array of fly objects with wings
//CC  @Chuartdo

const Animation = require('Animation');
const Scene = require('Scene');

const sceneRoot = Scene.root;
const base = [];
const planeTracker = sceneRoot.find('planeTracker0');


const MAX_OBJ = 12;
for (let i=0; i< MAX_OBJ; i++) {
    base[i] = sceneRoot.find('Butterfly'+i.toString());
}


// fly objects local updown animation

const baseDriverParameters = {
    durationMilliseconds: 2200,
    loopCount: Infinity,
    mirror: true
};
 
const baseDriver = Animation.timeDriver(baseDriverParameters);
baseDriver.start();

// Spread out random postion in a plane 
const spead_distance = 3
for (let i=0; i< base.length; i++) {
    
    var baseSampler = Animation.samplers.easeInOutCirc(0.4,Math.random() *2);
    const baseAnimation = Animation.animate(baseDriver,baseSampler);

    base[i].transform.x = Math.random() * spead_distance  - spead_distance/2;
    base[i].transform.y  = baseAnimation;
    base[i].transform.z = Math.random() * spead_distance  - spead_distance/2 ;
}

// Flapping animation

const wingDriverParameters = {
    durationMilliseconds: 200,
    loopCount: Infinity,
    mirror: true
};

const wingDriver = Animation.timeDriver(wingDriverParameters);
wingDriver.start();

// Animate flapping wing
 
for (let i=0; i< base.length; i++) {
    var body = base[i];
    if (body) { 
       body = body.find('body');
        const wingLeft = body.find('Lwing');
        const wingRight = body.find('Rwing');
        var rotationAngle = Math.random()  + 0.5;
        wingLeft.transform.rotationZ  = Animation.animate(wingDriver, Animation.samplers.easeInCirc(-rotationAngle,rotationAngle));
        wingRight.transform.rotationZ  = Animation.animate(wingDriver, Animation.samplers.easeInCirc(rotationAngle,-rotationAngle));
    }
    
 }
  