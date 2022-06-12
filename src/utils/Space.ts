import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "eventemitter3";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SpaceEventEnum } from "./constant-enum";
import { Object3D } from "three";

export default class Space extends EventEmitter {
  options: any;
  container: HTMLElement;
  width: number;
  height: number;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  orbit: OrbitControls | undefined;
  animateFunWrap: () => void;

  constructor(container: HTMLElement, options?: any) {
    super();
    console.log("init space.", this);
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight;
    if (this.height === 0) {
      console.warn("container height is 0.");
    }
    this.options = options;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x222222);
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    container.appendChild(this.renderer.domElement);
    this.initOrbit();

    this.clock = new THREE.Clock();
    this.animateFunWrap = this.animateFun.bind(this);
    this.animateFun();
  }

  initDemo() {
    // 为了方便测试的demo效果
    const scene = this.scene;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    this.on(SpaceEventEnum.animate, () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    });
  }

  initOrbit() {
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.z = 5;

    const TOUCH = THREE.TOUCH;
    this.orbit.touches.ONE = TOUCH.PAN;
    this.orbit.touches.TWO = TOUCH.DOLLY_ROTATE;

    // 平面panning
    this.orbit.screenSpacePanning = true;

    // 用户操作 触发orbit改变，发出事件
    this.orbit.addEventListener("change", () => {
      this.emit(SpaceEventEnum.orbitChange);
    });
    this.on(SpaceEventEnum.animate, () => {
      if (this.orbit) {
        this.orbit.update();
      }
    });
    this.orbit.update();
  }

  initGrid() {
    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);
    this.scene.add(gridHelper);
  }

  animateFun() {
    // 使用前需要 this.animateFunWrap = this.animateFun.bind(this);
    requestAnimationFrame(this.animateFunWrap);
    const delta = this.clock.getDelta();
    this.emit(SpaceEventEnum.animate, delta);
    this.renderer.render(this.scene, this.camera);
  }

  loadGLTF(url: string) {
    const scene = this.scene;
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          // clearScene(scene);
          scene.add(gltf.scene);
          // TODO: 调整灯光
          const light = new THREE.HemisphereLight(0xffffff, 0xcccccc, 1);
          scene.add(light);
          resolve("");
        },
        undefined,
        reject
      );
    }).catch((err) => {
      let errMessage = "加载模型失败:";
      if (err.message.includes("Failed to load buffer")) {
        errMessage +=
          "单个gltf文件加载，如果是gltf separate文件会导致无法加载其它资源。";
        console.warn(
          "提示：单个gltf文件加载，如果是gltf separate文件会导致无法加载其它资源。"
        );
      }
      console.log("加载模型失败:", err);
      return Promise.reject(new Error(errMessage));
    });
  }

  toImage() {
    return this.renderer.domElement.toDataURL("image/jpeg", 0.5);
  }

  frameTargetView(target: Object3D) {
    const camera = this.camera;
    const orbit = this.orbit;
    const box = new THREE.Box3();
    const sphere = new THREE.Sphere();
    const center = new THREE.Vector3();
    const delta = new THREE.Vector3(1, 1, 1);

    box.setFromObject(target);
    const distance = box.getBoundingSphere(sphere).radius;
    box.getCenter(center);
    delta.multiplyScalar(distance);
    const endPosition = center.add(delta);
    camera.position.copy(endPosition);
    if (orbit) {
      orbit.target.copy(target.position);
      // camera 与 target 位置不能相同，否则 无法移动
      const position = this.camera.position;
      const targetPosition = target.position;
      if (
        position.x === targetPosition.x &&
        position.y === targetPosition.y &&
        position.z === targetPosition.z
      ) {
        position.x = targetPosition.x + 1;
      }
      orbit.update();
    }

    return {
      distance: distance,
      box: box,
      center: center,
    };
  }

  dispose() {
    console.log("dispose space");
  }
}
