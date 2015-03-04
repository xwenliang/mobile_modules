##移动端弹层

###options.content

窗体内容

默认值：`this is a test`


###options.class

窗体class，可以通过修改它来控制弹层样式

默认值: `__default`


###options.affect

弹层效果，目前只写了scale和fade两种效果

如果需要再拓展其它的效果，可以在dialog.less中添加

如updown：

可以在dialog.less中添加`xfis-updown`和`xfis-updown-close`两个类

调用的时候，将`updown`传入即可。



默认值：`scale`


###options.topOffset

弹层距离窗口顶端的位置，默认上下居中

默认值：`0`


###options.time

弹层自动关闭的时间，默认不自动关闭

默认值：`null`

###options.closeCallback

弹层关闭后的回调

默认值：`null`
 





