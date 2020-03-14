 
// Scripts to animate dropping eggs

const Scene = require('Scene');
const Time = require('Time') ;
const CANNON = require('cannon');
//const TouchGestures = require('TouchGestures');
//const Materials = require('Materials');


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
            linearDamping : Math.random()
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
//const material2 = Materials.get('defaultMaterial1');
for (let i=0; i< 12; i++) {
    try {
         objects[i] =  Scene.root.find('egg'+i.toString());

        // objects[i].material = material2;
        // Set the initial text value
 
     
        
     }
    catch (err) {
        break;
    } 
}

 let cannon_phy = new CANNON_PHYSICS( objects )

cannon_phy.create_rigid_body( {
   id:0, shape: 0, mass: 0, x: 0, y: -0.4, z: 0, w: 50, h:  0.2, d: 50, 
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
            // Place objects
            objects[meshIndex].transform.x =  param.x;
            objects[meshIndex].transform.y = param.y;
            objects[meshIndex].transform.z =  param.z;
         
}



Time.setTimeout(() => {
    cannon_phy.stopSimulation( );
  }, 300);


  
cannon_phy.updatePhysics();
 