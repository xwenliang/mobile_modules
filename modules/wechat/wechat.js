
/* 分享到微信，自定义链接显示方式
 * @require jweixin
 * @param   [cfg.imgUrl(str)]               分享内容的预览图片链接
 * @param   [cfg.lineLink(str)]             分享内容的链接地址
 * @param   [cfg.shareTitle(str)]           分享内容的标题
 * @param   [cfg.descContent(str)]          分享内容的描述
 * @param   [cfg.success(fn)]               分享成功后的回调
 * @param   [cfg.cancel(fn)]                取消分享后的回调
 * @param   [cfg.fail(fn)]                  分享失败后的回调

 * @param   [cfg.debug(str)]                是否开启PC端调试
 * @param   [cfg.appId(str)]                公众号唯一标识
 * @param   [cfg.timestamp(str)]            签名时间戳
 * @param   [cfg.nonceStr(str)]             签名随机串
 * @param   [cfg.signature(str)]            签名
 * @param   [cfg.jsApiList(fn)]             调用的接口
 */
var wx = require('jweixin');

// var opt = {
//     imgUrl: '',
//     lineLink: '',
//     descContent: '',
//     shareTitle: '',
//     success: function(){},
//     cancel: function(){},
//     fail: function(){},
//     //微信验证要用到的参数
//     debug: false,
//     appid: '',//需要后端传入
//     signature: '',//需要后端传入
//     timestamp: '',//需要后端传入
//     noncestr: '',//需要后端传入
//     jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
// };

var wechat = function(opt){
    wx.config({
        debug: opt.debug,
        appId: opt.appid,
        timestamp: opt.timestamp,
        nonceStr: opt.noncestr,
        signature: opt.signature,
        jsApiList: opt.jsApiList
    });
    wx.ready(function(){
        wx.onMenuShareAppMessage({
            title: opt.shareTitle,
            desc: opt.descContent,
            link: opt.lineLink,
            imgUrl: opt.imgUrl,
            trigger: function(res){},
            success: function(res) {
                opt.success(res);
            },
            cancel: function(res) {
                opt.cancel(res);
            },
            fail: function(res){
                opt.fail(res);
            }
        });
        wx.onMenuShareTimeline({
            title: opt.shareTitle,
            link: opt.lineLink,
            imgUrl: opt.imgUrl,
            trigger: function(res){},
            success: function(res){
                opt.success(res);
            },
            cancel: function(res){
                opt.cancel(res);
            },
            fail: function(res){
                opt.fail(res);
            }
        });
    });
    wx.error(function(res){
        console.log(res);
    });
};

module.exports = wechat;