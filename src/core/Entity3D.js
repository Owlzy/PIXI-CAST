/**
 * Created by Owlz on 23/09/2018.
 */
/**
 * A super class representing an entity that exists in 3D space for all other 3D classes to extend from
 * @class
 */
export default class Entity3D {
    constructor() {

        /**
         * Players world position
         * @type {!PIXI.Point}
         * @private
         */
        this._position = null;

        /**
         * Player facing direction
         * @type {!PIXI.Point}
         * @private
         */
        this._dir = null;
    }

    get x() {
        return this._position.x;
    }

    set x(float) {
        this._position.x = float;
    }

    get y() {
        return this._position.y;
    }

    set y(float) {
        this._position.y = float;
    }

    get dirX() {
        return this._dir.x;
    }

    set dirX(float) {
        this._dir.x = float;
    }

    get dirY() {
        return this._dir.y;
    }

    set dirY(float) {
        this._dir.y = float;
    }

    get direction() {
        return this._dir;
    }
}
