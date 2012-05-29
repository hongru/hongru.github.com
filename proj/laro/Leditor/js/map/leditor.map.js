Leta.NS('Leditor.map', function (L) {
    var pkg = this,
        $E = L.event,
        $ = L.$;
    var unitW = 0,
        unitH = 0;
    
    function getEls () {
        var els = {};
        els.doc = L.$('#doc'),
        els.inputFile = L.$('#input-file');
        els.tc = $('#texture-container');
        els.ea = $('#edit-area');
        
        pkg.els = els;
    }
    function handFiles (files) {
        console.log(files);
        for (var i = 0; i < files.length; i++) {
            var file = files[i];  
            var imageType = /image.*/;  
              
            if (!file.type.match(imageType)) {  
                continue;  
            }  

            var reader = new FileReader();  
            reader.onload = function (name) {
                return function(e){ 
                    pkg.els.tc.append($('<img data-cmd="get-img" data-imgname="'+name+'" draggable="true" alt="" src="'+e.target.result+'" />'));
                    // init editor 主区域
                    Leditor.map.editor.init();
                }
            }(file.name);
            

            reader.readAsDataURL(file);  
        }
        
    }
    
    function fileInputOnchange (e) {
        var files = e.target.files;
        handFiles(files);
    }

    function bind () {
        $E.dispatch(pkg.els.doc[0], 'click', {
            'upload': function (e, tar) {
                
            }
        });
        $E.on(pkg.els.inputFile[0], 'change', fileInputOnchange);
        
        $E.on(pkg.els.tc[0], 'drop', function (e) {
            e.preventDefault();
            var dt = e.dataTransfer || e.originalEvent.dataTransfer;  
            var files = dt.files; 

            handFiles(files); 
        })
    }
    
    this.init = function () {
        getEls();
        bind();

        pkg.event.init();
    };
});
