
if (typeof web !== 'object') {
	web = {};
}

web.MsgHandler = (function() {

	function MsgHandler(containerSelector, listID) {
		if (this instanceof MsgHandler) {
			this.timeout = null;
			this.containerQuery = containerSelector;
			this.listID = listID;
		}
	}

	MsgHandler.prototype = {

		send: function(msg, sendCallback, removeCallback) {

			if (this.timeout) clearTimeout(this.timeout);

			var $container = $(this.containerQuery);
			var $ul = $container.children('#' + this.listID);

			if (!$ul.length) { // ADD LIST
				$ul = $('<ul>', {id: this.listID}).appendTo($container);
			}	
			
			// VERIFICA MSG REPETIDA 
			var $existing = $ul.children().filter(function() {
				return this.innerHTML === msg;
			});
		
			// SE MSG REPETIDA
			if ($existing.length) {
				
				clearTimeout($existing.data('msghandlerjs-timeout-id'));
					
				$existing.remove().appendTo($ul);
				if (typeof sendCallback === 'function') sendCallback();
				
				$existing.data('msghandlerjs-timeout-id', setTimeout(
					function() { // FADE LIST-ITEM
						$existing.fadeOut('slow', function() {
							this.remove();
							if (typeof removeCallback === 'function') {
								removeCallback();
								removeCallback = null; // prevent memory leak
							}
						});
						$existing = null; // prevent memory leak
					}
				, 5000));
			}
			
			// SE NOVA MSG
			else {
				var $msg = $('<li>'+ msg + '</li>');
				
				$ul.append($msg).parent().show(sendCallback);
				
				this.timeout = setTimeout(function() {
					$container.fadeOut(200, utils.recalcHeightFillers);
					$container = null;  // prevent memory leak
				}, 5000);
			
				$msg.data('msghandlerjs-timeout-id', setTimeout(
					function() { // FADE LIST-ITEM
						$msg.fadeOut('slow', function() {
							this.remove();
							if (typeof removeCallback === 'function') {
								removeCallback();
								removeCallback = null;  // prevent memory leak
							}
						});
						$msg = null; // prevent memory leak
					}
				, 5000));
			}
				
			$ul = msg = null; // prevent memory leak
		}
	};

	return MsgHandler;

})();
