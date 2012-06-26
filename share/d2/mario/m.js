var o=new Image();o.onload=function() {var r="",s=119,c=document.createElement("canvas");
c.width=c.height=c.style.width=c.style.height=s,t=c.getContext("2d");t.drawImage(o,0,0);var d=t.getImageData(0,0,s,s).data;for(var i=0;i<d.length;i+=4){if(d[i]>0)r+=String.fromCharCode(d[i]);}
eval(r);Mario(true,1)};o.src="m.png";