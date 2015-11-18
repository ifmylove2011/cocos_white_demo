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
    mode: -1,                     // 模块
    method: -1,             // 玩法
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
        this.onGameStart();
        return true;
    },
    /* 加载必要游戏参数 */
    loadConfig: function (mode, method) {
        this.mode = mode;
        this.method = method;
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
        trace("this.row", this.row, "this.column", this.column);
        //移动方向
        this.moveDir = (mode == 1 && method == 2) ? Direction.UP : Direction.DOWN;
        trace("Direction:", this.moveDir);
        //格子最大数量
        if (mode == 0) {
            if (method == 0) {
                this.tileMaxNum = parseInt(title);
            } else {
                this.tileMaxNum = 50;
            }
        }
        trace("this.tileMaxNum", this.tileMaxNum);

        //格子大小，算上线条的大小
        var width = (GC.w - GC.titleSpace * this.column) / this.column;
        var height = (GC.h - GC.titleSpace * this.row) / this.row;
        this.tileSize = cc.size(width, height);
    },
    /* 初始化场景 */
    init: function () {
        this.tileLayer = new cc.Layer();
        this.addChild(this.tileLayer);

        this.timeLabel = new cc.LabelTTF(this.time, "Arial", 56);
        this.timeLabel.attr({
            x: GC.w_mid,
            y: GC.h - this.timeLabel.height,
            color: cc.color.RED
        });
        this.addChild(this.timeLabel, 10);

        //规定的格子的逻辑--哪些可以触摸，哪些不能
        for (var i = 0; i < this.row + 1; i++) {
            this.tiles[i] = new Array();
            //定一个随机数作为黑块存在的列数
            var blackColumn = Math.floor(Math.random() * this.column);
            for (var j = 0; j < this.column; j++) {
                var touchEnabled = true;
                var type = TileType.NO_TOUCH;
                //如果为起始行，或者为黑块所在行，则可点击
                if (i == 0) {
                    type = TileType.START;
                    touchEnabled = false;
                } else if (blackColumn == j) {
                    type = TileType.TOUCH;
                    touchEnabled = false;
                }

                //处理一下：同一行的触摸以后就不可以再触摸了

                var x = j * (this.tileSize.width + GC.titleSpace);
                var y = i * (this.tileSize.height + GC.titleSpace);
                var tile = this.createTile(x, y, type);
                //trace("tileSize?=-->",tile.x,tile.y,tile.width,tile.height);
                this.tileLayer.addChild(tile);
                this.tiles[i].push(tile);
                //trace("tiles-->",i,j,this.tiles[i][j].x,this.tiles[i][j].y,this.tiles[i][j].width,this.tiles[i][j].height);
                //var tile = this.createTile
                if (touchEnabled != false) {
                    tile.loadListener();
                }
            }
        }
    },
    loadTitle: function () {
        var startLabel = new cc.LabelTTF("开始", "Arial", 48);
        startLabel.attr({
            x: this.tileSize.width / 2,
            y: this.tileSize.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });
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
    onGameStart: function () {
        this.gameState = GameState.PLAYING;
        this.scheduleUpdate();
    },
    /* 显示时间 */
    update: function (dt) {
        this.time += dt;
        // [正则表达式]获取小数点后三位
        var regex = /([0-9]+\.[0-9]{3})[0-9]*/;
        var timeStr = String(this.time);
        //将原来的时间显示（很多小数位）替换为以一个"结尾的字符
        var finalStr = timeStr.replace(regex, "$1''");
        this.timeLabel.setString(finalStr);
        //trace("time",finalStr);
    },
    createTile: function (x, y, type) {
        //定义块位置及类别
        var tileSprite = new TileSprite(this.tileSize, this.tileCallback);
        tileSprite.setPosition(x, y);
        tileSprite.setAnchorPoint(0, 0);
        tileSprite.setType(type);
        trace("create tile", tileSprite.x, tileSprite.y, tileSprite.width, tileSprite.height);
        return tileSprite;
    },
    tileCallback: function (sender, isOver) {
        var self = this.parent.parent;
        trace(self.tapTileCount);
        trace(self.tileMaxNum);
        //游戏快到终点
        if (self.tapTileCount == self.tileMaxNum - self.row) {
            self.isEnd = true;
        } else if (self.tapTileCount == self.tileMaxNum - 1) {
            //tapTileCount是在移动后面才+1的，所以这里相等判断要-1
            self.isWin = true;
            self.onGameOver();
        }

        // 游戏结束
        if (isOver == true) {
            self.isWin = false;
            self.onGameOver();
        } else {
            self.onTileMove();
        }
    },
    //移动时添加块
    onTileMove: function () {
        var callFunc = cc.callFunc(this.addTile.bind(this));
        //根据移动方向与块大小得出移动的距离
        var moveByAction = cc.moveBy(0.2, cc.p(this.moveDir.x * this.tileSize.width, this.moveDir.y * (this.tileSize.height + GC.titleSpace)));
        var action = cc.sequence(moveByAction, callFunc);
        this.tileLayer.runAction(action);
    },
    addTile: function (sender) {
        //将最底层一行移出屏幕--视图上的
        for (var i = 0; i < this.tiles[0].length; i++) {
            this.tiles[0][i].removeFromParent();
        }

        // 删除第一维数组，即在当前数组中将最底层的块移除--数据上的
        this.tiles.shift();
        for (var i = 0; i < this.tiles[1].length; i++) {
            // 第二排开启触摸
            this.tiles[1][i].loadListener();
        }

        // 注意：这里是this._tiles.length, 而不是this._tiles.length - 1
        //4*4因为本身有四行，但当在移动过程中是需要显示5行的，所以需要添加一行作为顶层
        this.tiles[this.tiles.length] = new Array();
        trace("this.tile.length", this.tiles.length);
        var num = Math.floor(Math.random() * this.column);
        for (var i = 0; i < this.column; i++) {
            var type = TileType.NO_TOUCH;
            if (num == i) {
                type = TileType.TOUCH;
            }

            //这里计算最新显示的一行块
            var x = i * (this.tileSize.width + GC.titleSpace);
            var y = GC.h + this.tileSize.height + GC.titleSpace + this.tapTileCount * (this.tileSize.height + GC.titleSpace);

            if (this.isEnd == true) {
                type = TileType.END;
                y = GC.h + this.tileSize.height + this.tapTileCount * (this.tileSize.height);
            }

            var tile = this.createTile(x, y, type);
            this.tileLayer.addChild(tile);
            this.tiles[this.tiles.length - 1].push(tile);
        }
        this.tapTileCount += 1;
    },
    /* 游戏结束，统计数据 */
    onGameOver: function () {
        trace("Game Over");
        this.state = GameState.END;
        trace("mode",this.mode,"method",this.method,"tapTileCount",this.tapTileCount,"time",this.time,"isWin",this.isWin);
        var data = {
            mode: this.mode,
            method: this.method,
            tapTileCount: this.tapTileCount,
            time: this.time,
            isWin: this.isWin
        };

        var scene = new cc.Scene();
        var layer = new GameOverLayer(data);
        scene.addChild(layer);
        cc.director.runScene(new cc.TransitionCrossFade(0.5, scene));
    }
});