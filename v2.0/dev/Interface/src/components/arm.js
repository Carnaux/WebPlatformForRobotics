var THREE = require('three');
var MTLLoader = require('../libs/MTLLoader.js');
var OBJLoader = require('../libs/OBJLoader.js');


module.export = {
    BuildArm: function () {


        // instantiate a loader
        var loader = new OBJLoader();

        var model;
        // load a resource
        loader.load(
            // resource URL
            'src/models/motor.obj',
            // called when resource is loaded
            function (object) {

                scene.add(object);
                model = object;
            },
            // called when loading is in progresses
            function (xhr) {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            function (error) {

                console.log('An error happened');

            }
        );

        return model;
    }
}