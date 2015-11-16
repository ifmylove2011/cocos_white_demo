/**
 * Created by XTER on 2015/11/12.
 * 加载主菜单
 */

var MenuSprite = cc.Sprite.extend({
    index: null,
    config: null,
    scrollView: null,
    ctor: function (index) {
        this._super();
        this.loadConfig(index);
        this.init();
        this.loadTitle();
        this.bindListener();
    },
    /* 载入参数 */
    loadConfig: function (index) {
        this.index = index;
        this.config = GC.menuItem[this.index];
    },
    /* 初始化大小和颜色 */
    init: function () {
        this.setTextureRect(cc.rect(0, 0, GC.w_mid, GC.h_mid / 2));
        this.setColor(this.config.color);
        this.setAnchorPoint(0, 0);
    },
    /* 添加标题 */
    loadTitle: function () {
        var label = new cc.LabelTTF(this.config.title, "Arial", 44);
        label.attr({
            x: this.width / 2,
            y: this.height / 2,
            color: this.config.labelColor
        });
        this.addChild(label);
    },
    /* 绑定监听器 */
    bindListener: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            target: this,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },
    /* 触摸开始 */
    onTouchBegan: function (touch, event) {
        var target = this.target;
        trace("MenuSprite onTouchBegan");
        //转为本地坐标
        var localTouch = target.convertToNodeSpace(touch.getLocation());
        var size = target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);
        //判断点击处是否在本区域内
        if (!cc.rectContainsPoint(rect, localTouch)) {
            return false;
        }
        trace("获取当前点击的位置", touch.getLocation().x, touch.getLocation().y);
        target.loadSubItem();
        return true;
    },
    /* 触摸过程中移动 */
    onTouchMoved: function (touch, event) {
        trace("moved");
    },
    /* 触摸过程结束 */
    onTouchEnded: function (touch, event) {
        trace("ended");
    },
    /* 加载子菜单 */
    loadSubItem: function () {
        this.parent.selectIndex = this.index;
        if (this.config.subItem.length == 0) {
            return;
        }
        this.scrollView = new ccui.ScrollView();
        this.addChild(this.scrollView);
        //设置可触摸
        this.scrollView.setTouchEnabled(true);
        //设置可反弹
        this.scrollView.setBounceEnabled(true);
        //设置显示框大小
        this.scrollView.setContentSize(this.getContentSize());
        //设置滚动方向
        this.scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView.y = this.scrollView.height;

        //设置滚动条大小
        var scrollViewSize = this.scrollView.getContentSize();
        this.scrollView.setInnerContainerSize(cc.size(scrollViewSize.width, scrollViewSize.height / 3 * this.config.subItem.length));
        trace(scrollViewSize.width, scrollViewSize.height / 3 * this.config.subItem.length);
        //菜单项中的滚动视图添加子菜单项
        var size = this.getContentSize();
        for (var i = 0; i < this.config.subItem.length; i++) {
            var menuItemSprite = new MenuItemSprite(this.index, i);
            menuItemSprite.attr({
                x: 0,
                y: size.height / 3 * i,
                anchorX: 0,
                anchorY: 0
            });
            this.scrollView.addChild(menuItemSprite);
        }
        var actionMoveBy = cc.moveBy(0.2, cc.p(0, -size.height));
        var actionEaseSineIn = actionMoveBy.easing(cc.easeSineIn());
        this.scrollView.runAction(actionEaseSineIn);
    },
    unloadSubItem: function () {
        //this.removeChild(this.scrollView);
        this.removeAllChildren();
    }
});