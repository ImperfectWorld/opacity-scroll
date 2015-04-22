/*
函数说明：
	名称			：	scroll
	作用			：	自动播放的淡入淡出切换，自动添加显示当前项的导航按钮
	参数			：	最少一个
	obj				：	需要执行此操作的对象
	iInterval		：	间隔时长，可省略，默认2000
	注意事项		：	此函数基于JQ，所以要在JQ环境下运行才能有效，另外，传入的参数对象也必须是JQ对象
*/

var scroll = (function () {
	//静态变量
	var 
	configMap = {
		btn_html: String() + '<p class="btns"></p>',
		btn_a_html:String() + '<a href="javascript:;"></a>',

		chat_inteval_time: 2000,
	},

	//模块共享动态信息储存变量
	stateMap = { $container: null},
	//储存jquery缓存变量
	jqueryMap = {},
	setJqueryMap, animateFade, initModule, onClickScroll,
	timer, iNow = 0;

	//DOM METHODS
	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = { 
			$container: $container,
			$aTab: $container.find("li"),
			$btn: $container.find('p')
		};
	};
	setDynaJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryDynaMap = {
			$aBtn: jqueryMap.$btn.find('a')
		}
	}
	//END DOM METHODS

	animateFade = function (argument) {
		iNow++;
		if (iNow == jqueryMap.$aTab.length) {iNow = 0};
		jqueryDynaMap.$aBtn.eq(iNow).addClass('active').siblings().removeClass('active');
		jqueryMap.$aTab.stop(true, true).eq(iNow).css({'display': 'none', 'z-index': 2}).fadeIn(function () {
			$(this).css({'z-index': 1}).siblings('li').hide();
		});
		return true;
	}

	onClickScroll = function (event) {
		if($(this).hasClass('active')){
			return false;	
		}
		clearInterval(timer);
		iNow = jqueryDynaMap.$aBtn.index(this)-1;

		animateFade();
		return false;
	}

	//Public method
	initModule = function ($container, iInterval) {
		stateMap.$container = $container;
		iInterval ? iInterval = iInterval : iInterval = configMap.chat_inteval_time;

		$container.append(configMap.btn_html);
		setJqueryMap();
		for(var i = 0; i < jqueryMap.$aTab.length; i++){
			jqueryMap.$btn.append(configMap.btn_a_html);
		}
		setDynaJqueryMap();

		jqueryDynaMap.$aBtn.eq(0).addClass('active');
		$container.find("li:gt(0)").hide();
		jqueryDynaMap.$aBtn.click(onClickScroll);
		timer = setInterval(animateFade, iInterval);
	}
	//END Public method

	return { initModule: initModule};

})()
