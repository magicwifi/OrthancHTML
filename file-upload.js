var pendingUploads = [];
var currentUpload = 0;
var totalUpload = 0;

$(document).ready(function() {
  var info = $('#list-info');
  // Initialize the jQuery File Upload widget:
  $('#fileupload').fileupload({
    //dataType: 'json',
    //maxChunkSize: 500,
    //sequentialUploads: true,
    limitConcurrentUploads: 3,
    add: function (e, data) {
      pendingUploads.push(data);
    },
    done: function (e, data) { 
    	//var results = jQuery.parseJSON(data.result);
	var result = data.result.Status;
        if (result ==='Success' ||result ==='AlreadyStored'  ){
        	//info.append('<li>' + data.result.ID + '</li>');
		  $.getJSON(data.result.Path, function(json){
			series = json.ParentSeries
        	info.append('<div>' + data.result.ID+'<a style="padding-left: 260px;" href="/web-viewer/app/viewer.html?series='+series+'">PC查看</a>'+'<a style="padding-left: 260px;" href="explorer.html#instance?uuid='+data.result.ID+'" >详细信息</a>'+'<a style="padding-left: 260px;" href="#" onclick="window.location.href=\'/dwv-plugin/dwv/viewers/mobile/index.html?input=http://117.34.78.199:8042'+data.result.Path+'/file&dwvReplaceMode=void\'" >手机查看</a>'+'</div>');
				
  		});
	}
    } 
  })
    .bind('fileuploadstop', function(e, data) {
      $('#upload-button').removeClass('ui-disabled');
      //$('#upload-abort').addClass('ui-disabled');
      $('#progress .bar').css('width', '100%');
      if ($('#progress .label').text() != 'Failure')
        $('#progress .label').text('Done');
    })
    .bind('fileuploadfail', function(e, data) {
      $('#progress .bar')
        .css('width', '100%')
        .css('background-color', 'red');
      $('#progress .label').text('Failure');
    })
    .bind('fileuploaddrop', function (e, data) {
      var target = $('#upload-list');
      $.each(data.files, function (index, file) {
        target.append('<li class="pending-file">' + file.name + '</li>');
      });
      target.listview('refresh');
    })
    .bind('fileuploadsend', function (e, data) {
      // Update the progress bar. Note: for some weird reason, the
      // "fileuploadprogressall" does not work under Firefox.
      var progress = parseInt(currentUpload / totalUploads * 100, 10);
      currentUpload += 1;
      $('#progress .label').text('Uploading: ' + progress + '%');
      $('#progress .bar')
        .css('width', progress + '%')
        .css('background-color', 'green');
    });
});



$('#upload').live('pageshow', function() {
  $('#fileupload').fileupload('enable');
});

$('#upload').live('pagehide', function() {
  $('#fileupload').fileupload('disable');
});


$('#upload-button').live('click', function() {
  var pu = pendingUploads;
  pendingUploads = [];

  $('.pending-file').remove();
  $('#upload-list').listview('refresh');
  $('#progress .bar').css('width', '0%');
  $('#progress .label').text('');

  currentUpload = 1;
  totalUploads = pu.length + 1;
  if (pu.length > 0) {
    $('#upload-button').addClass('ui-disabled');
    //$('#upload-abort').removeClass('ui-disabled');
  }
  for (var i = 0; i < pu.length; i++) {
    pu[i].submit(
    function(event) {
	alert('begin2');
    } 
    );
  }
});

$('#upload-clear').live('click', function() {
  pendingUploads = [];
  $('.pending-file').remove();
  $('#upload-list').listview('refresh');
});

/*$('#upload-abort').live('click', function() {
  $('#fileupload').fileupload().abort();
  });*/
