/**
 * Created by Owlz on 23/09/2018.
 */
//--note zero is non wall, so start counting from 1, not zero--//
//todo - multi wall textures
const wallTex = [
    "fence",//1:
    "house_wall",// 2:
    "house_door"//  3:
];

//--sliced up textures class--//
export default class Textures {
    constructor(texture) {
        /**
         * @type {null}
         * @private
         */
        this._wallTextures = [];

        this._tex = texture;

        this.init();
    }

    init() {
        const texWid = this._tex.width;
        const texHei = this._tex.height;

        const len = wallTex.length;
        //--do wall textures--//
        for (let i = 0; i < len; i++) {
            const texTile = this._tex;
            const texArr = new Array(texWid);
            for (let x = 0; x < texWid; x++) {
                texArr[x] = new PIXI.Texture(texTile, new PIXI.Rectangle(x, 0, 1, texHei));
            }
            this._wallTextures.push(texArr);
        }
    }

    /**
     * @returns {Array<PIXI.Texture>|null}
     */
    get wallTextures() {
        return this._wallTextures;
    }
}