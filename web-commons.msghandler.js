
(function(factory) {
	if (!jQuery) throw 'jQuery is required by web-commons';
	
	var bundle = factory(window, jQuery);
	if (typeof window !== 'undefined') (window.web || window).MsgHandler = bundle(); 
})
(function(window, $) {

	/**
	 * Classe para controle de mensagens de erro, warning, info, etc
	 * 
	 * Dependências: 
	 *   - jQuery 1.8+
	 */
	
	function MsgHandler(containerSelector, liClass) {
		if (this instanceof MsgHandler) {
			this.containerQuery = containerSelector;
			this.liClass = liClass;
		}
	}
	
	MsgHandler.prototype = {
	
		send: function(msg, sendCallback, removeCallback) {
	
			var $container = $(this.containerQuery);
			
			clearTimeout($container.data('msghandlerjs-timeout-id'));
			
			// VERIFICA MSG REPETIDA 
			var $existing = $container.children().filter(function() {
				return this.innerHTML === msg;
			});
		
			// SE MSG REPETIDA
			if ($existing.length) {
				
				clearTimeout($existing.data('msghandlerjs-timeout-id'));
					
				$existing.remove().appendTo($container); // move to the bottom
				
				if (typeof sendCallback === 'function') sendCallback();
					
				
				$existing.data('msghandlerjs-timeout-id', setTimeout(
					function() { // FADE LIST-ITEM
						$existing.fadeOut('slow', function() {
							$(this).remove();
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
				var $msg = $('<li class="' + this.liClass + '">'+ msg + '</li>');
				
				$container.append($msg).show(sendCallback);
				
				$container.data('msghandlerjs-timeout-id', setTimeout(function() {
				
					$container.fadeOut(200, utils.recalcHeightFillers);
					$container = null;  // prevent memory leak
				
				}, 5000));
			
				$msg.data('msghandlerjs-timeout-id', setTimeout(
					function() { // FADE LIST-ITEM
						$msg.fadeOut('slow', function() {
							$(this).remove();
							if (typeof removeCallback === 'function') {
								removeCallback();
								removeCallback = null;  // prevent memory leak
							}
						});
						$msg = null; // prevent memory leak
					}
				, 5000));
			}
		}
	};

	return MsgHandler;

});
