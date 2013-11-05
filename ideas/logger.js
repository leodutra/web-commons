var Logger = function($) {

	function Logger() {
	          
	    if (this instanceof Logger) {

	    	var that = this;

			var id = 'web-commons-logger';

			var $box = $('<div style="display: none; position: absolute; top: 10px; right: 10px; width: 400px; height: 300px; z-index: 9999; border: 1px solid #ddd;  font: normal 12px \'Courier New\', Courier, monospace; border: 1px solid #DDD;background: #FFF;"></div>');
			$box.css('opacity', 0.93);              
			           
			var $close = $('<div style="position: absolute; right: 5px;line-height: 18px;"><b>x</b></div>');
			$close.on('click', function() {
			  that.hide();
			  that.clear();
			});
			$box.append($close);

			var $title = $('<div style="text-indent: 5px; line-height: 18px; background: #DDD;"><b>'+id+':</b></div>');
			$box.append($title);

			var $content = $('<div class="log" style="word-wrap: break-word; word-break: break-all; width: 100%;height: 282px; padding: 0 5px;"></div>');
			$content.css('overflow-y', 'scroll');
			$box.append($content);

			$('body', document).append($box);

			this.$box = $box;
		}
	}

	function serialize(any) {
		var colors = this.colors;
		var type = $.type(any);
		var res = '<b style="color: ' +colors[type] +'">';
		var builder = [];
		switch(type) {

			case 'function':
				res += any.toString().replace(/\s+/gm, ' ').replace(/\r?\n/gm, '').match(/.+?\{/gim)+'}';
				break;

			case 'array':
				for (var i = 0, l = any.length; i < l; ++i) {
					builder.push(serialize(any[i]));
				}
				res += '['+ builder.join(', ') +']';
				break;

			case 'object':
				for (var k in any) {
					if (any.hasOwnProperty(k)) {
						builder.push("<b>'" +k +"'</b>: " +serialize(any[k]));
					}
				}
				res += '{'+ builder.join(', ') +'}';
				break;

			case 'null':
			case 'undefined':
				res += type;
				break; 

			case 'string': 
				res += '"' +any +'"'; 
				break; 
			case 'number':
			case 'boolean':
				res += any;
				break; 
		}

		return res + '</b>';
	}

	Logger.prototype = {

		colors = {
			'number': '#099',
			'string': '#D14',
			'function': '#009926',
			'array': '#0086B3',
			'object': '#000',
			'undefined': '#ddd',
			'null': '#bbb',
		},

		log: function(/*args*/) {
			this.$box.show();

			var args = Array.prototype.slice.call(arguments);
			var res = [];
			for (var i = 0, l = args.length; i < l; ++i) {
				res.push(serialize(args[i]));
			}

			var $log = this.$box.children('.log');
			$log.append('<div>' +res.join(', ') +'</div><br/>');
			$log.css('scrollTop', $log.height());
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
