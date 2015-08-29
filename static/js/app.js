(function($){

        var extensionsMap = {
                      ".zip" : "fa-file-archive-o",         
                      ".gz" : "fa-file-archive-o",         
                      ".bz2" : "fa-file-archive-o",         
                      ".xz" : "fa-file-archive-o",         
                      ".rar" : "fa-file-archive-o",         
                      ".tar" : "fa-file-archive-o",         
                      ".tgz" : "fa-file-archive-o",         
                      ".tbz2" : "fa-file-archive-o",         
                      ".z" : "fa-file-archive-o",         
                      ".7z" : "fa-file-archive-o",         
                      ".mp3" : "fa-file-audio-o",         
                      ".cs" : "fa-file-code-o",         
                      ".c++" : "fa-file-code-o",         
                      ".cpp" : "fa-file-code-o",         
                      ".js" : "fa-file-code-o",         
                      ".xls" : "fa-file-excel-o",         
                      ".xlsx" : "fa-file-excel-o",         
                      ".png" : "fa-file-image-o",         
                      ".jpg" : "fa-file-image-o",         
                      ".jpeg" : "fa-file-image-o",         
                      ".gif" : "fa-file-image-o",         
                      ".mpeg" : "fa-file-movie-o",         
                      ".pdf" : "fa-file-pdf-o",         
                      ".ppt" : "fa-file-powerpoint-o",         
                      ".pptx" : "fa-file-powerpoint-o",         
                      ".txt" : "fa-file-text-o",         
                      ".log" : "fa-file-text-o",         
                      ".doc" : "fa-file-word-o",         
                      ".docx" : "fa-file-word-o",
                      ".nii" : "icon-sagittal",        
                      ".nii.gz" : "icon-sagittal"         
                    };

  function getFileIcon(ext) {
    return ( ext && extensionsMap[ext.toLowerCase()]) || 'fa-file-o';
  }
  
   // Try getting current path from url
   function getUrlVars() {
       var vars = {};
       var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
           vars[key] = value;
       });
   return vars;
   }

   // Discover path from url
   var idx = getUrlVars()
   if (typeof idx["loc"] == 'undefined'){ var currentPath = null;}
   else { var currentPath = idx["loc"]; }
   console.log(currentPath);

   var options = {
        "bProcessing": true,
        "bServerSide": false,
        "bPaginate": false,
        "bAutoWidth": false,
        "sScrollY":"250px",
        "fnCreatedRow" :  function( nRow, aData, iDataIndex ) {

          // If not a directory, check for brain image, and show
          if (!aData.IsDirectory) {
           var filetype = aData.Class;
           var filename = aData.Name
           var regExp = /[^\/]*$/;
           var currentpath = aData.Path.replace(regExp, '');

            $(nRow).bind("click", function(e){
            if (filetype == "brain") {
                papayaContainers[0].viewer.resetViewer();
                papayaContainers[0].toolbar.updateImageButtons();
                papayaContainers[0].viewer.loadImage(['/static/../' + aData.Path], true)
            };
            e.preventDefault();
          });

          // If directory, bind click
          } else {
          var path = aData.Path;
          $(nRow).bind("click", function(e){
             $.get('/files?path='+ path).then(function(data){
              table.fnClearTable();
              table.fnAddData(data.Data);
              currentPath = path;
            });
            e.preventDefault();
          });
          }
        }, 
        "aoColumns": [
          { "sTitle": "", "mData": null, "bSortable": false, "sClass": "head0", "sWidth": "20px",
            "render": function (data, type, row, meta) {
              if (data.IsDirectory) {
                return "<a href='#' target='_blank'><i class='fa fa-folder'></i>&nbsp;" + data.Name +"</a>";
              } else {
                return "<a href='/" + data.Path + "' target='_blank' class='" + data.Class + "'><i class='fa " + getFileIcon(data.Ext) + "'></i>&nbsp;" + data.Name +"</a>";
              }
            }
          },
          { "sTitle": "", "mData": null, "bSortable": false, "sClass": "head1", "sWidth": "1px",
            "render": function (data, type, row, meta) {
              if (data.IsDirectory) {
                return "";
              } else {
                if ( data.Class == "brain"){
                    return "<a href='/" + data.Path + "' class='" + data.Class + "'><button type='button' class='btn btn-default btn-sm viewnifti'>view</button>&nbsp;</a>";
                } else{
                   return "";
                }
                
              }
            }
          },

        ]
   };

  var table = $(".linksholder").dataTable(options);

  $.get('/files').then(function(data){
      table.fnClearTable();
      table.fnAddData(data.Data);
  });

  $(".up").bind("click", function(e){
    if (!currentPath) return;
    var idx = currentPath.lastIndexOf("/");
    var path =currentPath.substr(0, idx);
    $.get('/files?path='+ path).then(function(data){
        table.fnClearTable();
        table.fnAddData(data.Data);
        currentPath = path;
    });
  });

    //Search bar is too wide
    $("input").css("margin-right","20px")

})(jQuery);
