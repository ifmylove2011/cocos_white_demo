/**
 * Created by XTER on 2015/11/12.
 */
var MainMenuLayer = cc.Layer.extend({
    selectIndex: 0,
    ctor: function () {
        this._super();
        this.loadMenu();
        return true;
    },
    loadMenu: function () {
        var j = GC.menuItem.length;
        //利用算法排列好菜单
        for (var i = 0; i < GC.menuItem.length; i++) {
            var menuSprite = new MenuSprite(i);
            if (i % 2 == 0) {
                menuSprite.x = 0;
                menuSprite.y = GC.h - menuSprite.height * (i / 2 + 1);
            } else {
                menuSprite.x = menuSprite.width;
                menuSprite.y = GC.h - menuSprite.height * (i / 2 + 1 - 0.5);
            }
            trace(j, i, menuSprite.x, menuSprite.y);
            this.addChild(menuSprite, j, i);
            j--;
        }
    }
});

var MainMenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MainMenuLayer();
        this.addChild(layer);
    }
});