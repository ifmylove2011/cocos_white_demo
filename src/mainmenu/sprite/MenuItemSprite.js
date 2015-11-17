/**
 * Created by XTER on 2015/11/13.
 * �����Ӳ˵���
 */

var MenuItemSprite = cc.Sprite.extend({
    index: -1,
    menuIndex: -1,
    touchOffset: cc.p(0, 0),
    /* �˵��������Ӳ˵����� */
    ctor: function (menuIndex, index) {
        this._super();
        this.loadConfig(menuIndex, index);
        this.init();
        this.loadTitle();
        this.loadListener();
    },
    /* ���ز��� */
    loadConfig: function (menuIndex, index) {
        this.menuIndex = menuIndex;
        this.index = index;
    },
    /* ��ʼ�� */
    init: function () {
        //�����ж����У����ƶ��Ӳ˵��Ĵ�С
        //2�в˵���ÿ���˵�������ѡ�����Ҫ6
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
    /* ����Ƿ��ƶ�����--���Զ�����ޣ��˴��ǽ��ƶ���Χ������һ���Ӳ˵��Ĵ�С��Χ��ֻ
     * Ҫ�ƶ�������������Χ����ֻ������ͼ��������ӦEND */
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