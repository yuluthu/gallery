var uploadedFiles = [];

$(document).ready(() => {
}).on('click', '#fileUpload', () => {
    console.log('yeet')
    let $this = $(this);
    console.log('yeet')
    var file = $this.prop('files');
    var upload = YUL.NewAjax('upload/uploadFile', {file});
});