// 绘制皱纹
var face = function () {
    
    var textures = {
        '1': $('#line1')[0], // 额头
        '2': $('#line2')[0], // 浅法令纹
        '3': $('#line3')[0], // 深法令纹
        '4': $('#mask')[0]
    },
    context = null;

 /*   var context = canvas.getContext('2d'); 
    var imgSrc = new Image();
    imgSrc.src='images/face1.jpg';
    var width=800,height=800;
    imgLineLoad=true;
    imgSrc.onload=function(){
        context.drawImage(imgSrc,0,0); 
        //dark(279,400,100,10);
        var imgLine = new Image();
        imgLine.src='images/line.png';
        imgLine.onload=function(){
            drawLine(imgLine,350,216,200,25);
            drawLine(imgLine,320,420,100,25);
        }
        var imgLine2=new Image();
        imgLine2.src='images/line3.png';
        imgLine2.onload=function(){
            drawLine(imgLine2,300,430,141,120);
        }
        //invert();
    }
    */
    
    function invert(){
        var imgd = context.getImageData(0,0,width,height); 
        var pix = imgd.data; 
        //反色处理 
        for(var i=0,n=pix.length;i<n;i+=4) 
        { 
         pix[i] = 255 - pix[i]; //红 
         pix[i+1] = 255-pix[i+1]; //绿 
         pix[i+2] = 255-pix[i+2]; //蓝 
         pix[i+3] = pix[i+3];     //alpha 
        } 
        context.putImageData(imgd,0,0); 
    }
    function drawLine(img,x,y,width,height){ 
        //context.drawImage(img, x, y, width, height);
        temp.width=temp.width;
        var tempContext=temp.getContext('2d'); 
        //tempContext.clear();
        console.log(width);
        tempContext.drawImage(img,0,0,width,height);
        var imgdt=tempContext.getImageData(0,0,width,height);
        var imgd = context.getImageData(x,y,width,height); 
        var pix = imgd.data; 
        var pixt = imgdt.data; 
        for(var i=0,n=pix.length;i<n;i+=4) 
        {
          for(var l=0;l<3;++l){
              var a=pixt[i+l]/255;
              var b=pix[i+l]/255;
              var d=pixt[i+3]/255;
              var c;
              if(a<=0.5){
                c = (2*a-1)*(b-b*b)+b; //红 
              }
              else{
                c = (2*a-1)*(Math.sqrt(b)-b)+b; //红 
              }
              pix[i+l]=(d*c+(1-d)*b)*255;
              //console.log(pix[i+l]);
          }
        } 
              
        context.putImageData(imgd,x,y); 
    }
    
    function drawLineHight(img,x,y,width,height){

        temp.width = temp.width;
        var tempContext=temp.getContext('2d'); 
        //tempContext.clear();
        console.log(width);
        tempContext.drawImage(img,0,0,width,height);
        var imgdt=tempContext.getImageData(0,0,width,height);
        var imgd = context.getImageData(x,y,width,height); 
        var pix = imgd.data; 
        var pixt = imgdt.data; 
        //反色处理 
        //A<=0.5: C=2*A*B

        //A>0.5: C=1-2*(1-A)*(1-B)

        for(var i=0,n=pix.length;i<n;i+=4) 
        {
          for(var l=0;l<3;++l){
              var a=pixt[i+l]/255;
              var b=pix[i+l]/255;
              var d=pixt[i+3]/255;
              if(a<=0.5){
                var c = 2*a*b;//(2*a-1)*(b-b*b)+b; //红 
              }
              else{
                c = 1-2*(1-a)*(1-b);//(2*a-1)*(Math.sqrt(b)-b)+b; //红 
              }
              pix[i+l]=(d*c+(1-d)*b)*255;
          }
        } 
              
        context.putImageData(imgd,x,y); 
    }
    function dark(x,y,width,height){
        var imgd = context.getImageData(x,y,width,height); 
        var pix = imgd.data; 
        //反色处理 
        for(var i=0,n=pix.length;i<n;i+=4) 
        { 
         pix[i] = pix[i]-10; //红 
         pix[i+1] = pix[i+1]-10; //绿 
         pix[i+2] = pix[i+2]-10; //蓝 
         pix[i+3] = pix[i+3];     //alpha 
        } 
        context.putImageData(imgd,x,y); 
    }
    function alpha(){
        imgd = context.getImageData(0,0,width,height); 
        pix = imgd.data; 
        //透明处理 透明度0.6 
        for(var i=0,n=pix.length;i<n;i+=4) 
        { 
         pix[i] =  pix[i]; //红 
         pix[i+1] = pix[i+1]; //绿 
         pix[i+2] = pix[i+2]; //蓝 
         pix[i+3] = pix[i+3]*0.6;     //alpha 
        } 
        context.putImageData(imgd,0,0); 
    }
    
    function draw (id, x, y, w, h) {
        var texture = textures[id];
        if (texture) {
            drawLineHight(texture, x, y, w, h)
        }
    }
    
    return {
        draw: drawLineHight,
        setContext: function (o) {
            context = o;
        }
    }
}();
