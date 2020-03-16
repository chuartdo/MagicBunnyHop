 
// Scripts to animate dropping eggs
// CC @chuartdo

const Scene = require('Scene');
const Time = require('Time') ;
const CANNON = require('cannon');
const TouchGestures = require('TouchGestures');
const Materials = require('Materials');
const Patches = require('Patches');

class CANNON_PHYSICS
{
    constructor( meshList )
    {
        this.cannon_world = new CANNON.World()
        this.cannon_world.gravity.set( 0,  -9.8, 0 )
        this.cannon_world.broadphase = new CANNON.NaiveBroadphase()
        this.cannon_world.solver.iterations = 10
        this.bodyList = []
        //this.objectss = meshList
        this.stop = false

        // Create flat ground body facing upward

        this.groundBody = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(0, -sphereProps.radius, 0),
            shape: new CANNON.Plane(),
          });
        const angle = -Math.PI / 2;
        const xAxis = new CANNON.Vec3(1, 0, 0);
        this.groundBody.quaternion.setFromAxisAngle(xAxis, angle);

        this.cannon_world.addBody(this.groundBody);

    }

    create_rigid_body( _arg )
    {
        var shapeType;
        if ( _arg.shape == 0)
          shapeType = new CANNON.Box( new CANNON.Vec3( _arg.w/2, _arg.h/2, _arg.d/2 ) );
        else
          shapeType = new CANNON.Sphere( _arg.w);

 
         const body  = new CANNON.Body( {
            mass:       _arg.mass,
            //shape:      new CANNON.Box( new CANNON.Vec3( _arg.w/2, _arg.h/2, _arg.d/2 ) ),
            shape: shapeType,
            position:   new CANNON.Vec3( _arg.x, _arg.y, _arg.z ),
            material:   new CANNON.Material( { friction: 0.1, } ), 
            linearDamping : (Math.random() * 0.4 + 0.3)
        } )

        
        this.cannon_world.add( body )

        if (_arg.id >= 0) { 
            var objPos = objects[_arg.id];
            if (objPos ) {
                objPos.transform.x = body.position.x;
                objPos.transform.y = body.position.y;
                objPos.transform.z = body.position.z;
            }
       }
       
       
       this.bodyList[_arg.id] = body;
    }

    updatePhysics(  ) {
       
        if (this.stop)
          return;
            const fixedTimeStep = 1.0 / 60.0;
            const maxSubSteps = 3;
            const timeInterval = 30;
            let lastTime;
            //const force = new CANNON.Vec3(0,1202,0);
            // Create time interval loop for cannon 
            Time.setInterval(function (time) {
            if (lastTime !== undefined) {
                let dt = (time - lastTime) / 1000;
                cannon_phy.cannon_world.step(fixedTimeStep)
                try { 
                    for (let i=0; i< objects.length; i++) {
                        objects[i].transform.x = cannon_phy.bodyList[i].position.x;
                        objects[i].transform.y =  cannon_phy.bodyList[i].position.y;
                        objects[i].transform.z = cannon_phy.bodyList[i].position.z;
                       
                    }
                } catch (err) 
                    {}
            }

            lastTime = time
            }, timeInterval);
    }

    stopSimulation() {
        this.stop = true;
    }

    resetSimulation () {
 
    }
}

// Create sphere body and setting its shape and properties
const radius = 1;
const sphereProps = {
  mass: 5,
  position: new CANNON.Vec3(0, 10, 0),
  radius: radius,
  shape: new CANNON.Sphere(radius),
}
var objects = [];

// Find and associate up to a dozen egg Mesh data with physics body
//const material = Materials.get('defaultMaterial0');
const eggMaterials =[] 
eggMaterials[0] = Materials.get('pink');
eggMaterials[1] = Materials.get('blue');
eggMaterials[2] = Materials.get('stripe');
eggMaterials[3] = Materials.get('yellow');

for (let i=0; i< 12; i++) {
    try {

         objects[i] =  Scene.root.find('egg'+i.toString());
        // Change Random material
            var eggMaterial =  objects[i].child('Sphere').child('Sphere');
            let index = Math.round(Math.random()*(eggMaterials.length-1)); 
            eggMaterial.material = eggMaterials[index];

        // Action when eggs are tapped
            TouchGestures.onTap(objects[i] ).subscribe(function () {
                floating = false;
            
            });

     }
    catch (err) {
        break;
    } 
}

 let cannon_phy = new CANNON_PHYSICS( objects )

cannon_phy.create_rigid_body( {
   id:0, shape: 0, mass: 0, x: 0, y: -0.4, z: 0, w: 60, h:  0.4, d: 60, 
} )


// Arrange initial location of eggs in world space
const box_size = 0.1
for ( var i=0 ; i<objects.length; i++ ) {
 
        var meshIndex = i;

        const param =  {
            id: meshIndex,
            shape: 1,
            mass: 1, 
            x: box_size *Math.cos(i)*4,  y :11, z: box_size * Math.sin(i)*4  ,
            w: box_size*0.5, h: box_size*1, d: box_size*1,     
        }
        cannon_phy.create_rigid_body(param);
         
}

var floating = true;

// Float and drop the eggs by changing gravity at interval
const FLOAT_GRAVITY = 5
Time.setTimeout(() => {
    var gravity = FLOAT_GRAVITY;

    Time.setInterval( ()=> {
        var count = Patches.getScalarValue('HatTapCount').lastValue;

        if  (count > 2)
                floating = false;
        if (count > 8) {
            floating = true;
            gravity = FLOAT_GRAVITY;
        }
        
        if (floating && Math.abs(gravity)==FLOAT_GRAVITY) {
            gravity = -gravity;
        } else {
            gravity = -9.8;
        }
        cannon_phy.cannon_world.gravity.set( 0, gravity, 0 ); }
     , 900);

}, 7000);


cannon_phy.updatePhysics();
 