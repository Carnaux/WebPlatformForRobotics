(function () {
	window.Main = {};
	Main.Page = (function () {

		//*-------------------Three.js-------------------------
		var clock = new THREE.Clock();
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);




		var renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		var geometry = new THREE.BoxGeometry(100, 0.1, 100);
		var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		var floor = new THREE.Mesh(geometry, material);
		scene.add(floor);

		var geometry = new THREE.BoxGeometry(1, 3, 1);
		var material = new THREE.MeshBasicMaterial({ color: "rgb(255, 0, 0)" });
		this.baseBraco = new THREE.Mesh(geometry, material);
		scene.add(baseBraco);

		var geometry = new THREE.SphereGeometry(0.2, 32, 32);
		var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
		var pivot1 = new THREE.Mesh(geometry, material);
		pivot1.position.y = 1.5;
		pivot1.position.x = 1.5;

		scene.add(pivot1);

		var geometry = new THREE.BoxGeometry(1, 3, 1);
		var material = new THREE.MeshBasicMaterial({ color: "rgb(255, 0, 0)" });
		this.partebraco = new THREE.Mesh(geometry, material);
		partebraco.rotation.z = -0.8;
		partebraco.position.y = 1.5;
		partebraco.position.x = -1;

		pivot1.add(partebraco);

		var geometry = new THREE.SphereGeometry(0.2, 32, 32);
		var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
		this.pivot2 = new THREE.Mesh(geometry, material);


		var geometry = new THREE.BoxGeometry(1, 3, 1);
		var material = new THREE.MeshBasicMaterial({ color: "rgb(255, 0, 0)" });
		this.antebraco = new THREE.Mesh(geometry, material);



		pivot2.add(antebraco);
		partebraco.add(pivot2);

		antebraco.position.y = 2;
		pivot2.position.y = 2;
		pivot2.rotation.z = -0.9;
		//pivot2.rotation.z = -0.2;

		// instantiate a loader
		var loader = new THREE.JSONLoader();

		// load a resource
		loader.load(
			// resource URL
			'motor.json',
			// onLoad callback
			function (geometry, materials) {
				var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
				var object = new THREE.Mesh(geometry, material);
				scene.add(object);
			},
		);

		camera.position.z = 7;
		floor.position.y = -4;
		var trackballControls = new THREE.TrackballControls(camera);


		var animate = function () {
			requestAnimationFrame(animate);

			var delta = clock.getDelta();

			trackballControls.update(delta);
			constdata();


			renderer.render(scene, camera);
		};

		function constdata() {
			if (boolm1) {
				pivot1.rotation.z -= 0.03490661; // cada sinal são 0,25° do motor
				boolm1 = false;
			} else if (boolm1R) {
				pivot1.rotation.z += 0.03490661;
				boolm1R = false;
			}
			if (boolm2) {
				pivot2.rotation.z -= 0.03490661;
				boolm2 = false;
			} else if (boolm2R) {
				pivot2.rotation.z += 0.03490661;
				boolm2R = false;
			}
		}

		animate();
		//------------------AJAX-------------------------
		var boolm1;
		var boolm1R;
		var boolm2;
		var boolm2R;


		var mosq = null;
		function Page() {
			var _this = this;
			mosq = new Mosquitto();
			var i = 0;

			$('#connect-button').click(function () {
				return _this.connect();
			});
			$('#disconnect-button').click(function () {
				return _this.disconnect();
			});
			$('#subscribe-button').click(function () {
				return _this.subscribe();
			});
			$('#unsubscribe-button').click(function () {
				return _this.unsubscribe();
			});


			$('#liga-output').click(function () {
				var payload = "L";
				var TopicPublish = $('#pub-topic-text')[0].value;
				mosq.publish(TopicPublish, payload, 0);

			});

			$('#liga-output2').click(function () {
				var payload = "L2";
				var TopicPublish = $('#pub-topic-text')[0].value;
				mosq.publish(TopicPublish, payload, 0);

			});

			$('#reverse-output').click(function () {
				var payload = "R";
				var TopicPublish = $('#pub-topic-text')[0].value;
				mosq.publish(TopicPublish, payload, 0);


			});
			$('#reverse-output2').click(function () {
				var payload = "R2";
				var TopicPublish = $('#pub-topic-text')[0].value;
				mosq.publish(TopicPublish, payload, 0);


			});

			$('#desliga-output').click(function () {
				var payload = "D";
				var TopicPublish = $('#pub-topic-text')[0].value;
				mosq.publish(TopicPublish, payload, 0);
				boolm1 = false;
				boolm1R = false;
				console.log("User stopped motor 1");
			});

			$('#desliga-output2').click(function () {
				var payload = "D2";
				var TopicPublish = $('#pub-topic-text')[0].value;
				mosq.publish(TopicPublish, payload, 0);
				boolm2 = false;
				boolm2R = false;

				//setTimeout(function(){   }, 1000);
				console.log("User stopped motor 2");
			});

			mosq.onconnect = function (rc) {
				var p = document.createElement("p");
				var topic = $('#pub-subscribe-text')[0].value;
				p.innerHTML = "Conectado ao Broker!";

				$("#debug").append(p);
				mosq.subscribe(topic, 0);

			};

			mosq.ondisconnect = function (rc) {
				var p = document.createElement("p");
				var url = "ws://iot.eclipse.org/ws";

				p.innerHTML = "A conexão com o broker foi perdida";
				$("#debug").append(p);
				mosq.connect(url);
			};

			mosq.onmessage = function (topic, payload, qos) {
				var p = document.createElement("p");
				var acao = payload[0];
				var c1 = payload[1];
				var c2 = acao + c2;
				var c3 = c2.slice(0, 2);

				//Dados enviados do NODEMCU
				//stopper
				/*if(payload =="SD2"){
					$('#desliga-output2').ready(function() {
						var payload = "D2";
						var TopicPublish = $('#pub-topic-text')[0].value;
						mosq.publish(TopicPublish, payload, 0);
						boolm2 = false;
						console.log("motor 2 reached the end. Stopped by stopper.");
					});
				}*/
				if (payload[0] + payload[1] + payload[2] == "M1V") {
					var tot = payload[3] + payload[4];
					if (tot == 10) {
						this.volt = 80;
						antebraco.material.color.setRGB(12, 222, 35);
					} else if (tot == 53) {
						this.volt = 90;
						antebraco.material.color.setRGB(255, 0, 0);
					}
					//	console.log(tot);
				}
				if (payload == "T") {
					console.log("Mandou o m1r");
				}

				if (payload == "M2R") {
					boolm2 = true;
					console.log("motor 2 is running");
				}

				if (payload == "M2Re") {
					boolm2R = true;
					console.log("motor 2 is running in reverse");
				}

				if (payload == "M1R") {
					boolm2 = true;
					//boolm1 = true;
					console.log("motor 1 is running");
				}

				if (payload == "M1Re") {
					//boolm1R = true;
					boolm2R = true;
					console.log("motor 1 is running in reverse");
				}

				if (c2 == "CN") {
					//	console.log(c3);
				}

				$("#status_io").html(p);
			};
		}

		Page.prototype.connect = function () {
			var url = "ws://iot.eclipse.org/ws";
			mosq.connect(url);
		};
		Page.prototype.disconnect = function () {
			mosq.disconnect();
		};
		Page.prototype.subscribe = function () {
			var topic = $('#sub-topic-text')[0].value;
			mosq.subscribe(topic, 0);
		};
		Page.prototype.unsubscribe = function () {
			var topic = $('#sub-topic-text')[0].value;
			mosq.unsubscribe(topic);
		};

		return Page;
	})();
	$(function () {
		return Main.controller = new Main.Page;
	});
}).call(this);
