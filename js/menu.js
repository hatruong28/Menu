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

 	var pluginName = 'menu';

 	function Menu(element, options){
 		this.element = $(element);
 		this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data, options);
 		this.init();
 	}

 	Menu.prototype = {
 		init: function() {
 			var that = this,
 				options = this.options,
 				sub;

 			var subMenu = this.element.find('li > ul');
 			this.element.children().addClass('main-menu');

 			subMenu.each(function() {
 				var parent = $(this).parent(),
 					parentPos = parent.position(),
 					pos;
 				if($(this).parent().hasClass('main-menu')){
 					pos = {left: parentPos.left, top: parentPos.top + 42};
 					$(this).css({
	 					'position': 'absolute',
	 					'top': '0',
	 					'margin-top': -$(this).outerHeight()
	 				});
	 				$(this).addClass('first-sub');
 				} else {
 					parentPos = parent.parent().data('pos');
 					var top = parent.index() * 41 + parentPos.top,
 						left = parentPos.left + parent.outerWidth() + 1;
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
					'width': $(this).outerWidth(),
					'height': $(this).outerHeight() + 4
				});
				child.parent().data('child', child);
				child.data('parent', child.parent());
				child.appendTo($('body'));
 			});

 			/*$('#nav li').on('mouseenter', function() {
 				$('.active').removeClass('active');
 				$(this).addClass('active');
 				var menu = $('.active-menu');
 				menu.each(function(index) {
 					var that = $(this);
 					if(index == 0){
 						$(this).removeClass('active-menu');
						$(this).children().stop().animate({
							'margin-top': -$(this).outerHeight()
						}, options.duration, function() {
							that.css('top', '-1000px');
						});
 					} else {
 						$(this).removeClass('active-menu');
						$(this).children().stop().animate({
							'margin-left': -$(this).outerWidth()
						}, options.duration, function() {
							that.css('top', '-1000px');
						});
 					}
 				})
 				var newChild = $(this).data('child');
 				if(newChild){
 					newChild.addClass('active-menu');
 					var childPos = newChild.data('pos');
 					newChild.css('top', childPos.top);
					newChild.children().stop().animate({
 						'margin-top': 0
 					}, options.duration);
 					$('.active-menu li').off('mouseenter').on('mouseenter', mouseenter);
 				}
 			});

 			var mouseenter = function() {
 				var newChild = $(this).data('child');
 				$('.current-menu').removeClass('current-menu');
 				$(this).closest('div.active-menu').find('.active').removeClass('active');
 				$(this).addClass('active');
 				$(this).closest('div.active-menu').addClass('current-menu');
 				if($('div.active-menu').length > 1 
 					&& $(this).closest('div.active-menu')[0] !== $('div.active-menu').last()[0]){
 					var activeMenu = $('.active-menu'),
 						current = activeMenu.filter('.current-menu'),
 						indexMenu = activeMenu.index(current);
 					activeMenu.each(function(index) {
 						if(index > indexMenu)
 							mouseleave($(this));
 					});
 				}
 				if(newChild){
 					newChild.addClass('active-menu');
 					var pos = newChild.data('pos');
 					newChild.css('top', pos.top);
					newChild.children().stop().animate({
						'margin-left': 0
					}, options.duration, 'swing');
 					$('.active-menu li').off('mouseenter').on('mouseenter', mouseenter);
 				}
 			};*/
 			var currentMenu;

 			that.element.find('li').on('mouseenter', function(e) {
 				var newChild = $(this).data('child');
 				if(currentMenu){
					that.hideMenu(currentMenu);
				}
 				if(newChild) {
 					currentMenu = newChild;
 					that.showMenu(newChild);
 				} else {
 					$(this).parent().find('.active').removeClass('active');
 					$(this).addClass('active');
 				}
 			});

 			var showMenu = function(menu) {
 				menu.addClass('active-menu');
				var pos = menu.data('pos'),
					li = menu.data('parent'),
					margin = {};
				menu.css('top', pos.top);
				$('.active-menu li').off('mouseenter').on('mouseenter', function() {
					var newChild = $(this).data('child');
					if($(this).closest('div.active-menu')[0] !== $('div.active-menu').last()[0]) {
						$(this).closest('div.active-menu').addClass('current-menu');
	 					var activeMenu = $('.active-menu'),
	 						current = activeMenu.filter('.current-menu'),
	 						indexMenu = activeMenu.index(current);
	 					$('.current-menu').removeClass('current-menu');
	 					that.hideMenu($(activeMenu[indexMenu + 1]));
	 				}
	 				$(this).closest('div.active-menu').find('.active').removeClass('active');
	 				$(this).addClass('active');
 					if(newChild){
 						showMenu(newChild);
 					}
				});
				if(li.hasClass('main-menu')){
					$('#nav').find('li.active').removeClass('active');
					li.addClass('active');
					margin = {'margin-top': 0};
				} else {
					margin = {'margin-left': 0};
					if(!li.hasClass('active')){
						li.closest('div').find('.active').removeClass('active');
						li.addClass('active');
						showMenu(li.closest('div'));
					}
				}
				menu.children().stop().animate(margin, options.duration);
				$('div.active-menu').off('mouseleave').on('mouseleave', function() {
		 			var menu = $('div.active-menu').first();
		 			that.element.find('li.active').removeClass('active');
		 			that.hideMenu(menu);
		 		});
 			};

 			var hideMenu = function(menu) {
 				menu.addClass('current-menu');
 				var activeMenu = $('.active-menu'),
					current = activeMenu.filter('.current-menu'),
					indexMenu = activeMenu.index(current);
				menu.removeClass('current-menu');
				activeMenu.each(function(index) {
					var that = $(this);
					if(index >= indexMenu){
						var li = that.data('parent'),
							margin = {};
						that.find('.active').removeClass('active');
						that.removeClass('active-menu');
						if(li.hasClass('main-menu')){
							margin = {'margin-top': -$(this).outerHeight()};
		 				} else {
		 					margin = {'margin-left': -$(this).outerWidth()};
		 				}
		 				that.children().stop().animate(
		 					margin,
		 					options.duration,
		 					function() {
								that.css('top', '-1000px');
							}
						);
					}
				});
 			};

 			var mouseleave = function(menu) {
 				menu.find('.active').removeClass('active');
 				menu.removeClass('active-menu');
				menu.children().stop().animate({
					'margin-left': -menu.outerWidth()
				}, options.duration, function() {
					menu.css('top', '-1000px');
				});
 			};

 		},
 		showMenu: function(menu) {
 			var that = this,
 				options = that.options;
 			menu.addClass('active-menu');
			var pos = menu.data('pos'),
				li = menu.data('parent'),
				margin = {};
			menu.css('top', pos.top);
			$('.active-menu li').off('mouseenter').on('mouseenter', function() {
				var newChild = $(this).data('child');
				//that.showMenu($(this).closest('div.active-menu'));
				if($(this).closest('div.active-menu')[0] !== $('div.active-menu').last()[0]) {
					$(this).closest('div.active-menu').addClass('current-menu');
 					var activeMenu = $('.active-menu'),
 						current = activeMenu.filter('.current-menu'),
 						indexMenu = activeMenu.index(current);
 					$('.current-menu').removeClass('current-menu');
 					that.hideMenu($(activeMenu[indexMenu + 1]));
 				}
 				$(this).closest('div.active-menu').find('.active').removeClass('active');
 				$(this).addClass('active');
				if(newChild){
					that.showMenu(newChild);
				}
			});
			if(li.hasClass('main-menu')){
				$('#nav').find('li.active').removeClass('active');
				li.addClass('active');
				margin = {'margin-top': 0};
			} else {
				margin = {'margin-left': 0};
				if(!li.hasClass('active')){
					li.closest('div').find('.active').removeClass('active');
					li.addClass('active');
					that.showMenu(li.closest('div'));
				}
			}
			menu.children().stop().animate(margin, options.duration);
 		},
 		hideMenu: function(menu) {
 			var that = this,
 				options = that.options;
 			menu.addClass('current-menu');
			var activeMenu = $('.active-menu'),
				current = activeMenu.filter('.current-menu'),
				indexMenu = activeMenu.index(current);
			menu.removeClass('current-menu');
			activeMenu.each(function(index) {
				var that = $(this);
				if(index >= indexMenu){
					var li = that.data('parent'),
						margin = {};
					that.find('.active').removeClass('active');
					if(li.hasClass('main-menu')){
						margin = {'margin-top': -$(this).outerHeight()};
	 				} else {
	 					margin = {'margin-left': -$(this).outerWidth()};
	 				}
	 				that.children().stop().animate(
	 					margin,
	 					options.duration,
	 					function() {
							that.css('top', '-1000px');
							that.removeClass('active-menu');
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
 				$.data(this, pluginName, new Menu(this, options));
 			} else if (intance[options]){
 				intance[options](params);
 			}
 		})
 	}

 	$.fn[pluginName].defaults = {
 		duration: 200,
 		fadeOutTime: 1000
 	};

 	$(function() {
 		$('[data-' + pluginName + ']')[pluginName]({

 		});
 	});


 }(jQuery, window))