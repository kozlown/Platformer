/**
 * Created by Nigel on 29/11/2016.
 */


class SpriteGenerator {
    static generate( element ){
        let sprite
        switch ( element.type ){
            case "Player":
                sprite = new PIXI.Graphics()
                sprite.lineStyle( 1 , 0x666CFF , 1 )
                sprite.beginFill( 0x66CCFF )
                sprite.drawRect( 0 , 0 , element.width , element.height )
                sprite.endFill()
                sprite.x = element.position.x - element.width / 2
                sprite.y = element.position.y - element.height / 2
                break
            case "Zombie":
                sprite = new PIXI.Graphics()
                sprite.lineStyle( 1 , 0x088A08 , 1 )
                sprite.beginFill( 0x04B404 )
                sprite.drawRect( 0 , 0 , element.width , element.height )
                sprite.endFill()
                sprite.x = element.position.x - element.width / 2
                sprite.y = element.position.y - element.height / 2
                break
            case "GroundJumpable":
                sprite = new PIXI.Graphics()
                sprite.lineStyle( 1 , 0xFF3300 , 1 )
                sprite.beginFill( 0x66CCFF )
                sprite.drawRect( 0 , 0 , element.width , element.height )
                sprite.endFill()
                sprite.x = element.position.x - element.width / 2
                sprite.y = element.position.y - element.height / 2
                break
            case "GroundNotJumpable":
                sprite = new PIXI.Graphics()
                sprite.lineStyle( 1 , 0xFF3300 , 1 )
                sprite.beginFill( 0xFF0000 )
                sprite.drawRect( 0 , 0 , element.width , element.height )
                sprite.endFill()
                sprite.x = element.position.x - element.width / 2
                sprite.y = element.position.y - element.height / 2
                break
            case "Camera":
                sprite = new PIXI.Graphics()
                sprite.beginFill( 0x000000, 0 )
                sprite.drawRect( 0 , 0 , element.width , element.height )
                sprite.endFill()
                sprite.x = element.position.x - element.width / 2
                sprite.y = element.position.y - element.height / 2
                break
        }
        return sprite
    }
}

module.exports = SpriteGenerator