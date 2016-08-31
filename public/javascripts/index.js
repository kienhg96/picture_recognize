$(document).ready(function(){
	var files = null;
	var contents = $('#contents');
	$('input[type=file]').on('change', function(e){
		files = e.target.files;
	});
	$('form').submit(function(e){
		e.stopPropagation();
		e.preventDefault();
		$('.btnSubmit').prop('disabled', true);
		$('.btnSubmit').val('Uploading...');
		var data = new FormData();
		data.append('image', files[0]);
		$.ajax({
			url: '/upload', 
			type: 'POST',
			data: data,
			cache: false,
			dataType: 'json',
			processData: false,
			contentType: false,
			success: function(data, textStatus, jqXHR) {
				if (typeof data.error === 'undefined') {
					renderElement(data);
				}
				else {
					$('.btnSubmit').prop('disabled', false);
					console.log('Errors: ' + data.error);
					alert('Error Occur, views console log');
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('.btnSubmit').prop('disabled', false);
				console.log('Errors: ' + textStatus);
				alert('Error Occur, views console log');
			}
		});
	});
	var renderElement = function(data){
		//console.log(data);
		var caps = data.description.captions[0];
		var tag = data.description.tags[0];
		for (var i = 1; i < data.description.tags.length; i++){
			tag += ' - ' + data.description.tags[i];
		}
		var text = caps.text.split('');
		text[0] = text[0].toUpperCase();
		text = text.join('');
		var html = 
			'<img src="' + data.url + '">' + 
			'<div class="descriptions">' +
			'<h3>' + text + '</h3>'+
			'<h5>Confidence: ' + data.description.captions[0].confidence + '</h5>' +
 			'<h6><b>Tag</b>: ' + tag + '</h6>' +
			'</div>';
		contents.html(html);
		$('.btnSubmit').prop('disabled', false);
		$('.btnSubmit').val('Upload Image');
	}
});