var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 600},
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: true
    }
};

let game = new Phaser.Game(config);
let map;
let player;
let cursors;
let groundLayer, coinLayer;
let text;
let score = 0;
let msg;
let messages = ["Desde el 6 de febrero de 2001",
              "Somos la Fundación Bolivariana de Informática y Telemática",
              "Una fundación que va de la mano con las innovaciones tecnológicas",
              "Contribuimos en la resolución de problemáticas de la sociedad actual",
              "Apoyamos al MPPE en la divulgación de las TIC",
              "Somos el brazo Tecnológico del MPPE",
              "Tenemos CBIT en todo el país",
              "Formamos a estudiantes, docentes y comunidad en los CBIT",
              "Brindamos apoyo técnico en los CIAT",
              "También contamos con CBIT Móviles",
              "Desarrollamos recursos multimedia en los CPSET",
              "Educamos a los niños y niñas con los SIMONCITOS",
              "Diseñamos fLyers e infografías",
              "Grabamos micros radiales",
              "Editamos Videos Educativos",
              "Impulsamos proyectos de Robótica Educativa",
              "Nos encanta la Realidad Aumentada",
              "Queremos promover el Cine infantíl",
              "Contamos con una gran Biblioteca Digital",
              "Apoyamos a las instituciones en sus congresos pedagógicos",
              "Nuestros valores: Excelencia, responsabilidad y compromiso",
              "Y ya son 22 años de Revolución Tecnológica!!"]
var instructions = "";

function preload() {
    this.load.tilemapTiledJSON('map', 'images/map22.json'); 
    this.load.spritesheet('tiles', 'images/tiles.png', {frameWidth: 70, frameHeight: 70});
    this.load.image('coin', 'images/pc.png');
    this.load.image('final', 'images/final.png');
    this.load.atlas('player', 'images/robot.png', 'images/robot_player_atlas.json');
    this.load.audio('theme1', ['audio/bgm.mp3']);
    this.load.audio('theme2', ['audio/collect.mp3']);
   // this.load.audio('theme3', ['audio/jump.ogg','audio/jump.mp3']);
} //preload

function create() {
    map = this.make.tilemap({key: 'map'});
    let groundTiles = map.addTilesetImage('tiles');
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    groundLayer.setCollisionByExclusion([-1]);
    let coinTiles = map.addTilesetImage('coin');
    coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);
    
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    let music1 = this.sound.add('theme1', { loop: true });
    music1.play();

    player = this.physics.add.sprite(100, 200, 'player');
    player.setBounce(0.3);
    player.setCollideWorldBounds(true); 
    player.body.setSize(player.width, player.height-8);
    
    this.physics.add.collider(groundLayer, player);

    coinLayer.setTileIndexCallback(17, collectCoin, this);
    this.physics.add.overlap(player, coinLayer);
    

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('player', {
        prefix: 'robo_player_',
        start: 2,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 'robo_player_0' }],
      frameRate: 10,
    });

    this.anims.create({
      key: 'jump',
      frames: [{ key: 'player', frame: 'robo_player_1' }],
      frameRate: 10,
    });

    this.anims.create({
      key: 'knee',
      frames: [{ key: 'player', frame: 'robo_player_6' }],
      frameRate: 10,
    });

    cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
    this.cameras.main.setBackgroundColor('#00eeff');

    text = this.add.text(660, 550, ' \u{1f4BB}', {
        fontSize: '40px',
        fill: '#946538'
    });
    
    msg = this.add.text(15, 15, '\u{1f9D1}  FUNDABIT cumple 22 años y vamos a celebrar\n\tPero antes a resguardar', { 
        fontSize: '17px',
        fill: '#0072ff'
    });
    
    instructions =  this.add.text(20, 550, 'Para mover al robot\nUtiliza las teclas de dirección  \u{2190} \u{2191} \u{2193} \u{2192}', {
        fontSize: '15px',
        fill: '#633910'
    });
        
    text.setScrollFactor(0);
    msg.setScrollFactor(0);
    instructions.setScrollFactor(0);
} //create


function collectCoin(sprite, tile) {
    var music2 = this.sound.add('theme2');
    music2.play();
    coinLayer.removeTileAt(tile.x, tile.y); 
    score++; 
    msg.setText("\u{1f9D1}: " +messages[0]);
    messages.shift();
    text.setText("\u{1f4BB}:" + score); 
    if (score == 22) {
      this.add.image(400, 300, 'final').setScale(1).setScrollFactor(0);
    }
    return false;
} // collectCoin

function update(time, delta) {

   if (cursors.left.isDown) {
      player.setVelocityX(-250);
      if (player.body.onFloor()) {
        player.play('walk', true);
      }
    } else if (cursors.right.isDown) {
      player.setVelocityX(250);
      if (player.body.onFloor()) {
        player.play('walk', true);
      }
    } else {
      player.setVelocityX(0);
      if (player.body.onFloor()) {
        player.play('idle', true);
      }
    }

    if ((cursors.space.isDown || cursors.up.isDown) && player.body.onFloor()) {
      player.setVelocityY(-550);
      player.play('jump', true);
    }

   if (cursors.down.isDown && player.body.onFloor()) {
      player.play('knee', true);
    }

    if ((cursors.left.isDown || cursors.right.isDown ) && cursors.down.isDown && player.body.onFloor()) {
      player.setVelocityX(0);
    }

    if (player.body.velocity.x > 0) {
      player.setFlipX(false);
    } else if (player.body.velocity.x < 0) {
      player.setFlipX(true);
    }
} //uptime
