var _initHzStep2 = function(img){
	
	
		
		window.faceRecongnition.recongnition(img, function(obj){
			window.faceAdjust.init({
				data: obj,
				img: img
			});
			$('#hzDealphotoBar').show();
            Ho.bindFxClick();
		});
		
		$("#hzDealBtn").click(function(){
			
			window.faceAdjust.finish();
			$("#hzDealphotoBar").hide();
			$("#photoBar").show();
			
            // Hz finish, horizon begin
            
            
			var faceData = faceAdjust.getFace();
            Ho.toOlder(faceData);
            $(FiPhoto.image).attr('src', faceAdjust._bgCanvas.toDataURL());
            $('.save-wrap').show();
            //FiPhoto.setHref();
		});
	
    
};
