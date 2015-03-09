/*
 * @description     上下滚屏模块
 * @depends         zepto
 * @params          [config.parent] 所有屏的公共父级
 * @params          [config.section] 每一屏
 */
var $ = require('Zepto');
//默认配置
var opt = {
    parent: '.page-content',
    section: 'section',
    beforecallback: null,//滚动切屏动画前的回调
    aftercallback: null,//滚动切屏动画结束后的回调
    isScrolling: false,//是否处于切屏动画中，
    curIndex: 0,//当前滚动位置
    stopScrollUp: 0,//不允许向下滑动
    stopScrollDown: 0,//不允许向上滑动
    bonus: 20,//下拉多少距离后滚到下一屏
    scale: 0.5,//动画初始缩放大小
    time: 300//完成一屏滚动的耗时
};
function scrollPageY(config){
    if(!(this instanceof scrollPageY)){
        return new scrollPageY(config);
    }
    this.init(config);
};
scrollPageY.prototype = {
    constructor: scrollPageY,
    init: function(conf){
        //合并参数
        this.opt = $.extend({}, opt, conf);
        this.pages = $(this.opt.parent).find(this.opt.section);
        this.pages.hide();
        this.pages.eq(0).show();
        this.opt.total = this.pages.length;
        //将每一屏的大小，设为当前设备的尺寸
        this.setSectionSize(this.pages);
        this.registEvents();
        this.setScrollPos(this.pages.eq(this.opt.curIndex));
        this.opt.aftercallback && this.opt.aftercallback(this);
    },
    registEvents: function(){
        var me = this;
        var opt = me.opt;
        $(window).on('mousewheel', function(e){
            if(e.wheelDelta > 0){
                me.scrollUp();
            }
            else{
                me.scrollDown();
            }
        });

        $(document).on('touchstart', function(e){
            me.touchstartY = e.touches[0].clientY;
        });
        $(document).on('touchmove', function(e){
            me.isDrag = true;
            me.touchmoveY = e.touches[0].clientY;
            if(me.opt.isScrolling){
                return false;
            }
            me.setScrollPos($(e.srcElement).closest(opt.section));
            me.followFinger(e);
            //阻止滚动事件
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
        $(document).on('touchend', function(e){
            if(!me.isDrag){
                return false;
            }
            me.isDrag = false;
            //下滑
            if(me.touchmoveY - me.touchstartY > opt.bonus && !opt.stopScrollUp && !opt.isScrolling){
                me.scrollUp();
            }
            //上滑
            else if(me.touchmoveY - me.touchstartY < -opt.bonus && !opt.stopScrollDown && !opt.isScrolling){
                me.scrollDown();
            }
            else{
                me.scrollBack();
            }
        });
    },
    setSectionSize: function($tar){
        this.screenSize = {
            w: $(window).width(),
            h: $(window).height()
        };
        $tar.css({
            'width': this.screenSize.w + 'px',
            'height': this.screenSize.h + 'px'
        });
    },
    //设置滚动的前后状态
    setScrollPos: function($el){
        var opt = this.opt;
        opt.curIndex = $el.index();
        this.$cur = $el;
        if(opt.curIndex >= this.opt.total - 1){
            this.$next = this.pages.eq(0);
            this.$prev = $el.prev();
        }
        else if(opt.curIndex <= 0){
            this.$next = $el.next();
            this.$prev = this.pages.eq(this.opt.total - 1);
        }
        else{
            this.$next = $el.next();
            this.$prev = $el.prev();
        }
        this.$cur.css('z-index', 1);
        this.$next.css('-webkit-transform', 'scale('+opt.scale+')');
        this.$prev.css('-webkit-transform', 'scale('+opt.scale+')');
    },
    scrollUp: function(){
        this.animate(this.screenSize.h);
    },
    scrollDown: function(){
        this.animate(-this.screenSize.h);
    },
    scrollBack: function(){
        this.animate(0);
    },
    animate: function(tar){
        var me = this;
        if(me.opt.isScrolling){
            return false;
        }
        me.opt.isScrolling = true;
        me.opt.beforecallback && me.opt.beforecallback(me);
        this.$cur.animate({top: tar + 'px'}, me.opt.time, 'ease-out', function(){
            me.opt.isScrolling = false;
            if(tar){
                $(this).hide();
                me.pages.css({
                    'z-index': 0,
                    'top': 0
                });
                me.$cur = tar > 0 ? me.$prev : me.$next;
                me.setScrollPos(me.$cur);
                me.opt.aftercallback && me.opt.aftercallback(me);

            }
        });
        if(tar > 0){
            this.$prev.css('display', 'block').animate({scale: 1}, me.opt.time, 'ease-out');
        }
        else if(tar < 0){
            this.$next.css('display', 'block').animate({scale: 1}, me.opt.time, 'ease-out');
        }
    },
    //跟随手指动画
    followFinger: function(e){
        var opt = this.opt;
        var $el = $(e.srcElement).closest(opt.section);
        var moveY =this.touchmoveY - this.touchstartY;
        var scale = opt.scale + (1 - opt.scale) * Math.abs(moveY/this.screenSize.h);
        scale = scale > 1 ? 1 : scale;
        //下滑
        if(moveY > 0 && !opt.stopScrollUp){
            $el.css({
                'top': moveY + 'px',
                'z-index': 1
            });
            this.$prev.show().css({
                '-webkit-transform': 'scale('+scale+')',
                '-webkit-transform-origin': '50% 0 0'
            });
            this.$next.hide();
        }
        //上滑
        else if(moveY < 0 && !opt.stopScrollDown){
            $el.css({
                'top': moveY + 'px',
                'z-index': 1
            });
            this.$next.show().css({
                '-webkit-transform': 'scale('+scale+')',
                '-webkit-transform-origin': '50% 100% 0'
            });
            this.$prev.hide();
        }
    }
};

module.exports = scrollPageY;