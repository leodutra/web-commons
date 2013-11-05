var Logger = function($) {

	function Logger() {
	          
	    if (this instanceof Logger) {

	    	var that = this;
			var id = 'web-commons-logger';

			var box = $('<div style="display: none; position: absolute; top: 10px; right: 10px; width: 400px; height: 300px; z-index: 9999; border: 1px solid #ddd;  font: normal 11px \'Courier New\', Courier, monospace; border: 1px solid #DDD;background: #FFF;"></div>');
			box.css('opacity', 0.93);              
			           
			var close = $('<div style="position: absolute; right: 5px;line-height: 18px;">x</div>');
			close.on('click', function() {
			  that.hide();
			  that.clear();
			});
			box.append(close);

			var title = $('<div style="text-indent: 5px; line-height: 18px; background: #DDD;">'+id+':</div>');
			box.append(title);

			var content = $('<div class="log" style="word-wrap: break-word; word-break: break-all; width: 100%;height: 282px; padding: 0 5px;"></div>');
			content.css('overflow-y', 'scroll');
			box.append(content);

			$('body', document).append(box);

			this.box = box;
		}
	}

	Logger.prototype = {

		log: function(str) {
			this.box.show();
			this.box.children('.log').append('<div>'+str+'</div>');
		},

		show: function() {
			this.box.show();
		},

		hide: function() {
			this.box.hide();
		},

		clear: function() {
			this.box.children('.log').empty();
		}
	};

}(jQuery);
