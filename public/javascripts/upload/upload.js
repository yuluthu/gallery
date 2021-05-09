var uploadedFiles = [];
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
}).on('change', 'input#fileUpload', () => {
    let input = document.getElementById('fileUpload');
    var file = input.files[0];
    var upload = YUL.NewAjax('upload/uploadFile', file, {fileUpload: true});
    upload.then(res => {
        if (res.success) {
            var e = ''
            if (res.isImage) {
                e = '<div class="file col-md-3"><img class="copy-target" data-id="' + res.fileId + '" src="file/' + res.fileId + '"/></div>';
            } else {
                e = '<div class="file col-md-3"><span class="iconify copy-target" data-id="' + res.fileId + '" data-icon="clarity:file-share-2-solid" data-inline="false" data-width="300" data-height="300"></span></div>'
            }
            $('.files-container').append(e);
        }
    });
});