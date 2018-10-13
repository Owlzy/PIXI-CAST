/**
 * Created by Owlz on 23/09/2018.
 */
export default class Sprite3D {
    constructor(texture) {

        /**
         * @type {PIXI.Point}
         * @private
         */
        this._position = new PIXI.Point();

        /**
         * @type {number}
         * @private
         */
        this._distance = -1;

        /**
         * @type {PIXI.Sprite}
         * @private
         */
        this._view = new PIXI.Sprite(texture);

        /**
         * @type {null}
         * @private
         */
        this._filterUniforms = null;

        /**
         * @type {null}
         * @private
         */
        this._filter = null;
    }

    calcDist(player) {
        //distance is only used for sorting so no need to square root
        this._distance = (player.x - this.x) * (player.x - this.x) + (player.y - this.y) * (player.y - this.y);
        return this._distance;
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

    get distance() {
        return this._distance;
    }

    get view() {
        return this._view;
    }

    get visible() {
        return this._view.visible;
    }

    set visible(bool) {
        this._view.visible = bool;
    }

    get filterUniforms() {
        return this._filterUniforms;
    }

    set filterUniforms(val) {
        this._filterUniforms = val;
    }

    get filter() {
        return this._filter;
    }

    set filter(val) {
        this._filter = val;
    }
}