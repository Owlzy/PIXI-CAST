/**
 * Created by Owlz on 23/09/2018.
 */

import Scene from "./Scene";
import Player from "../core/Player"
import WorldMap from "../core/WorldMap"

export default class GameScene extends Scene {
    constructor() {
        super();

        /**
         * @type {number}
         * @private
         */
        this._resolution = null;

        /**
         * @type {Array}
         * @private
         */
        this._lines = [];

        /**
         * @type {WorldMap}
         * @private
         */
        this._map = null;

        /**
         * @type {Player}
         * @private
         */
        this._player = null;

        /**
         * @type {PIXI.Container}
         * @private
         */
        this._spriteLayer = new PIXI.Container();
    }

    start() {
        super.start();

        this._resolution = this.app.width;

        const texture = this.app.getTexture("wall");
        this._map = new WorldMap(texture);
        this._map.initSprites(this._spriteLayer, this.app);

        this._player = new Player(this._map);

        this._player.camera.lines = this._lines;
        this._player.camera.textureSize = texture.width;
        this._player.camera.app = this.app;

        this.initSlices(this);
        this.addChild(this._spriteLayer);
    }

    update(dt) {
        super.update(dt);
        this._player.update(dt);
        this._spriteLayer.children.sort((a, b) => {
            return b.y - a.y;
        });
    }

    resize() {
        super.resize();
    }


    initSlices(gameHolder) {
        // Create wall 'slice' sprites (for each ray)
        for (let x = 0; x < this._resolution; x++) {
            let slice = new PIXI.Sprite(this._map.wallTextures[0][1]);//doesn't matter which texture we use here, is just for init, we will swap the textures later
            slice.x = x;
            gameHolder.addChild(slice);
            this._lines.push(slice);
        }
    }
}