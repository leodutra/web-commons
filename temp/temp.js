var logger = $('<div>', {
    id: 'web-commons-logger',
    css:{
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '400px',
      height: '300px',
      'zIndex': 9999,
      border: '1px solid #ddd',
      background: '#FFF',
      opacity: 0.9,
      padding: '15px 5px 5px 5px',
      font: 'normal 11px "Courier New", Courier, monospace'
    }
  });
  
  logger.append(
    $('<div>', {
      on: {
        click: function() {
          $('#web-commons-logger').hide('fast');
        }
      },
      text: 'x',
      css:{
        position: 'absolute',
        top: '5px',
        right: '5px'
      }
    })
  );
  
  $('body', document).append(logger)
