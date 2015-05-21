var dir = '/mobile_modules';
var domain = '';

//fis.config.set('roadmap.relative', true);
// fis.config.set('settings.postpackager.simple.autoReflow', true);
fis.config.merge({
    statics: dir,
    /* zoo-command-install 要实现的功能
    requires: [
        'jQuery@1.11.3'
    ],
    pages: [
        'index',
        'category',
        'post',
        'postlist',
        'user',
        'userlist',
        'water',
        'chatroom'
    ],
    */
    roadmap: {
        domain: domain,
        path: [
            {
                reg: /^\/js\/.*$/,
                isMod: false,
                release: '${statics}/$&'
            },
            {
                //非模块化的组件，如模块解析器
                reg: /^\/modules\/mod\/mod\.js/i,
                isMod: false,
                release: '${statics}/temp/$&'
            },
            {
                //公共组件
                reg: /^\/modules\/([^\/]+)\/(?:[^\/]+).js$/i,
                //是组件化的，会被jswrapper包装
                isMod: true,
                //id为文件夹名
                id: '$1',
                release: '${statics}/$&'
            },
            {
                //业务逻辑模块(一级路由)
                reg: /^\/(pages)\/([^\/]+)\/(?:[^\/]+)\.js$/i,
                isMod: true,
                id: '$1/$2',
                release: '${statics}/$&'
            },
            {
                //业务逻辑中的其他js文件
                reg: /^\/pages\/.+\.js$/i,
                isMod: false,
                release: '${statics}/$&'
            },
            {
                //css文件
                reg: /^(.*)\.(css|less)$/i,
                //启用sprite自动合并，书写需要合并的图片地址的时候，需要在文件地址后面加?__sprite，如: background: url(images/abc.png?__sprite);
                useSprite: true,
                release: '${statics}/$&'
            },
            {
                //图片等媒体文件
                reg: /^(.*)\.(jpg|gif|png|mp3|mp4|ttf|pdf)$/i,
                release: '${statics}/$&'
            },
            {
                //前端模版
                reg: '**.tpl',
                release: false,
                useOptimizer: false,
                useCache: false
            },
            {
                //后端模板
                reg: /^(.*)\.html$/i,
                //当做类js文件处理，可以识别__inline, __uri等资源定位标识，参与编译
                isHtmlLike: true,
                useCache: false,
                release: '${statics}/$&'
            },
            {
                //打包后的资源
                reg: 'pkg/**.js',
                release: '${statics}/$&'
            },
            {
                //依赖关系表
                reg: 'map.json',
                release: '${statics}/$&'
            },
            {
                //其他上文未匹配到的
                reg : "**",
                release : false
            }
        ]
    },
    pack: {
        // 'pkg/common.js': [
        //     'js/mod.js',
        //     'modules/**.js'
        // ],
        // 'pkg/common.less': [
        //     'css/common.less',
        //     'modules/**.less'
        // ]
    },
    deploy: {}
});