//Create the renderer
var renderer = PIXI.autoDetectRenderer( 500 , 500 , {
    antialias: false,
    transparent: false,
    resolution: 1
} );

//Add the canvas to the HTML document
$( "#renderer" ).append( renderer.view );

//Create a container object called the `stage`
var stage = new PIXI.Container( );

// var rectangle = new PIXI.Graphics();
// rectangle.lineStyle(4, 0xFF3300, 1);
// rectangle.beginFill(0x66CCFF);
// rectangle.drawRect(0, 0, 64, 64);
// rectangle.endFill();
// rectangle.x = 170;
// rectangle.y = 170;
// stage.addChild(rectangle);


var gameUpdate = ( data )=>{
    console.log(data)
    //updateSprites( data )

    // Tell the `renderer` to `render` the `stage`
    renderer.render( stage );

}

var updateSprites = ( data )=>{
    _.each(data,(sprite)=>{
        if (!_.isUndefined(sprites[sprite.name])){
            sprites[sprite.name].moveTo(sprite.x,sprite.y)
        }
        else {
            switch(sprite.type){
                case "player":
                    sprites[sprite.name] = SpriteGenerator.generatePlayer(sprite)
                    break;
                case "wall":
                    sprites[sprite.name] = SpriteGenerator.generateWall(sprite)
                    break;
                default:
                    console.error("Bad type")
                    break;
            }
        }
    })
}

