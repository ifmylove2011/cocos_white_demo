/**
 * Created by XTER on 2015/11/17.
 */

var TileType = {};
TileType.START = 0;
TileType.TOUCH = 1;
TileType.NO_TOUCH = 2;
TileType.END = 3;

var TileSprite = cc.Sprite.extend({
    type: TileType.NO_TOUCH,
    callback: null,
    listener: null,
    ctor: function (size, callback) {
        this._super();
        this.loadConfig(callback);
        this.init(size);
    },
    loadConfig: function (callback) {
        this.callback = callback;
    },
    init: function (size) {
        this.setTextureRect(0, 0, size.width, size.height);
        this.setAnchorPoint(0,0);
        this.setColor(cc.color.WHITE);
    },
    loadListener: function () {
        cc.eventManager.addListener({
            event: cc.eventListener.TOUCH_ONE_BY_ONE,
            target: this,
            swallowTouches: true,
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
        if (cc.rectContainsPoint(rect, localTouch)) {
            return false;
        }
        target.onTouchCallback();
        return true;
    },
    onTouchMoved: function (touch, event) {

    },
    /* �����󼴿�ʧЧ */
    onTouchEnded: function (touch, event) {
        var target = this.target;
        cc.eventManager.removeListener(target);
    },
    onTouchCallback: function () {
        var target = this;
        var callFunc = cc.callFunc(function () {
            var isGameOver = target.type == TileType.NO_TOUCH ? true : false;
            (target.callback && typeof (target.callback) == "function") && target.callback(target, isGameOver);
        });

        //������ʱ�Ķ���Ч��
        var scaleAction = cc.scaleTo(0.1, 1);
        var blinkAction = cc.blink(0.4, 4);
        var touchAction = cc.sequence(scaleAction, callFunc);
        var noTouchAction = cc.sequence(blinkAction, callFunc);
        var action = (this.type == TileType.TOUCH) ? touchAction : noTouchAction;
        target.runAction(action);

    },
    setType: function (type) {
        switch (type) {
            case TileType.START:
                this.setColor(cc.color.YELLOW);
                break;
            case TileType.TOUCH:
                this.setColor(cc.color.BLACK);
                break;
            case TileType.NO_TOUCH:
                // Ĭ�ϰ�ɫ����������
                break;
            case TileType.END:
                this.setColor(cc.color.GREEN);
                this.setTextureRect(cc.rect(0, 0, this.width + 10, this.height));
                break;
        }
        this.type = type;
    }

});