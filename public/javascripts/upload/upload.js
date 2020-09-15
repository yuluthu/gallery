var uploadedFiles = [];

$(document).ready(() => {
}).on('change', 'input#fileUpload', () => {
    let input = document.getElementById('fileUpload');
    var file = input.files[0];
    var upload = YUL.NewAjax('upload/uploadFile', file, {fileUpload: true});
});