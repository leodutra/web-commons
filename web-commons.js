/**
 * Collection of useful JavaScript snippets, integrated in one open source lib.
 * jQuery 1.5+ required (1.9+ recommended)
 * 
 * MIT License (MIT) Copyright (c) 2013 Leonardo Dutra
 * https://github.com/LeoDutra/web-commons/blob/master/LICENSE
 */
 
var web = (function (window, $, undefined) // isolates scope
{
	// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
	'use strict';
	
	$ = window.jQuery;
	if (!$) throw 'jQuery is required by web-commons';

	return {

		/** Set to true for debug mode on */
		debug: false,

		/** Logs when debug mode is set to "true" */
		log: function (/* a, b, c, d, ... */)
		{
			if (this.debug)
			{
				var str = Array.prototype.slice.call(arguments);
				if (window.console) {
					if (typeof console.log == 'object' || window.opera) {
						Function.prototype.call.call(console.log, console, str);
					}
					else {
						console.log.apply(console, arguments);
					}
				}
				else {
					alert(str);
				}
			}
		},

		/** .submit({
		 *   url: 'http://www.google.com',
		 *   form: '#form1',
		 *   overrides: {
		 *     'userVo.codigo': 120,
		 *     'userVo.nome': 'Joaozinho'
		 *   },
		 *   method: 'POST'
		 * });
		 */
		submit: function (data /* {url, forms, overrides, method} */)
		{
			var k, inputs = '', overrides = data.overrides || {};

			function add(name, value) {
				inputs += '<input type="hidden" name="' + name + '" value="' + value + '"/>';
			}

			$.each($(data.forms).serializeArray(), function(i,obj) {
				if (!overrides.hasOwnProperty(obj.name)) {
					add(obj.name, obj.value);
				}
			});

			$.each(overrides, function(key,value) {
				if (overrides.hasOwnProperty(key)) {
					add(key, value);
				}
			});

			var form = $('<form/>',
			{
				method: data.method || 'POST',
				action: data.url
			});

			$(document.body).append(form.append(inputs));
			form.submit();
		},

		/** .preloadImgs([
		 *   '/Sistema/includes/imgs/imagem1.jpg',
		 *   '/Sistema/includes/imgs/imagem2.jpg'
		 * ]);
		 */
		preloadImgs: function (sources)
		{
			$.each(sources, function(i, src) { $.get(src); });
		},

		/** maxlength for <textarea> elements */
		limitTextAreaLength: function (textArea, size /*=200*/)
		{
			$(textArea).each(function ()
			{
				var $el = $(this);
				size = size || 200;
				$el.attr('maxlength', size);
				size = $el.bind("keypress cut copy paste", function (event)
				{
					var $el = $(this);
					setTimeout(function ()
					{
						if ($el.val().length > size)
						{
							$el.val(el.val().substr(0, size));
						}
						$el.data('remaininglength', size - $el.val().length);
						$el = event = null;
					}, 100);
				});
			});
		},
		
		requestAnimationFrame: (function ()
		{
			return  window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function (callback)
				{
					setTimeout(callback, 16.666667/* 1000/60 */);
				};
		})(),

		/**
		 * Ease object logging for developers.
		 */
		typify: function (obj, inheritedProperties/* =false */, separator/* =', ' */)
		{
			var prop, type, value, fn = [], props = [];
			for (prop in obj)
			{
				if (obj.hasOwnProperty(prop) || inheritedProperties) {
					value = obj[prop];
					type = $.type(value);
					if (type == 'function') {
						fn.push(prop + ('' + value) // string cast
							.replace(/\r?\n/gim, '') // remove line breaks
							.match(/\([^)]*\)/)); // match arguments
					}
					else {
						props.push(prop + ' :' + type);
					}
				}
			}
			return props.concat(fn).join(separator || '\n');
		},

		numberFormat: function (number, decimals, decPoint/* ='.' */, thousandsSepar/* =','*/)
		{
			// http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
			number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
			var n = !isFinite(+number) ? 0 : +number,
				prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
				sep = (typeof thousandsSepar == 'undefined') ? ',' : thousandsSepar,
				dec = (typeof decPoint == 'undefined') ? '.' : decPoint,
				s = '',
				toFixedFix = function (n, prec)
				{
					var k = Math.pow(10, prec);
					return '' + Math.round(n * k) / k;
				};
			// Fix for IE parseFloat(0.55).toFixed(0) = 0;
			s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
			if (s[0].length > 3)
			{
				s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
			}
			if ((s[1] || '').length < prec)
			{
				s[1] = s[1] || '';
				s[1] += new Array(prec - s[1].length + 1).join('0');
			}
			return s.join(dec);
		},

		/** Add zeros on the left: "0000012" */
		leftZeros: function (num, length)
		{
			length = Math.max(length - ('' + num).length, 0);
			for (var s = ''; length--;) s += '0';
			return s + num;
		},

		populate: function (nameValue, root/* =document */)
		{
			if ($.type(nameValue) == 'object') {
				$.each(nameValue, function (name, value)
				{
					$('[name="' + name + '"]', root).each(function ()
					{
						var $el = $(this);
						switch ($el.attr("type"))
						{
							case "radio":
							case "checkbox":
								$el.each(function(){
									$(this).val($.isArray(value) ?  value : [value]);
								});
								break;
							default:
								$el.val(value);
						}
					});
				});
			}
		},

		resetForm: function(forms) {
			$(forms).filter('form').each(function(i, form) {
				form.reset();
			}); 
		},
		
		formData: function (form) {
			var data = {};
		
			function add(name, val) {
				if (data.hasOwnProperty(name)) {
					if ($.isArray(data[name])) {
						data[name].push(val);
					} else {
						data[name] = [data[name], val];
					}
				} else {
					data[name] = val;
				}
			}
			$.each($(form).serializeArray(), function (i, obj) {
				add(obj.name, obj.value);
			});
		
			return data;
		},
		
		escapeHTML: function(str) {
			return str.replace(/[<>&\r\n"']/gm, function (match) {
				return '&' + {
					'<': 'lt',
					'>': 'gt',
					'&': 'amp',
					'\r': "#13",
					'\n': "#10",
					'"': 'quot',
					"'": 'apos'
				}[match] + ';';
			});
		},

		unescapeHTML: function(str) {
			return str.replace(/&(lt|gt|amp|quot|apos|#13|#10);/gm, function (_, stored) {
				return {
					'lt': '<',
					'gt': '>',
					'amp': '&',
					"#13": '\r',
					"#10": '\n',
					'quot': '"',
					'apos': "'"
				}[stored];
			});
		}
	};

})(window);
