var $input;

$(document).ready(() => {
    $input = $('#copy-text')
}).on('click', '.copy-target', function () {
    var $this = $(this);
    var string = ''
    
    var id = $this.attr('data-id');
    
    if (!$input.length) {
        $input = $('<input type="text" style="position: absolute; left: -9999px" aria-hidden="true" tabindex="-1" id="copy-text" value="">');
        $('body').append($input);
    }

    $input.val('https://' + window.location.hostname + '/file/' + id);
    YUL.toClipboard($input);

    $this.popover({
        content: 'URL Copied to Clipboard!',
        placement: 'bottom'
    });

    $this.popover('show')

    setTimeout(() => {
        $this.popover('hide');
    }, 2000)
});