/**
 * Created by XTER on 2015/11/18.
 */

var GameOverLayer = cc.LayerColor.extend({
    mode: null,
    method: null,
    tapTileCount: null,
    time: null,
    isWin: null,
    ctor: function (data) {
        this._super();
        this.loadConfig(data);
        this.init();
        this.loadTitle();
        this.loadMenu();
        return true;
    },
    loadConfig: function (data) {
        this.mode = data.mode;
        this.method = data.method;
        this.tapTileCount = data.tapTileCount;
        this.time = data.time;
        this.isWin = data.isWin;
        trace("mode",this.mode,"method",this.method,"tapTileCount",this.tapTileCount,"time",this.time,"isWin",this.isWin);
    },
    init: function () {
        var color = this.isWin ? cc.color.GREEN : cc.color.RED;
        this.setColor(color);
    },
    loadTitle: function () {
        var strMode = GC.menuItem[this.mode].title + "模式";
        var labelMode = new cc.LabelTTF(strMode, "Arial", 66);
        labelMode.attr({
            x: GC.w_mid,
            y: GC.h - 40
        });
        this.addChild(labelMode);

        var strMethod = GC.menuItem[this.mode].subItem[this.method];
        var labelMethod = new cc.LabelTTF(strMethod, "Arial", 28);
        labelMethod.attr({
            x: labelMode.x + 150,
            y: labelMode.y + 60
        });
        this.addChild(labelMethod);

        var strWin = this.isWin ? "恭喜了" : "悲剧了";
        var labelWin = new cc.LabelTTF(strWin, "Arial", 88);
        labelWin.attr({
            x: GC.w_mid,
            y: GC.h_mid,
            color: cc.color.BLACK
        });
        this.addChild(labelWin);

        var regex = /([0-9]+\.[0-9]{3})[0-9]*/;
        var timeStr = String(this.time);
        var finalStr = timeStr.replace(regex, "$1''");
        var labelTime = new cc.LabelTTF(finalStr, "Arial", 24);
        labelTime.attr({
            x: GC.w - 40,
            y: GC.h - 40
        });
        this.addChild(labelTime);

    },
    loadMenu: function () {
        var strContinue = new cc.LabelTTF("继续玩", "Arial", 48);
        var menuContinue = new cc.MenuItemLabel(strContinue, function () {
            var scene = new cc.Scene();
            var layer = new GamePlayLayer(this.mode, this.method);
            scene.addChild(layer);
            cc.director.runScene(new cc.TransitionCrossFade(1, scene));
        }, this);

        var strBreak = new cc.LabelTTF("结束", "Arial", 48);
        var menuBreak = new cc.MenuItemLabel(strBreak, function () {
            cc.director.runScene(new cc.TransitionCrossFade(1, new MainMenuScene()));
        }, this);

        var menu = new cc.Menu(menuContinue,menuBreak);
        menu.attr({
            x:GC.w_mid,
            y:GC.h_mid - 100
        });
        menu.alignItemsHorizontallyWithPadding(30);
        this.addChild(menu);
    }
});