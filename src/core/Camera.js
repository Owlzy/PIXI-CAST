/**
 * Created by Owlz on 23/09/2018.
 */

import Entity3D from "./Entity3D";
import Ray from "./Ray";

const zBuffer = new Array(600);

//todo - probably bad optimisation picked up from else where without testing, make a class or some other object instead
//--caching all casting variables (optimisation)--//
//--ray cast vars--//
let cameraX, mapX, mapY, deltaDistX, deltaDistY, stepX, stepY, hit, side, sideDistX, sideDistY, perpWallDist,
    lineHeight, drawStart, drawEnd, wallX, texX;
//--sprite cast vars--//
let drawStartY, drawEndY, drawStartX, drawEndX, spriteWid, spriteX, spriteY, invDet, transformX, transformY,
    spriteScreenX, spriteHei;

/**
 * Class representing a 3D style camera using ray casting and other techniques seen in old "2.5D" games, largely
 * adapted from a cpp tutorial :- http://lodev.org/cgtutor/raycasting.html
 * @class
 */
export default class Camera extends Entity3D {
    constructor(map, player) {
        super();

        /**
         * @type {Player}
         * @private
         */
        this._player = player;

        /**
         * A 2d raycaster version of a 3D camera plane
         *
         * FROM :- http://lodev.org/cgtutor/raycasting.html
         * The ratio between the length of the direction and the camera plane determinates the FOV,
         * here the direction vector is a bit longer than the camera plane, so the FOV will be smaller than 90�
         * (more precisely, the FOV is 2 * atan(0.66/1.0)=66�, which is perfect for a first person shooter game).
         *
         * @type {PIXI.Point}
         * @private
         */
        this._plane = new PIXI.Point(0, 0.66);


        /**
         * @type {PIXI.Point}
         * @private
         */
        this._dir = new PIXI.Point(-1, 0);

        /**
         * @type {Ray}
         * @private
         */
        this._ray = new Ray();

        /**
         * @type {Map}
         * @private
         */
        this._map = map;

        /**
         * @type {Array<PIXI.Sprite>}
         * @private
         */
        this._sprites = map.sprites;

        /**
         * @type {Array<PIXI.Texture>}
         * @private
         */
        this._textures = map.wallTextures;

        //  console.log(this._textures);

        /**
         * @type {Array<PIXI.Texture>}
         * @private
         */
        this._floorTextures = map.floorTextures;

        /**
         * @type {Array}
         * @private
         */
        this._zBuffer = new Array(600);

        /**
         * Buffer container hit point for rays cast
         * @type {Array}
         * @private
         */
        this._hitBuffer = new Array(800);

        /**
         * Compute and store camera angles at the beginning
         * @type {Array}
         * @private
         */
        this._camPreCalc = new Array(800);
        this.initCamPreCalc();

        this._resolution = 800;
    }

    initCamPreCalc() {
        for (let x = 0; x < 800; x++) {
            this._camPreCalc[x] = 2 * x / 800 - 1;
        }
    }

    update() {
        this.castLevel(this._map.grid, this.lines, 0);
        this.castSprites();
    }

