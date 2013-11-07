var Logger = function($) {

	function Logger() {
	          
	    if (this instanceof Logger) {

	    	var that = this;

			var id = 'web-commons-logger';

			var $box = $('<div style="display: none; position: fixed; *position: absolute; top: 10px; right: 10px; width: 600px; height: 300px; z-index: 9999; border: 1px solid #ddd;  font: normal 12px \'Courier New\', Courier, monospace; border: 1px solid #DDD; background: #FFF;"></div>');
			$box.css('opacity', 0.93);              

			var $title = $('<div style="position: relative; text-indent: 5px; line-height: 18px; background: #DDD;"><b>'+id+':</b></div>');
			var $close = $('<div style="position: absolute; top: 0; right: 5px;"><b>x</b></div>');
			$close.on('click', function() {
			  that.hide();
			  that.clear();
			});
			$title.append($close);
			$box.append($title);

			var $content = $('<div class="log" style="word-wrap: break-word; word-break: break-all; height: 282px; padding: 0 5px;"></div>');
			$content.css('overflow-y', 'scroll');
			$box.append($content);

			$('body', document).append($box);

			this.$box = $box;
		}
	}

	var colors = {
		'number': '#099',
		'string': '#D14',
		'function': '#009926',
		'array': '#51A841',
		'object': '#444',
		'boolean': '#00F',
		'undefined': '#444',
		'null': '#777',
		'property': '#333',
		'regexp': '#009926'
	};

	function stylize(str, useHtml, type) {
		return useHtml ? '<b style="color: ' +colors[type] +'">' +str +'</b>' : str;
	}

	function serialize(any, useHtml) {

		var type = $.type(any);
		var builder = [];
		var res;

		switch(type) {

			case 'function':
				res = ('' + any).replace(/\s+/gim, ' ').replace(/\r?\n/gim, '').match(/.+?\{/gim)+'}';
				break;

			case 'array':
				for (var i = 0, l = any.length; i < l; ++i) {
					builder.push(serialize(any[i], useHtml));
				}
				res = '['+ builder.join(', ') +']';
				break;

			case 'object':
				for (var k in any) {
					if (any.hasOwnProperty(k)) {
						builder.push(
							stylize("'"+k+"'", useHtml, 'property')+': ' +serialize(any[k], useHtml)
						);
					}
				}
				res = '{'+ builder.join(', ') +'}';
				break;

			case 'null':
			case 'undefined':
				res = type;
				break; 

			case 'regexp':
				any = ('' + any);
			case 'string': 
				any = useHtml ? 
					any.replace(/[<>]/gim, function(k) {
						return '&#' + k.charCodeAt(0) + ';';
					}) 
					: any;
				res = '"' +any.replace(/(["'\\])/gim, '\\$1') +'"'; 
				break; 
			case 'number':
			case 'boolean':
				res = any;
				break; 
		}
		return stylize(res, useHtml, type);
	}

	Logger.prototype = {

		log: function(/*args*/) {
			this.$box.show();

			var args = Array.prototype.slice.call(arguments);
			var res = [];
			for (var i = 0, l = args.length; i < l; ++i) {
				res.push(serialize(args[i], true));
			}

			var $log = this.$box.children('.log');
			$log.append('<p style="margin: 0.5em 0;">' +res.join(', ') +'</p>');
			$log.clearQueue();
			$log.animate({scrollTop: $log[0].scrollHeight});
		},

		show: function() {
			this.$box.show();
		},

		hide: function() {
			this.$box.hide('fast');
		},

		clear: function() {
			this.$box.children('.log').empty();
		}
	};

	return Logger;

}(jQuery);
