/**
 * Collection of open source reusable JavaScript snippets.
 * jQuery 1.5+ required (1.9+ recommended)
 */
 
var web = (function (window, $)
{
	/*private static*/ var preloadedImgs = [];

	return {

		/** Set to true for debug mode on */
		debug: false,

		/** requires "utils.debug = true" to work */
		log: function ()
		{
			if (this.debug)
			{
				var str = Array.prototype.slice.call(arguments);
				if (window.console && console.log)
					console.log(str);
				else
					alert(str);
			}
		},

		/** utils.preloadImgs([
		 *   '/Sistema/includes/imgs/imagem1.jpg',
		 *   '/Sistema/includes/imgs/imagem2.jpg'
		 * ]);
		 */
		preloadImgs: function (arrayOfSources)
		{
			$(arrayOfSources).each(function ()
			{
				if (typeof this == 'string')
				{
					var img = $('<img/>')[0];
					img.src = this.toString();
					preloadedImgs.push(img);
				}
			});
		},

		/** utils.submit({
		 *   url: 'http://www.google.com',
		 *   forms: [ '#form1', '#form2' ],
		 *   params: {
		 *     'userVo.codigo': 120,
		 *     'userVo.nome': 'Joaozinho'
		 *   },
		 *   method: 'POST'
		 * });
		 */
		submit: function (data /* = {url, forms, params, method}*/ )
		{
			var finalParams = {};
			$(data.forms).each(function ()
			{
				var serialization = $(this).serializeArray();
				for (var k in serialization)
				{
					if (serialization.hasOwnProperty(k))
					{
						finalParams[serialization[k].name] = serialization[k].value;
					}
				}
			});
			var params = data.params;
			if (params)
			{
				for (var name in params)
				{
					if (params.hasOwnProperty(name))
					{
						finalParams[name] = params[name];
					}
				}
			}
			var inputs = [];
			for (var name in finalParams)
			{
				if (finalParams.hasOwnProperty(name))
				{
					inputs.push('<input type="hidden" name="' + name + '" value="' + finalParams[name] + '"/>');
				}
			}
			var form = $('<form></form>',
			{
				method: data.method || 'POST',
				action: data.url
			});
			$(document.body).append(form.append(inputs.join('')));
			form.submit();
		},

		/** maxlength for <textarea> elements */
		limitTextAreaLength: function (selector, size)
		{
			$(selector).each(function ()
			{
				var self = $(this);
				self.attr('maxlength', size);
				self.data('maxlength', size);
				self.bind("keypress cut copy paste", function (event)
				{
					var textArea = $(this);
					setTimeout(function ()
					{
						if (textArea.val().length > size)
						{
							textArea.val(textArea.val().substr(0, size));
						}
						textArea.data('remaininglength', size - textArea.val().length)
						textArea = event = null;
					}, 100);
				});
			})
		},
		
		requestAnimationFrame: (function ()
		{
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function (callback)
				{
					window.setTimeout(callback, 1000 / 60);
			};
		})(),

		/**
		 * Ease object logging for developers.
		 * ex:
		 *     console.log(utils.typify(someObject))
		 */
		typify: function (obj, ownProperties, separator)
		{
			var prop, type, cache = [];
			for (prop in obj)
			{
				if (ownProperties && !obj.hasOwnProperty(prop)) continue;
				type = typeof obj[prop];
				cache.push(prop + (type === 'function' ? '()' : ' :' +
					(Object.prototype.toString.call(obj[prop]) === '[object Array]' ? 'Array' : type.charAt(0).toUpperCase() + type.substr(1))));
			}
			return cache.join(separator || ', ');
		},

		numberFormat: function (number, decimals, dec_point, thousands_sep)
		{
			// http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
			number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
			var n = !isFinite(+number) ? 0 : +number,
				prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
				sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
				dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
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
		addZeros: function (number, length)
		{
			length = Math.max(length - ('' + number).length, 0);
			for (var s = ''; length--;)
			{
				s += '0';
			}
			return s + number;
		},

		populateFields: function (data, root)
		{
			$.each(data, function (key, value)
			{
				var $el = $('[name=' + key + ']', root);
				switch ($el.attr("type"))
				{
				case "radio":
				case "checkbox":
					$el.each(function ()
					{
						if ($(this).attr('value') == value)
						{
							$(this).attr("checked", value);
						}
					});
					break;
				default:
					$el.val(value);
				}
			});
		}
	};
})(this, jQuery);