    castLevel(grid, lines, lvlNum) {

        const h = 600, yAdjust = this._player.yAdjust;
        for (let x = 0; x < 800; x++) {
            cameraX = this._camPreCalc[x];

            this._ray.x = this._player.x; //ray starts at players position
            this._ray.y = this._player.y; //--
            this._ray.dirX = this.dirX + this._plane.x * cameraX; //rayDirX = dirX + planeX * cameraX;
            this._ray.dirY = this.dirY + this._plane.y * cameraX;

            //--DDA algorithm setting up some variables--//
            //which box of the map we're in
            mapX = Math.floor(this._ray.x);
            mapY = Math.floor(this._ray.y);

            //length of ray from one x or y-side to next x or y-side
            deltaDistX = Math.sqrt(1 + (this._ray.dirY * this._ray.dirY) / (this._ray.dirX * this._ray.dirX));
            deltaDistY = Math.sqrt(1 + (this._ray.dirX * this._ray.dirX) / (this._ray.dirY * this._ray.dirY));

            //what direction to step in x or y-direction (either +1 or -1)
            hit = 0;//was there a wall hit?
            side = undefined; //was a NS or a EW wall hit?

            //length of ray from current position to next x or y-side
            sideDistX = sideDistY = undefined;

            //calculate step and initial sideDist
            if (this._ray.dirX < 0) {
                stepX = -1;
                sideDistX = (this._ray.x - mapX) * deltaDistX;
            } else {
                stepX = 1;
                sideDistX = (mapX + 1 - this._ray.x) * deltaDistX;
            }
            if (this._ray.dirY < 0) {
                stepY = -1;
                sideDistY = (this._ray.y - mapY) * deltaDistY;
            } else {
                stepY = 1;
                sideDistY = (mapY + 1 - this._ray.y) * deltaDistY;
            }

            //--perform DDA--//
            while (hit === 0) {
                //jump to next map square, OR in x-direction, OR in y-direction
                if (sideDistX < sideDistY) {
                    sideDistX += deltaDistX;
                    mapX += stepX;
                    side = 0;
                } else {
                    sideDistY += deltaDistY;
                    mapY += stepY;
                    side = 1;
                }
                //Check if ray has hit a wall
                if (grid[Math.round(mapX)][Math.round(mapY)] > 0) hit = 1;
            }

            //Calculate distance projected on camera direction (oblique distance will give fisheye effect!)
            perpWallDist = undefined; //perpendicular wall dist
            if (side === 0) {
                perpWallDist = Math.abs((mapX - this._ray.x + (1 - stepX) * 0.5) / this._ray.dirX);
            } else {
                perpWallDist = Math.abs((mapY - this._ray.y + (1 - stepY) * 0.5) / this._ray.dirY);
            }

            //Calculate height of line to draw on screen
            lineHeight = Math.abs(Math.round(h / perpWallDist));

            //calculate lowest and highest pixel to fill in current stripe
            drawStart = (-lineHeight * 0.5 + h * 0.5) * yAdjust;
            // drawEnd = (lineHeight * 0.5 + h * 0.5) * 0.5;//unneeded

            wallX = undefined;
            if (side === 1) {
                wallX = this._ray.x + ((mapY - this._ray.y + (1 - stepY) * 0.5) / this._ray.dirY) * this._ray.dirX;
            } else {
                wallX = this._ray.y + ((mapX - this._ray.x + (1 - stepX) * 0.5) / this._ray.dirX) * this._ray.dirY;
            }
            wallX -= Math.floor(wallX);

            texX = Math.floor(wallX * this.textureSize);
            if (side === 0 && this._ray.dirX > 0 || side === 1 && this._ray.dirY < 0) {
                texX = this.textureSize - texX - 1;
            }

            //grab the correct wall slice
            const line = lines[x];

            //--nice simple way to render the textures efficiently in pixi.js--//
            //--courtesy - https://github.com/lewispollard/pixi-raycast--//

            // Pixi has easy tinting with hex values, let's use this to build a primitive
            // lighting system. Start out with a white (invisible) tint
            line.tint = 0xFFFFFF;
            if (side === 1) {
                // give one orientation of wall a darker tint for contrast
                line.tint -= 0x222222;
            }

            Camera.lightSprite(line, perpWallDist);
            //set the texture
            line.texture = this._textures[grid[Math.round(mapX)][Math.round(mapY)] - 1][texX];
            line.y = drawStart - (lineHeight * lvlNum);
            line.height = lineHeight;//they are the same value so use this for less calculation

            if (lvlNum === 0) {
                //--store distance for each ray in z buffer for calculating sprites scales--//
                zBuffer[x] = perpWallDist;// {distance: perpWallDist, side: side};

                //bit cheeky but a lazy way of doing shooting is take the map x y and add some random values
                this._hitBuffer[x] = {x: mapX + Math.random(), y: mapY + Math.random()};
            }
        }
    }

