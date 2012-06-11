
/**
 * 人脸识别模块
 */
window.faceRecongnition = {
	/**
	 * 人脸识别
	 * @param {Object} imgElem
	 */
	recongnition: function(imageElem, callback){
		this.getData(imageElem, function(data){
			if( data.status == "success"){
				
				var _photo = data.photos[0];
				var _width = _photo.width;
				var _height = _photo.height;
				var _ret = [];
				for( var i=0, _tag; _tag = _photo.tags[i]; i++){
					
				
					var _centerX = _width * _tag.center.x/100;
					var _centerY = _height * _tag.center.y/100;
					var _faceW = _width * _tag.width/100;
					var _faceH = _height * _tag.height/100;
					_ret.push({
							x: _centerX - _faceW/2,
							y: _centerY - _faceH/2,
							w: _faceW,
							h: _faceH,
							centerX: _centerX,
							centerY: _centerY,
							roll: _tag.roll,
							 "eye_left": {
				                "x": _width * _tag.eye_left.x/100,
				                "y": _height * _tag.eye_left.y/100,
				            },
				            "eye_right": {
				                "x": _width * _tag.eye_right.x/100,
				                "y": _height * _tag.eye_right.y/100,
				            },
							"mouth_left": {
				                "x": _width * _tag.mouth_left.x/100,
				                "y": _height * _tag.mouth_left.y/100,
				            },
				            "mouth_center": {
				                "x": _width * _tag.mouth_center.x/100,
				                "y": _height * _tag.mouth_center.y/100,
				            },
				            "mouth_right": {
				               "x": _width * _tag.mouth_right.x/100,
				                "y": _height * _tag.mouth_right.y/100,
							},
							"nose": {
				                "x": _width * _tag.nose.x/100,
				                 "y": _height * _tag.nose.y/100,
				            },
						});
						
					
				}
				
				callback (_ret);
			}else{
				callback({
					face: {
						x: 13,
						y:  7,
						w: 50,
						h: 50
						
					}
					
				});
			}
			
			
			
			
		});
		
		
	},
	getData: function(imageElem, callback){
		 requestFaceData(imageElem, function (data) {
		 	callback(data);
	    });


		
	}
	
};

;(function () {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
        
    function dataURItoBlob(dataURI, callback) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs

        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        } else {
            byteString = unescape(dataURI.split(',')[1]);
        }

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(ab);
        return bb.getBlob(mimeString);
    }
        
    function requestFaceData(img, cb) {
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        var data = canvas.toDataURL('image/jpeg', 1.0),
            newblob = dataURItoBlob(data); 
        
        var formdata = new FormData();  
        formdata.append("api_key", "69acd2421eeb16695d4df87768168f59");  
        formdata.append("api_secret", "f69f5d05c86755389b690ce5386f7b71");  
        formdata.append("filename","avatar.jpg");  
         
        formdata.append("file",newblob);   

        $.ajax({  
           url: 'http://api.face.com/faces/detect.json?attributes=age_est,gender,mood,smiling,glasses',  
           data: formdata,  
           cache: false,  
           contentType: false,  
           processData: false,  
           dataType:"json",  
           type: 'POST',  
           success: function (data) {  
                cb && cb(data);  
           }
        }); 
    }

    this.requestFaceData = requestFaceData;
})();


