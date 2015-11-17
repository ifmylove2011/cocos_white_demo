/**
 * Created by XTER on 2015/11/16.
 * 游戏主逻辑
 */

var Direction = Direction || {};
Direction.UP = cc.p(0, 1);
Direction.LEFT = cc.p(1, 0);
Direction.DOWN = cc.p(0, -1);
Direction.RIGHT = cc.p(-1, 0);

var GameState = {};
GameState.READY = 0;
GameState.PLAYING = 1;
GameState.END = 2;

var GamePlayLayer = cc.Layer.extend({
    model: -1,                     // 模块
    playMethod: -1,             // 玩法
    row: 4,                          // 行
    column: 4,                           // 列
    tileSize: cc.size(0, 0),       // 块的大小
    tiles: null,                      // 数组[层中所有黑白块][二维]
    tileMaxNum: Number.MAX_VALUE, // 总块数
    tileLayer: null,               // 黑白块子层。用来直接move所有的黑白块。
    moveDir: Direction.DOWN,   // 移动方向
    state: GameState.READY,   // 游戏状态[准备]
    isWin: true,                             // 是否赢了
    isEnd: false,                // 游戏是否快到终点
    tapTileCount: 0,                // 黑块数[踩到的]
    time: 0,                                   // 时间[花了多少]
    timeLabel: null,                       // 标签[时间]
    ctor: function (mode, method) {
        this._super();
        this.loadConfig(mode, method);
        this.init();
        this.loadTitle();
    },
    /* 加载必要游戏参数 */
    loadConfig: function (mode, method) {
        this.model = mode;
        this.playMethod = method;
        //初始一维，后面会继续扩展为二维
        this.tiles = new Array();
        //将子菜单中的选项转换为游戏参数
        var title = GC.menuItem[mode].subItem[method];
        trace("game select", title, method);
        if (method < 2) {
            var row = parseInt(title.substring(0, 1));
            var column = parseInt(title.substring(title.length - 1, title.length));
            this.row = row >= 0 ? row : 4;
            this.column = column >= 0 ? row : 4;
        }

        //移动方向
        this.moveDir = (mode == 1 && method == 2) ? Direction.UP : Direction.DOWN;

        //格子最大数量
        if (mode == 0) {
            if (method == 0) {
                this.tileMaxNum = parseInt(title);
            } else {
                this.tileMaxNum = 50;
            }
        }

        //格子大小，算上线条的大小
        var width = (GC.w - GC.titleSpace * this.column) / this.column;
        var height = (GC.w - GC.titleSpace * this.row) / this.row;
        this.tileSize = cc.size(width, height);
    },
    /* 初始化场景 */
    init: function () {
        this.tileLayer = new cc.Layer();
        this.addChild(this.tileLayer);

        this.timeLabel = new cc.LabelTTF(this.time, "Arial", 56);
        this.timeLabel.attr({
            x: GC.w_mid,
            y: GC.y - this.timeLabel.height,
            color: cc.color.RED
        });
        this.addChild(this.timeLabel, 4);

        //规定的格子的逻辑--哪些可以触摸，哪些不能
        for (var i = 0; i < this.row + 1; i++) {
            this.tiles[i] = new Array();
            //定一个随机数作为黑块存在的列数
            var blackColumn = Math.floor(Math.random() * this.column);
            for (var j = 0; j < this.column; j++) {
                var type = TileType.NO_TOUCH;
                //如果为起始行，或者为黑块所在行，则可点击
                if (i == 0) {
                    type = TileType.START;
                } else if (blackColumn == j) {
                    type = TileType.TOUCH;
                }

                //处理一下：同一行的触摸以后就不可以再触摸了

                var x = j * (this.tileSize.width + GC.titleSpace);
                var y = i * (this.tileSize.height + GC.titleSpace);
                var tile = this.createTile(x, y, type);
                this.tileLayer.addChild(tile);
                this.tiles[i].push(tile);
                //var tile = this.createTile
            }
        }
    },
    loadTitle: function () {
        var startLabel = new cc.LabelTTF("开始", "Arial", 48);
        //在起始行之后的一行标注“开始”--标在黑色块中
        for (var i = 0; i < this.tiles[1].length; i++) {
            var tile = this.tiles[1][i];
            if (tile.type == TileType.TOUCH) {
                tile.addChild(startLabel);
                tile.loadListener();
                return;
            }
        }
    },
    onGameState:function(){
        this.gameState=GameState.PLAYING;
        this.scheduleUpdate();
    },
    update: function (dt) {
        this._time += dt;
        // [正则表达式]获取小数点后三位
        var regex = /([0-9]+\.[0-9]{3})[0-9]*/;
        var timeStr = String(this._time);
        //将原来的时间显示（很多小数位）替换为以一个"结尾的字符
        var finalStr = timeStr.replace(regex, "$1''");
        this._timeLabel.setString(finalStr);
    },
    createTile: function (x, y, type) {
        var tileSprite = new TileSprite(type, this.tileCallback);
        tileSprite.setPosition(x, y);
        tileSprite.setType(type);
        return tileSprite;
    },
    tileCallback: function () {

    },
    /* 游戏结束，统计数据 */
    onGameOver:function(){

    }
});