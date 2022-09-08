AFRAME.registerComponent('bowling-ball', {
    init: function () {
        // Do something when component first attached.
        this.throwBall()
    },
    throwBall: function () {
        window.addEventListener("keydown", (e) => {
            if (e.key === "t") {
                var ball = document.createElement("a-entity");
                ball.setAttribute("gltf-model", "./models/bowling_ball/scene.gltf")
                ball.setAttribute("scale", {
                    x: 3,
                    y: 3,
                    z: 3
                })

                var cam = document.querySelector("#camera")
                pos = cam.getAttribute("position")
                ball.setAttribute("position", {
                    x: pos.x,
                    y: pos.y - 1.2,
                    z: pos.z,
                })
                var camera = document.querySelector("#camera").object3D

                //get cam direction as 3.js vector
                var direction = new THREE.Vector3()
                camera.getWorldDirection(direction)

                //set velocity and direction
                ball.setAttribute("velocity", direction.multiplyScalar(-10))

                var scene = document.querySelector("#arena")
                //set the ball as dynamic body
                ball.setAttribute("dynamic-body", {
                    shape: "sphere",
                    mass: "10",
                })
                //add the collider event listener to the ball
                ball.addEventListener("collide", this.removeBall)

                scene.appendChild(ball)
            }
        })
    },

    removeBall: function (e) {
        //ball element
        var element = e.detail.body.el

        //element which is hit
        var elementHit = e.detail.body.el

        if (elementHit.id.includes("pin")) {
            //impulse & point vector
            var impulse = new CANNON.Vec3(0, 1, -15)
            var worldPoint = new CANNON.Vec3().copy(
                elementHit.getAttribute("position")
            )

            elementHit.body.applyForce(impulse, worldPoint)

            //remove event listener
            element.removeEventListener("collide",this.removeBall)

            //remove the balls from the scene
            var scene = document.querySelector("#arena")
            scene.removeChild(element)
        }

    },

});