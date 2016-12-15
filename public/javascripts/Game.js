/**
 * Created by Nigel on 29/11/2016.
 */
let SpriteGenerator = require("./SpriteGenerator.js")

class Game {

    /**
     * @constructor
     * @param {Number} width
     * @param {Number} height
     * @param {String} renderContainerSelector
     * @param {Object} startingGameInfos
     */
    constructor ( width , height , renderContainerSelector , startingGameInfos ){
        /*
            Renderer
         */
        this.renderer = PIXI.autoDetectRenderer( width , height , {
            antialias: false,
            transparent: false,
            resolution: 1
        } );

        // Add the canvas to the HTML document
        $( renderContainerSelector ).append( this.renderer.view );

        // Create a container object called the `stage`
        this.stage = new PIXI.Container( );

        // zoom setting
        this.stage.scale.x = 0.5
        this.stage.scale.y = 0.5

        // zoom handler
        $( renderContainerSelector ).on("mousewheel",(e)=>{
            if ((this.stage.scale.x+e.originalEvent.wheelDelta/1000)>0.3 && (this.stage.scale.x+e.originalEvent.wheelDelta/1000)<3){
                this.stage.scale.x += e.originalEvent.wheelDelta/1000
                this.stage.scale.y += e.originalEvent.wheelDelta/1000
            }
            else if ((this.stage.scale.x+e.originalEvent.wheelDelta/1000)<0.3){
                this.stage.scale.x = 0.3
                this.stage.scale.y = 0.3
            }
            else if ((this.stage.scale.x+e.originalEvent.wheelDelta/1000)>3){
                this.stage.scale.x = 3
                this.stage.scale.y = 3
            }
        })

        this.currentGameInfos = {
            physicalElements : []
        }
        this.update(startingGameInfos)

    }
    
    /**
     * @method destroy
     * @description completely delete the game
     */
    destroy(){
        clearInterval(this.fpsDisplayer)
        this.renderer.destroy(true)
    }

    /**
     * @method update
     * @description Update the game with (new) informations
     * @param {Object} gameUpdateInfos
     */
    update( gameUpdateInfos ){

        // set the position of the camera
        this.setCameraPosition( gameUpdateInfos.playerPosition )

        // clean : remove physicalElements that aren't in the updateInfos
        this.clean( gameUpdateInfos )

        // update all locals pseudo PhysicalElements (and their corresponding Sprites)
        _.each( gameUpdateInfos.physicalElements , ( physicalElement )=>{

            // if the PhysicalElement is already known and has a sprite
            if (this.getPhysicalElement(physicalElement)){

                // update the local pseudo PhysicalElement (and his corresponding Sprite) from the pseudo PhysicalElement infos
                this.updatePhysicalElement(physicalElement);

            }
            else {

                // else create a Sprite from the pseudo PhysicalElement infos
                this.createPhysicalElement(physicalElement)

            }

        } )

        // set the mask of cameras for all sprites
        this.setMasks()

        // render the stage
        this.renderer.render( this.stage );

    }

    /**
     * @method getElement
     * @description get the local pseudo PhysicalElement which corresponds
     * with the pseudo PhysicalElement given and check if the sprite exists.
     * @param {Object} element
     * @returns
     * {Object} the local pseudo PhysicalElement if it exists and has a sprite
     * else {Boolean} false
     */
    getPhysicalElement ( element ){

        let retour = false

        _.each( this.currentGameInfos.physicalElements , ( _element , index )=>{

            if ( _element.id === element.id && !_.isUndefined(_element.sprite)){

                retour = this.currentGameInfos.physicalElements[index]

            }


        } )

        return retour

    }

    /**
     * @method updatePhysicalElement
     * @description Update the local pseudo PhysicalElement wich corresponds
     * with the pseudo PhysicalElement given. (position & sprite)
     * @param {Object} element
     */
    updatePhysicalElement ( element ){

        _.each(this.currentGameInfos.physicalElements, ( _element , index )=>{

            if ( _element.id === element.id ){

                this.currentGameInfos.physicalElements[index].sprite.setTransform(element.position.x - element.width / 2, element.position.y - element.height / 2);

            }

        } )

    }

    /**
     * @method createPhysicalElement
     * @description Create the local pseudo PhysicalElement wich corresponds
     * with the pseudo PhysicalElement sent by server. (position & size & sprite)
     * @param {Object} element
     */
    createPhysicalElement ( element ){

        let index = this.currentGameInfos.physicalElements.push(element)-1

        this.currentGameInfos.physicalElements[index].sprite = SpriteGenerator.generate( element )

        this.stage.addChild( this.currentGameInfos.physicalElements[index].sprite )

    }

    /**
     * @method setCameraPosition
     * @description set the camera position (stage's position)
     * @param {Object} position
     */
    setCameraPosition( playerPosition ){

        this.stage.position.x = playerPosition.x * this.stage.scale.x + this.renderer.width / 2
        this.stage.position.y = playerPosition.y * this.stage.scale.y + this.renderer.height / 2

    }

    /**
     * @method clean
     * @description remove all elements that should not be there
     * @param {Object} gameUpdateInfos
     */
    clean( gameUpdateInfos ){
        let stage = this.stage
        this.currentGameInfos.physicalElements = _.filter(this.currentGameInfos.physicalElements, (value, key, collection)=>{
            let isInside = false
            _.each( gameUpdateInfos.physicalElements , ( value2 )=>{
                if (value.id === value2.id){
                    isInside = true
                }
            })
            // if he's not inside, remove it from the stage
            if (!isInside) stage.removeChild( value.sprite )

            return isInside
        })

    }

    /**
     * @method setMasks
     * @description set the masks for all sprites (which should be the camera)
     */
    setMasks(  ){

        _.each( this.currentGameInfos.physicalElements , ( physicalElement )=>{

            // if it's not the camera
            if (physicalElement.type !== "Camera"){

                _.each( this.currentGameInfos.physicalElements , ( value , key , collection )=>{

                    // if it's the camera and the physicalElement has already a sprite
                    if (value.type === "Camera" && physicalElement.sprite){

                        // set the mask of the physicalElement to the camera's field
                        physicalElement.sprite.mask = value.sprite
                    }
                })
            }
        })
    }
}

module.exports = Game