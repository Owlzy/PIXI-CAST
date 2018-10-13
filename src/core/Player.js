/**
 * Created by Owlz on 23/09/2018.
 */

import Entity3D from "./Entity3D";
import Camera from "./Camera";

export default class Player extends Entity3D {
    constructor(map) {
        super();

        this.moveState = -1;
        this.rotState = -1;

        this.STATE_MOVE = {
            NONE: 0,
            FORWARD: 1,
            BACK: 2
        };

        this.STATE_ROT = {
            NONE: 0,
            LEFT: 1,
            RIGHT: 2
        };

        /**
         * @type {Map}
         * @private
         */
        this._map = map;

        /**
         * @type {Camera}
         * @private
         */
        this._camera = new Camera(map, this);

        /**
         * Players world position
         * @type {PIXI.Point}
         * @private
         */
        this._position = new PIXI.Point(1.5, 1.5);

        /**
         * Player / Camera facing direction
         * @type {PIXI.Point}
         * @private
         */
        this._dir = this._camera.direction;

        /**
         * @type {number}
         * @private
         */
        this._moveSpeed = 0.4;

        /**
         * @type {number}
         * @private
         */
        this._rotSpeed = 0.2;

        /**
         * @type {number}
         * @private
         */
        this._yAdjust = 1;

        //--rotate to desired start rotation--//
        this.rotate(Math.PI);

        //bind events
        document.addEventListener("keydown", (e) => this.onKeyDown(e));
        document.addEventListener("keyup", (e) => this.onKeyUp(e));
    }

    onKeyDown(e) {
        if (e.keyCode === 87) {
            this.moveState = this.STATE_MOVE.FORWARD;
        }
        else if (e.keyCode === 83) {
            this.moveState = this.STATE_MOVE.BACK;
        }
        else if (e.keyCode === 65) {
            this.rotState = this.STATE_ROT.LEFT;
        }
        else if (e.keyCode === 68) {
            this.rotState = this.STATE_ROT.RIGHT;
        }
    }

    onKeyUp(e) {
        if (e.keyCode === 87) {
            this.moveState = this.STATE_MOVE.NONE;
        }
        else if (e.keyCode === 83) {
            this.moveState = this.STATE_MOVE.NONE;
        }
        else if (e.keyCode === 65) {
            this.rotState = this.STATE_ROT.NONE;
        }
        else if (e.keyCode === 68) {
            this.rotState = this.STATE_ROT.NONE;
        }
    }

    start() {
        this._camera.update();
    }

    moveForward(dt) {
        const map = this._map.grid;
        if (map[Math.floor(this.x + this.dirX * this._moveSpeed * 4 * dt)] &&        //check for collision
            map[Math.floor(this.x + this.dirX * this._moveSpeed * 4 * dt)][Math.floor(this.y)] === 0) {
            this.x += this.dirX * this._moveSpeed * dt;
        }
        if (map[Math.floor(this.x)][Math.floor(this.y + this.dirY * this._moveSpeed * 4 * dt)] === 0) {
            this.y += this.dirY * this._moveSpeed * dt;
        }
    }

    moveBack(dt) {
        const map = this._map.grid;
        if (map[Math.round(this.x - this.dirX * this._moveSpeed * 4 * dt)] &&        //check for collision
            map[Math.round(this.x - this.dirX * this._moveSpeed * 4 * dt)][Math.round(this.y)] === 0) {
            this.x -= this.dirX * this._moveSpeed * dt;
        }
        if (map[Math.round(this.x)][Math.round(this.y - this.dirY * this._moveSpeed * 6 * dt)] === 0) {
            this.y -= this.dirY * this._moveSpeed * dt;
        }
    }

    update(dt) {
        switch (this.moveState) {
            case this.STATE_MOVE.FORWARD: {
                this.moveForward(dt);
                break;
            }
            case this.STATE_MOVE.BACK: {
                this.moveBack(dt);
                break;
            }
        }
        switch (this.rotState) {
            case this.STATE_ROT.LEFT: {
                this.rotate(this._rotSpeed * dt);
                break;
            }
            case this.STATE_ROT.RIGHT: {
                this.rotate(-this._rotSpeed * dt);
                break;
            }
        }

        this._camera.update();
    }

    rotate(angle) {
        //both camera direction and camera plane must be rotated
        const oldDirX = this.dirX;
        this.dirX = this.dirX * Math.cos(angle) - this.dirY * Math.sin(angle);
        this.dirY = oldDirX * Math.sin(angle) + this.dirY * Math.cos(angle);

        const plane = this._camera.plane;
        const oldPlaneX = plane.x;
        plane.x = plane.x * Math.cos(angle) - plane.y * Math.sin(angle);
        plane.y = oldPlaneX * Math.sin(angle) + plane.y * Math.cos(angle);
    }

    get yAdjust() {
        return this._yAdjust;
    }

    set yAdjust(val) {
        this._yAdjust = val;
    }

    get camera() {
        return this._camera;
    }
}