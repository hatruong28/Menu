/**
 *  @name plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */

 ;(function($, window, undefined) {
 	'use strict'

 	var pluginName = 'menu',
 		mainMenuCls = 'main-menu',
 		subMenuCls = 'sub-menu',
 		activeMenuCls = 'active-menu',
 		curMenuCls = 'current-menu',
 		timeOut,
 		currentMenu;

 	function Plugin(element, options){
 		this.element = $(element);
 		this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data, options);
 		this.init();
 	}

 	Plugin.prototype = {
 		init: function() {
 			var that = this,
 				options = this.options;

 			that.initMenu();

 			that.element.find('li').on('mouseenter.menu', function(e) {
 				var newChild = $(this).data('child');
 				clearTimeout(timeOut);
 				that.element.find('li.' + options.activeClass).removeClass(options.activeClass);
 				if(currentMenu){
					that.hideMenu(currentMenu);
				}
 				if(newChild) {
 					currentMenu = newChild;
 					that.showMenu(newChild);
 				} else {
 					$(this).addClass(options.activeClass);
 				}
 			}).on('mouseleave.menu', function() {
 				timeOut = setTimeout(function() {
 					that.element.find('li.' + options.activeClass).removeClass(options.activeClass);
 					that.hideMenu($('div.' + activeMenuCls).first());
 				}, options.hideDelay);
 			});

 			//that.showMenu($('div').eq(4));
 		},
 		initMenu: function(){
 			var that = this,
 				options = that.options,
 				subMenu = that.element.find('.' + subMenuCls);
 			that.element.children().addClass(mainMenuCls);
 			subMenu.each(function() {
 				var parent = $(this).parent(),
 					parentPos = parent.position(),
 					pos;
 				if($(this).parent().hasClass(mainMenuCls)){
 					pos = {left: parentPos.left, top: parentPos.top + parent.outerHeight()};
 					$(this).css({
	 					'position': 'absolute',
	 					'top': '0',
	 					'margin-top': -$(this).outerHeight()
	 				});
 				} else {
 					parentPos = parent.parent().data('pos');
 					var top = parent.index() * parent.outerHeight() + parentPos.top,
 						left = parentPos.left + parent.outerWidth() + 3;
 					pos = {left: left, top: top};
 					$(this).css({
	 					'position': 'absolute',
	 					'top': '0',
	 					'margin-left': -$(this).outerWidth()
	 				});
 				}
 				$(this).data('pos', pos); 				
			});

			subMenu.each(function() {
				$(this).wrap('<div></div>');
				var child = $(this).parent(),
					pos = $(this).data('pos');
				child.data('pos', pos);
				child.css({
					'position': 'absolute',
					'overflow':'hidden',
					'left': pos.left,
					'top': '-1000px',
					'width': $(this).outerWidth() + 1,
					'height': $(this).outerHeight() + 1
				});
				child.parent().data('child', child);
				child.data('parent', child.parent());
				child.appendTo($('body'));
 			});
 		},
 		showMenu: function(menu) {
 			var that = this,
 				options = that.options,
 				pos = menu.data('pos'),
				li = menu.data('parent'),
				margin = {},
				activeMenu = 'div.' + activeMenuCls,
				activeLi = '.' + activeMenuCls + ' li';
			if(!menu.hasClass(activeMenuCls)){
				menu.css('opacity', 0.7);
			}
			menu.css('top', pos.top);
			menu.addClass(activeMenuCls);
			if(li.hasClass(mainMenuCls)){
				if(!currentMenu)
					currentMenu = menu;
				that.element.find('li' + options.activeClass).removeClass(options.activeClass);
				li.addClass(options.activeClass);
				margin = {'margin-top': 0};
			} else {
				margin = {'margin-left': 0};
				if(!li.hasClass(options.activeClass)){
					li.closest('div').find('.' + options.activeClass).removeClass(options.activeClass);
					li.addClass(options.activeClass);
					that.showMenu(li.closest('div'));
				}
			}
			menu.children().stop().animate(margin, options.duration, function(){
				menu.css('opacity', 1);
			});

			$(activeLi).off('mouseenter.menu').on('mouseenter.menu', function() {
				var newChild = $(this).data('child'),
					mainMenu = that.element.find('li.' + mainMenuCls);
				clearTimeout(timeOut);
				mainMenu.each(function() {
					if(!$(this).hasClass(options.activeClass) && $(this).data('child')){
						that.hideMenu($(this).data('child'));
					}
				});
				that.showMenu($(this).closest(activeMenu));
				if($(this).closest(activeMenu)[0] !== $(activeMenu).last()[0]) {
					$(this).closest(activeMenu).addClass(curMenuCls);
 					var current = $(activeMenu).filter('.' + curMenuCls),
 						indexMenu = $(activeMenu).index(current);
 					$('.' + curMenuCls).removeClass(curMenuCls);
 					that.hideMenu($($(activeMenu)[indexMenu + 1]));
 				}
 				$(this).closest(activeMenu)
 					.find('.' + options.activeClass)
 					.removeClass(options.activeClass);
 				$(this).addClass(options.activeClass);
				if(newChild){
					that.showMenu(newChild);
				}
			}).off('mouseleave.menu').on('mouseleave.menu', function() {
				timeOut = setTimeout(function() {
					that.element.find('li.' + options.activeClass).removeClass(options.activeClass);
 					that.hideMenu($(activeMenu).first());
 				}, options.hideDelay);
			});
 		},
 		hideMenu: function(menu) {
 			var that = this,
 				options = that.options;
 			menu.addClass(curMenuCls);
			var activeMenu = $('.' + activeMenuCls),
				current = activeMenu.filter('.' + curMenuCls),
				indexMenu = activeMenu.index(current);
			menu.removeClass(curMenuCls);
			activeMenu.each(function(index) {
				var that = $(this);
				if(index >= indexMenu){
					var li = that.data('parent'),
						margin = {};
					that.find('.' + options.activeClass).removeClass(options.activeClass);
					that.data('parent').removeClass(options.activeClass);
					if(li.hasClass(mainMenuCls)){
						margin = {'margin-top': -that.outerHeight()};
	 				} else {
	 					margin = {'margin-left': -that.outerWidth()};
	 				}
	 				that.children().stop().animate(
	 					margin,
	 					options.duration,
	 					function() {
							that.css('top', '-1000px');
							that.removeClass(activeMenuCls);
						}
					);
				}
			});
 		},
 		destroy: function() {
 			$.removeData(this.element[0], pluginName);
 		}
 	};

 	$.fn[pluginName] = function(options, params) {
 		return this.each(function() {
 			var intance = $.data(this, pluginName);
 			if (!intance) {
 				$.data(this, pluginName, new Plugin(this, options));
 			} else if (intance[options]){
 				intance[options](params);
 			}
 		})
 	}

 	$.fn[pluginName].defaults = {
 		duration: 300,
 		hideDelay: 2000,
 		activeClass: 'active'
 	};

 	$(function() {
 		$('[data-' + pluginName + ']')[pluginName]({

 		});
 	});


 }(jQuery, window))
