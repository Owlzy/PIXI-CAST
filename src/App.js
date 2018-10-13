/**
 * Created by Owlz on 23/09/2018.
 */

import GameScene from "./game/GameScene";

/**
 * @class Simple application class to handle rendering scene etc.
 */
export default class App {
    constructor(width, height) {

        this._width = width;
        this._height = height;

        this._renderer = null;
        this._view = null;

        this._elapsed = null;
        this._dt = null;

        this._activeScene = null;

        this.nextScene = null;

        this._assets = null;

        /**
         * game assets
         * @type {[*]}
         * @private
         */
        this._files = [
            //single texture
            {name: 'wall', uri: './assets/' + 'wall' + '.jpg'},
            {name: 'column', uri: './assets/' + 'column' + '.png'},
        ];
    }

    init() {
        //Define html canvas
        const canvas = document.getElementById("stage");

        //Pixi Stage
        this._stage = new PIXI.Container();

        //Pixi Render setup
        this._renderer = PIXI.autoDetectRenderer(
            this._width, this._height,
            {view: canvas, backgroundColor: 0x000000}
        );

        this._renderer.view.style.position = "absolute";
        this._renderer.autoResize = true;
        this._renderer.resize(window.innerWidth, window.innerHeight);

        // current time and deltaTime
        this._elapsed = Date.now();
        this._dt = 0;

        this.load(this._files);
    }

    update() {
        //calculate the dt
        const now = Date.now();
        this._dt = (now - this._elapsed) * 0.01;
        this._elapsed = now;

        if (this._activeScene) this._activeScene.update(this._dt);

        this._renderer.render(this._stage);//render everything added to the stage

        // Request the next frame
        requestAnimationFrame(() => this.update());
    }

    resize() {
        this._renderer.resize(window.innerWidth, window.innerHeight);
        this._renderer.render(stage);
        if (this._activeScene) this._activeScene.resize();
    }

    /**
     * @param files
     */
    load(files) {
        console.log("files loading");
        const loader = PIXI.loader;

        // loop through array and add them to loader
        for (let i = 0; i < files.length; i++) {
            loader.add(files[i].name, files[i].uri);
        }

        //load files
        loader.load((loader, resources) => {
            console.log("loaded");
            console.log(resources);
            this._assets = resources;
            // Start the update
            const scene = new GameScene();
            console.log(scene);
            this.setActiveScene(scene);
            this.update();
        });
    }

    /**
     * @param scene {Scene}
     */
    setActiveScene(scene) {
        if (this._activeScene) this._stage.removeChild(this._activeScene);
        this._activeScene = scene;
        this._activeScene.app = this;
        this._stage.addChild(this._activeScene);
        this._activeScene.start();
    }

    getTexture(name) {
        return this._assets[name].texture;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get assets() {
        return this._assets;
    }

}
