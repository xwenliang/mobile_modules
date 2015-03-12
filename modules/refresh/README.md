##基于iScroll5的上/下拉刷新
###[切记不可与FastClick共同使用](http://xwenliang.cn/p/550179ce043d254915000001)

一个上/下拉刷新组件通常包含如下结构：

	<div class="scroller-wrap">
		<div class="scroller">
			<div class="scroller-content">
				content
			</div>
			<div class="down">
				pulldown tips
			</div>
			<div class="up">
				pullup tips
			</div>
		</div>
	</div>
	
####options.container
上/下拉刷新的外容器，即上面的`scroller-wrap`

它是需要有固定高度的

默认值：无


###options.distance
上/下拉刷新的触发距离，通常它就是上面down/up的高度

默认值 `50`

###options.pullUpAction
上拉到临界值触发的函数，通常它里面会触发一个ajax请求来更新数据

默认值 `null`

###options.pullDownAction
下拉到临界值触发的函数，通常它里面会触发一个ajax请求来更新数据

默认值 `null`

###options.probeType
scroll事件触发的时候，其回调的执行频率，共分为1，2，3三个值

值越大，执行频率越高

默认值 `3`

###options.click
iscroll的click属性，是否允许页面点击

默认值 `false`

<br>
<br>
详情见：[iScroll5文档](http://iiunknown.gitbooks.io/iscroll-5-api-cn/content/index.html)