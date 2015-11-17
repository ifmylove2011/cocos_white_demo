/**
 * Created by XTER on 2015/11/13.
 * 加载子菜单项
 */

var MenuItemSprite = cc.Sprite.extend({
    index: -1,
    menuIndex: -1,
    touchOffset: cc.p(0, 0),
    /* 菜单索引，子菜单索引 */
    ctor: function (menuIndex, index) {
        this._super();
        this.loadConfig(menuIndex, index);
        this.init();
        this.loadTitle();
        this.loadListener();
    },
    /* 加载参数 */
    loadConfig: function (menuIndex, index) {
        this.menuIndex = menuIndex;
        this.index = index;
    },
    /* 初始化 */
    init: function () {
        //计算有多少行，以制定子菜单的大小
        //2行菜单，每个菜单有三个选项，则需要6
        var size = cc.size(GC.w_mid, GC.h_mid / (GC.menuItem.length / 2 * 3));
        this.setTextureRect(cc.rect(0, 0, size.width, size.height));
        var color = this.index % 2 == 0 ? cc.color.WHITE : GC.menuItem[this.menuIndex].color;
        this.setColor(color);
        this.setAnchorPoint(0, 0);
    },
    loadTitle: function () {
        var title = GC.menuItem[this.menuIndex].subItem[this.index];
        var label = new cc.LabelTTF(title, "Arial", 32);
        label.attr({
            x: this.width / 2,
            y: 0,
            color: cc.color.BLACK,
            anchorX: 0.5,
            anchorY: 0
        });
        this.addChild(label);
    },
    loadListener: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            target: this,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },
    onTouchBegan: function (touch, event) {
        var target = this.target;
        var localTouch = target.convertToNodeSpace(touch.getLocation());
        var size = target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);
        if (!cc.rectContainsPoint(rect, localTouch)) {
            return false;
        }
        target.touchOffset = touch.getLocation();
        return true;
    },
    onTouchMoved: function (touch, event) {

    },
    onTouchEnded: function (touch, event) {
        var target = this.target;
        var isEffective = target.checkTouch(target.touchOffset, touch.getLocation());
        if (isEffective) {
            target.onGamePlayEnter();
            target.touchOffset = cc.p(0, 0);
        }
        trace("Ended");
    },
    /* 检测是否移动出界--可自定义界限，此处是将移动范围限制在一个子菜单的大小范围，只
     * 要移动距离大于这个范围，则只滚动视图而不是响应END */
    checkTouch: function (pos1, pos2) {
        var offsetX = Math.abs(pos2.x - pos1.x);
        var offsetY = Math.abs(pos2.y - pos1.y);
        return (offsetX <= this.width && offsetY <= this.height ) ? true : false;
    },
    onGamePlayEnter: function () {
        trace("play");
        var scene = new cc.Scene();
        var layer = new GamePlayLayer(this.menuIndex, this.index);
        scene.addChild(layer);
        cc.director.runScene(new cc.TransitionCrossFade(1, scene));
    }
});