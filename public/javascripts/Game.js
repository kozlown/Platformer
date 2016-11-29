/**
 * Created by Nigel on 29/11/2016.
 */

class Game {
    /**
     * @constructor
     * @param {Object} startingGameInfos
     */
    constructor ( startingGameInfos ){

        this.currentGameInfos = startingGameInfos
        this.update(startingGameInfos)

    }

    /**
     * @method update
     * @description Update the game with (new) informations
     * @param {Object} gameUpdateInfos
     */
    update( gameUpdateInfos ){

        // update all locals pseudo PhysicalElements (and their corresponding Sprites)
        _.each( gameUpdateInfos.physicalElements , ( physicalElement )=>{

            // if the PhysicalElement is already known and has a sprite
            if (this.getPhysicalElement(physicalElement)){

                // update the local pseudo PhysicalElement (and his corresponding Sprite) from the pseudo PhysicalElement infos
                this.updatePhysicalElement(physicalElement);

            }
            else {

                // else create a Sprite from the pseudo PhysicalElement infos
                this.createElement(physicalElement)

            }

        } )

    }

    /**
     * @method getElement
     * @description get the local pseudo PhysicalElement which corresponds
     * with the pseudo PhysicalElement sent by server and check if the sprite exists.
     * @param {Object} element
     * @returns
     * {Object} the local pseudo PhysicalElement if it exists and has a sprite
     * else {Boolean} false
     */
    getPhysicalElement ( element ){

        _.each( this.currentGameInfos.physicalElements , ( _element )=>{

            if ( _element.id === element && !_.isUndefined(_element.sprite))
                return _element

        } )

        return false
    }

    /**
     * @method updatePhysicalElement
     * @description Update the local pseudo PhysicalElement wich corresponds
     * with the pseudo PhysicalElement sent by server. (position & size & sprite)
     * @param {Object} element
     */
    updatePhysicalElement ( element ){
        // TODO
    }
}