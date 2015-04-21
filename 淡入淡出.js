/*
函数说明：
	名称			：	tabFade
	作用			：	自动播放的淡入淡出切换，自动添加显示当前项的导航按钮
	参数			：	最少一个
	obj			：	需要执行此操作的对象
	iInterval	：	间隔时长，可省略，默认2000
	注意事项		：	此函数基于JQ，所以要在JQ环境下运行才能有效，另外，传入的参数对象也必须是JQ对象
*/
function tabFade(obj,iInterval){
	// 为自动播放预留定时器
	var timer = null;
	// 计数器，用于控制当前显示
	var iNow = 0;
	// 获取所有选项卡的项
	var $aTab = obj.find("li");
	// 向obj内部添加导航条
	obj.append('<p class="btns"></p>');
	// 获取导航条
	var $btn = obj.find("p.btns");
	// 向导航条内动态添加 与选项卡个数相等的 导航按钮
	for(var i = 0; i < $aTab.length; i++){
		$btn.append('<a href="javascript:;"></a>');
	}
	// 获取所有导航按钮
	var $aBtn = $btn.find("a");
	// 设置默认间隔时长
	iInterval ? iInterval = iInterval : iInterval = 2000;
	
	// 设置第一个导航按钮为默认显示状态
	$aBtn.eq(0).addClass('active');
	// 除第一个选项卡内容外，其他全部隐藏
	obj.find("li:gt(0)").hide();
	// 设置自动播放
	timer = setInterval(fnHot, iInterval);
	
	// 切换透明度
	function fnHot(){
		// 计数，到下一项
		iNow++;
		// 做限制，到最后一项的时候返回第一项
		if(iNow == $aTab.length)iNow = 0;
		// 设置导航按钮的显示状态
		$aBtn.eq(iNow).addClass("active").siblings().removeClass("active");
		// 停止所有选项卡动画，将第iNow项隐藏，且层级降到 2，并通过透明度动画逐渐将层级提高到 1，且将其他选项卡隐藏
		$aTab.stop(true, true).eq(iNow).css({"display": "none", "z-index": 2}).fadeIn(function(){
			$(this).css({"z-index": 1}).siblings("li").hide();
		});
	}
	
	// 导航按钮的点击事件
	$aBtn.click(function (){
		// 先判断一下，如果点击的是当前项，则直接跳出不执行。若不判断，当点击当前项的时候会闪一下，而且下面是背景色，没有下一张图片做过度！！！
		if($(this).hasClass('active')){
			return false;	
		}
		// 首先必须先清除正在运行的自动播放，否则会导致定时器累加
		clearInterval(timer);
		// 把计数器转为当前按钮的索引值-1, -1是因为在函数fnHot内部会向上+1,在这里做一个相抵	（这个是重点！ ）
		iNow = $aBtn.index(this)-1;
		// 先直接调用一下切换函数，因为定时器是后执行
		fnHot();
		// 重新启动自动播放
		timer = setInterval(fnHot, iInterval);
	});
}