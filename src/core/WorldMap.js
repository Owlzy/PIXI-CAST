/**
 * Created by Owlz on 23/09/2018.
 */
import Textures from "./Textures";
import Sprite3D from "./Sprite3D";
import SpriteRenderer from "./SpriteRenderer";

const spriteData = [
    {x: 10.5, y: 2.5, type: "column"},
    {x: 10.25, y: 2.5, type: "column"},
    {x: 10.75, y: 2.25, type: "column"},
    {x: 5.5, y: 1.5, type: "column"},
    {x: 6.5, y: 1.25, type: "column"},
    {x: 7.5, y: 1.75, type: "column"},
    {x: 6.15, y: 9.5, type: "column"},
    {x: 6.85, y: 9.5, type: "column"},
    {x: 7.5, y: 6.5, type: "column"},
    {x: 7.25, y: 6.25, type: "column"},
    {x: 4.5, y: 12.5, type: "column"},
    {x: 8.5, y: 12.5, type: "column"},
];

//x goes down grid, y goes across grid
const mapData = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 3, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 2, 2, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 3, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 2, 2, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 0, 0, 0, 0, 5, 0, 4, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export default class WorldMap {
    constructor(tex) {

        /**
         * @type {Uint8Array}
         * @private
         */
        this._grid = mapData;

        /**
         * @type {Textures}
         * @private
         */
        this._textures = new Textures(tex);

        /**
         * @type {Array}
         * @private
         */
        this._sprites = [];
    }

    initSprites(holder, app) {
        const len = spriteData.length;
        for (let i = 0; i < len; i++) {
            let sp = new Sprite3D(app.getTexture(spriteData[i].type));
            sp.x = spriteData[i].x;
            sp.y = spriteData[i].y;
            let filter = new SpriteRenderer();
            sp.view.filters = [filter];
            sp.filter = filter;
            holder.addChild(sp.view);
            this._sprites.push(sp);
        }
    }

    get length() {
        return this._grid.length;
    }

    get grid() {
        return this._grid;
    }

    get wallTextures() {
        return this._textures.wallTextures;
    }

    get floorTextures() {
        return this._textures.floorTextures;
    }

    get sprites() {
        return this._sprites;
    }

    get playerPath() {
        return this._path;
    }
}