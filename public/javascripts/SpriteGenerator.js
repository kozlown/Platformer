/**
 * Created by Nigel on 29/11/2016.
 */


class SpriteGenerator {
    static generate( element ){
        let sprite
        switch ( element.type ){
            case "Player":
                sprite = new PIXI.Graphics()
                sprite.lineStyle( 4 , 0xFF3300 , 1 )
                sprite.beginFill( 0x66CCFF )
                sprite.drawRect( 0 , 0 , element.width , element.height )
                sprite.endFill()
                sprite.x = element.position.x
                sprite.y = element.position.y
                break
            case "Ground":
                // TODO

        }
        return sprite
    }
}

module.exports = SpriteGenerator