    castSprites() {
        //====SPRITE CASTING BEGIN====//
        const h = this.app.height, yAdjust = this._player.yAdjust;
        const len = this._sprites.length;
        for (let i = 0; i < len; i++) {

            //translate sprite position relative to camera
            spriteX = this._sprites[i].x - this._player.x;
            spriteY = this._sprites[i].y - this._player.y;

            //-----------transform sprite with the inverse of the camera matrix-------------//
            // [ planeX   dirX ] -1                                       [ dirY      -dirX ]
            // [               ]       =  1/(planeX*dirY-dirX*planeY) *   [                 ]
            // [ planeY   dirY ]                                          [ -planeY  planeX ]

            invDet = 1 / (this._plane.x * this.dirY - this.dirX * this._plane.y);//required for correct matrix multiplication (inverse determinate)

            transformX = invDet * (this.dirY * spriteX - this.dirX * spriteY);
            transformY = invDet * (-this._plane.y * spriteX + this._plane.x * spriteY);//this is actually the depth inside the screen, that what Z is in 3D

            if (transformY < 0) {//optimisation, if sprite is behind us (negative z dist) then no need to go any further
                this._sprites[i].visible = false;
                continue;
            } else {
                this._sprites[i].visible = true;
            }

            spriteScreenX = Math.floor((this._resolution * 0.5) * (1 + transformX / transformY));

            //calc height of the sprite on screen
            spriteHei = Math.abs(Math.floor(h / transformY));//using transform y instead of real distance prevents fish eye
            //calculate lowest and highest pixel to fill in current stripe
            drawStartY = -spriteHei * 0.5 + h * 0.5;

            drawEndY = spriteHei / 2 + h / 2;
            if (drawEndY >= h) drawEndY = h - 1;

            //calculate width of the sprite
            spriteWid = Math.abs(Math.floor(h / (transformY)));
            drawStartX = -spriteWid * 0.5 + spriteScreenX;
            drawEndX = spriteWid / 2 + spriteScreenX;
            drawStartY *= yAdjust;//adjust sprite height for jump / crouch

            //--fixes bug where had 0.5's as values (caused ray check loop to get skipped and the sprite to "flicker")
            drawStartX = Math.floor(drawStartX);//should be floor?
            drawEndX = Math.floor(drawEndX);

            //--set scale and screen position--//
            this._sprites[i].view.x = drawStartX;
            this._sprites[i].view.y = drawStartY;
            this._sprites[i].view.height = spriteHei;
            this._sprites[i].view.width = spriteWid;

            this._sprites[i].filter.startX = -9999;//reset filter uniforms (fully not visible)
            this._sprites[i].filter.endX = 9999;

            if (drawStart < 0) {
                drawStart = 0;
            }
            if (drawEndX >= this._resolution) {
                drawEndX = this._resolution - 1;
            }

            //note, above should fix the to do below, but having tested it seems it doesn't?  todo check this
            //todo fix this hack
            //--dodgy fix (was getting huuuuge difference in the numbers, like huge as in close to max int, basically created an infinite loop--//
            if (drawEndX - drawStartX > 2000) {
                drawStartX = 0;
                drawEndX = 0;
            }

            let foundStart = false, foundEnd = false;
            for (let ray = drawStartX; ray < drawEndX; ray++) {
                if (transformY < zBuffer[ray] && !foundStart) {
                    this._sprites[i].filter.startX = ray;
                    foundStart = true;
                }
                if (transformY > zBuffer[ray] && !foundEnd) {
                    this._sprites[i].filter.endX = ray;
                    foundEnd = true;
                }
                if (foundStart && foundEnd) break;
            }

            if (foundStart && foundEnd) {
                //fucking hacks.. below fix for sprites popping into existence when wall is on LHS, is garbage (though it does work)
                //todo improve / incorporate into above loop
                if (this._sprites[i].filter.startX > this._sprites[i].filter.endX) {
                    foundStart = false, foundEnd = false;
                    for (let ray = drawStartX; ray < drawEndX; ray++) {//because it really shouldn't be running this loop again, skip every other ray to speed things up a bit
                        if (transformY < zBuffer[ray] && !foundStart) {
                            this._sprites[i].filter.startX = ray;
                            foundStart = true;
                        }
                        if (transformY > zBuffer[ray] && foundStart && !foundEnd) {
                            this._sprites[i].filter.endX = ray;
                            foundEnd = true;
                        }
                        if (foundStart && foundEnd) break;
                    }

                    if (this._sprites[i].filter.startX > this._sprites[i].filter.endX) {
                        this._sprites[i].filter.endX = 9999;
                    }
                }
            }

            this._sprites[i].view.tint = 0xFFFFFF;//clear previous tint
            //and add a bit of lighting
            Camera.lightSprite(this._sprites[i].view, transformY);
        }
    }


    /**
     * Lights the display object passed to it according to sprites zDepth
     * @param sprite
     * @param zDepth
     */
    static lightSprite(sprite, zDepth) {
        const shadowDepth = 6; //increasing shadow depth will make the level darker
        sprite.tint -= (0x010101 * Math.round(zDepth * shadowDepth)); //tint darker the further away it is
        if (sprite.tint <= 0x000000) {
            sprite.tint = 0x000000;
        }
    }

    set sprites(val) {
        this._sprites = val;
    }

    get hitBuffer() {
        return this._hitBuffer;
    }

    get plane() {
        return this._plane;
    }
}
