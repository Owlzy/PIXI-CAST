/**
 * Created by Owlz on 23/09/2018.
 */
import Entity3D from "./Entity3D";

export default class Ray extends Entity3D {
    constructor() {
        super();
        /**
         * @type {PIXI.Point}
         * @private
         */
        this._position = new PIXI.Point();

        /**
         * @type {PIXI.Point}
         * @private
         */
        this._dir = new PIXI.Point();
    }
}