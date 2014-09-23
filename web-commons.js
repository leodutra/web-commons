
/**
 * Collection of useful JavaScript snippets, integrated in one open source lib.
 * jQuery 1.5+ required (1.9+ recommended)
 * 
 * MIT License (MIT) Copyright (c) 2013 Leonardo Dutra
 * https://github.com/LeoDutra/web-commons/blob/master/LICENSE
 */
 
(function (factory) {
	var bundle = factory(window, jQuery);
	if (typeof window !== 'undefined') window.webs = bundle;
	else if (typeof module !== 'undefined' && module.exports) module.exports = bundle;
})
(function (window, $) // isolates scope
{
	// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
	'use strict';
	
	$ = window.jQuery;
	if (!$) throw 'jQuery is required by web-commons';
	
	var JS_TYPES = "Array Object Function RegExp String Boolean Number Undefined Null Date Error".split(' ');
	
	var TO_STRING = Object.prototype.toString;
	
	var loggerInstance = null;
	
	function class2Type(any) { // builds on first usage and then uses cache
		
		if (class2Type._cached === void 0) {
			var classes2Types = {};
			for (var i = JS_TYPES.length, type; i--;) {
				type = JS_TYPES[i];
				classes2Types["[object " + type + "]"] = type.toLowerCase();
			}
			class2Type._cached = classes2Types;
		}
		
		return class2Type._cached[TO_STRING.call(any)];
	}

	function logByAddon(args) {
		if (web.Logger) {
			if (loggerInstance === null) loggerInstance = new web.Logger();
			web.Logger.prototype.log.apply(loggerInstance, args);
			return true;
		}
	}


	return {

		/** Set to true for debug mode on */
		debug: false,
		
		
		/**
		 * Check for the types: Array Object Function RegExp String Boolean Number Undefined Null Date Error
		 * any unknown type will be returned as 'object'
		 */
		type: function(any) {
			
			if (any == void 0) { // undefined is true too
				return any + '';
			}
			
			var type = typeof any;
			return type == 'object' || type == 'function' ?
				class2Type(any) || 'object' : type;
		},
		
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
					type = web.type(value);
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

		/** Logs when debug mode is set to "true" */
		log: (function () {
			if (typeof console == 'object') {
				if (typeof console.log == 'object' || window.opera) {
					return function() {
						if (web.debug && !logByAddon(arguments)) Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
					};
				}
				return function() {
					if (web.debug && !logByAddon(arguments)) console.log.apply(console, arguments);
				};
			}
			return function() {
				if (web.debug) logByAddon(arguments);
			};

		})(),

		/** .submit({
		 *   url: 'http://www.google.com',
		 *   form: '#form1',
		 *   properties: {
		 *     'userVo.codigo': 120,
		 *     'userVo.nome': 'Joaozinho'
		 *   },
		 *   method: 'POST'
		 * });
		 */
		submit: function (data /* {url, forms, properties, method} */)
		{
			var inputs = '', properties = data.properties || {};

			function add(name, value) {
				inputs += '<input type="hidden" name="' + name + '" value="' + value + '"/>';
			}

			$.each($(data.forms).serializeArray(), function(i,obj) {
				if (!properties.hasOwnProperty(obj.name)) {
					add(obj.name, obj.value);
				}
			});

			$.each(properties, function(key,value) {
				if (properties.hasOwnProperty(key)) {
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
		limitTextArea: function (textArea, size)
		{
			if (typeof size == 'number') {
				$(textArea).each(function ()
				{
					var $el = $(this);
					$el.attr('maxlength', size);
					size = $el.bind("keypress cut copy paste", function (event)
					{
						var $el = $(this);
						setTimeout(function ()
						{
							if ($el.val().length > size)
							{
								$el.val($el.val().substr(0, size));
							}
							$el.data('remaininglength', size - $el.val().length);
							$el = event = null;
						}, 100);
					});
				});
			}
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
		
		smartCreateIFrame: function(opts, attrs) {
			/*
				opts = {
					src:String="javascript:false;", 
					scrollY:Boolean=true, 
					scrollX:Boolean=true, 
					seamless:Boolean=true
				}
			*/
		 
			opts = opts || {};
			var scrollY = opts.scrollY !== false;
			var scrollX = opts.scrollX !== false;
			opts.seamless = opts.seamless !== false;
			
			var baseAttr = {
		 
				allowtransparency: opts.seamless,
				frameborder: '0',
				border: '0',
		 
				// IE FIX BEGIN
				scrolling: scrollY || scrollX ? 'auto' : 'no' ,
				horizontalscrolling: scrollX ? 'yes' : 'no',
				verticalscrolling: scrollY ? 'yes' : 'no',
				// IE FIX END
				
				css: {
					// IE FIX BEGIN
					position:   'relative',
					'overflow-x': scrollX ? 'auto' : 'hidden', 
					'overflow-y': scrollY ? 'auto' : 'hidden'
					// IE FIX END
				},
				src: opts.src || 'about:blank'
			};
		 
			if (opts.seamless) {
				baseAttr.seamless = "seamless";
			}
		 
			if (attrs && typeof attrs == 'object') {
				$.extend(baseAttr, attrs);
			}
		 
			return $('<iframe>', baseAttr);
		},

		numFormat: function (number, options/*{decimals:Number, decimalSeparator:String, thousandsSeparator:String}*/)
		{
			// http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
			number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
			var n = !isFinite(+number) ? 0 : +number,
				prec = !isFinite(+options.decimals) ? 0 : Math.abs(options.decimals),
				sep = options.thousandsSeparator == void 0 ? ',' : options.thousandsSeparator,
				dec = options.decimalSeparator == void 0 ? '.' : options.decimalSeparator,
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
		
		leftPad: function(value, size, pad) { // very very fast
			if (value.length < size) {
				size -= value.length;
				var res = '';
				for(;;) {
					if (size & 1) res += pad;
					size >>= 1;
					if (size) pad += pad;
					else break;
				}
				return res + value;
			}
			return value;
		},
		
		rightPad: function(value, size, pad) {
			if (value.length < size) {
				size -= value.length;
				for(;;) {
					if (size & 1) value += pad;
					size >>= 1;
					if (size) pad += pad;
					else break;
				}
			}
			return value;
		},

		populate: function (nameValue, root/* =document */)
		{
			if (web.type(nameValue) == 'object') {
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
			return str.replace(/[<>&]/gm, function (match) {
				return '&' + {
					'<':  'lt',
					'>':  'gt',
				///[<>&\r\n"']/gm
					'&':  'amp'
					//, '\r': '#13',
					// '\n': '#10',
					// '"':  'quot',
					// "'":  'apos'
				}[match] + ';';
			});
		},

		unescapeHTML: function(str) {
			return str.replace(/&(lt|gt|amp|quot|apos|#13|#10);/gm, function (i, stored) {
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

});
