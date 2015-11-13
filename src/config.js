/**
 * Created by XTER on 2015/11/12.
 */

var GC = GC || {};

GC.size = cc.size(600, 800);

GC.w = GC.size.width;
GC.h = GC.size.height;
GC.w_mid = GC.w / 2;
GC.h_mid = GC.h / 2;

GC.titleSpace = 1;

GC.menuItem = [
    {
        title: "经典",
        color: cc.color.RED,
        labelColor: cc.color.BLACK,
        subItem: [
            "25",
            "50",
            "不连续",
            "5x5",
            "6x6"
        ]
    }, {
        title: "街机",
        color: cc.color.BLUE,
        labelColor: cc.color.WHITE,
        subItem: [
            "正常",
            "更快",
            "逆行",
            "5x5",
            "6x6"
        ]
    }, {
        title: "禅",
        color: cc.color.GREEN,
        labelColor: cc.color.BLACK,
        subItem: [
            "15''",
            "30''",
            "不连续",
            "5x5",
            "6x6"
        ]
    }, {
        title: "极速",
        color: cc.color.YELLOW,
        labelColor: cc.color.BLACK,
        subItem: [
            "正常",
            "逆行",
            "不连续",
            "5x5",
            "6x6"
        ]
    }];