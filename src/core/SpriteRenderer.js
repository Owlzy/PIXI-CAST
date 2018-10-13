/**
 * Created by Owlz on 23/09/2018.
 */
const frag = "precision mediump float;\r\n\r\nvarying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform float startX;\r\nuniform float endX;\r\n\r\nvoid main(void)\r\n{\r\n\tvec4 pixel = texture2D(uSampler, vTextureCoord);\r\n\tfloat fragX = gl_FragCoord.x;\r\n\r\n\tif(fragX < startX || fragX > endX){\r\n\t\tpixel *= 0.0;\r\n\t}\r\n\r\n\tgl_FragColor = pixel;\r\n}";

export default class SpriteRenderer extends PIXI.Filter {
    constructor() {
        super(null, frag);
        this.uniforms.startX = -9999;//init to high numbers (this is invisible)
        this.uniforms.endX = 9999;
    }

    get startX() {
        return this.uniforms.startX;
    }

    set startX(val) {
        this.uniforms.startX = val;
    }

    get endX() {
        return this.uniforms.endX;
    }

    set endX(val) {
        this.uniforms.endX = val;
    }
}