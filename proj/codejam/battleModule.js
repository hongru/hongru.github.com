// JavaScript 
	//获取绘图区
	var cvs=document.getElementById("ground_dw");
	var ctx=cvs.getContext('2d');
	ctx.lineWidth=5;
	ctx.lineJoin="round";
	ctx.strokeStyle="#FFF";
	ctx.shadowColor = '#26FBFF';
	//定义笔触发光和阴影
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 10;
	var Draging=false;
	//PC
	$("#main_ground").delegate(".role",'mousedown',selectOne);
	$(".stage").delegate("#main_ground",'mousemove',movePath);
	$(".stage").delegate("#main_ground",'mouseup',walk);
	//pad设备
	$("#main_ground").delegate(".role",'touchstart',selectOne);
	document.getElementById("ground_dw").addEventListener('touchstart',function(e){e.preventDefault();},false);
	document.getElementById("M_s").addEventListener('touchmove',function(e){e.preventDefault();},false);
	document.getElementById("main_ground").addEventListener('touchmove',movePathPad,false);
	document.getElementById("main_ground").addEventListener('touchend',walk,false);
	//选择人物：
	var startX,startY,centerX,centerY;
	function selectOne(e){
		e.preventDefault();
		Draging=true;
		startX=$(this).offset().left+95;
		startY=$(this).offset().top;
		$(".selected_role").removeClass('selected_role');
		$(this).stop(true);
		$(this).addClass('selected_role');
		//在人物脚底下绘制椭圆
		drawElli(startX,startY,40,20);
	}
	function movePathPad(e){
		e.preventDefault();
		if(Draging){
			ctx.clearRect(0,0,960,512);
			drawElli(startX,startY,40,20);
			ctx.beginPath();
			ctx.moveTo(centerX,centerY);
			var touch = e.touches[0];
			ctx.lineTo(touch.pageX,touch.pageY-128);
			ctx.closePath();
			for(var i=0;i<3;i++){
				ctx.stroke();
			}
			//绘制终点椭圆
			 drawElli(e.pageX+30,e.pageY-128,30,15)
			 ctx.fillStyle="#FFF";
			 ctx.fill();
		}
	}
	function movePath(e){
		if(Draging){
			ctx.clearRect(0,0,960,512);
			drawElli(startX,startY,40,20);
			ctx.beginPath();
			ctx.moveTo(centerX,centerY);
			ctx.lineTo(e.pageX,e.pageY-128);
			ctx.closePath();
			ctx.stroke();
			
			//绘制终点椭圆
			 drawElli(e.pageX+30,e.pageY-128,30,15);
			 ctx.fillStyle="#FFF";
			 ctx.fill();
		}
	}
	var walk_callback=function(){return false;}
	var role_basic_path='role/spirit_';
	function walk(e){
		ctx.clearRect(0,0,960,512);
		if(centerX>900){centerX=900;}
		if(centerX<0){centerX=0;}
		if(centerY>512){centerX=512;}
		if(centerY<120){centerY=120;}
		var span=Math.pow(eval(Math.pow((centerX-startX-50),2)+Math.pow((centerY-startY),2)),0.5);//计算起点到终点的距离
		var Duration=span*5;//根据距离设置动画间隔
		//转脸
		var spli=$(".selected_role").css('backgroundImage').split('/');
		var ed=spli.length-1;
		var filename=spli[ed];
		if($.browser.safari){filename=filename.substr(0,filename.length-1);}
		else{filename=filename.substr(0,filename.length-2);}
		var filetag=filename.split('_');
		filetag=filetag[filetag.length-1]; 
		if(centerX<startX)//向左走
		{
			$(".selected_role").css({'background':'url('+'role/inver_spirit_'+filetag+')'});
		}
		else//向右走
		{$(".selected_role").css({'background':'url('+'role/spirit_'+filetag+')'});}
		$(".selected_role").animate({top:centerY-128+"px",left:centerX-50+"px"},Duration,walk_callback);
		Draging=false;
	}
	//绘制椭圆的函数，四个参数依次为起点，半长轴，半短轴
	function drawElli(x,y,a,b){
		centerX=x-a;
		centerY=y;
		ctx.beginPath();
		ctx.moveTo(x,y);
		var end=Math.PI*2;
		var step=end/360;
		for(var i=step; i<end; i+=step){
			var NextX=a*Math.cos(i)+centerX;
			var NextY=centerY-b*Math.sin(i);
			ctx.lineTo(NextX,NextY);
		}
		ctx.closePath();
		for(var j=0;j<3;j++){
			ctx.stroke();
		}
	}
	//玩家:最大血量，面板id
	function Player(bloodMax,id,skillcount,img){
		this.skillcount=skillcount;
		this.BloodMax=bloodMax;
		this.BloodCurrent=bloodMax;
		this.IntervalId=null;//用于标记循环中的动画
		this.id="#"+id;
		this.Skills=new Array(skillcount);//定义技能组
		var panel=$("<div class='role'><div class='blood_outer'><div class='blood_inner'></div></div></div>");
		panel.attr('id',id);
		$("#main_ground").append(panel);
		panel.css({'backgroundImage':'url('+role_basic_path+img+'.png)'});
		
	}
	Player.prototype.Attack=null;
	//站在原地的动画
	Player.prototype.Stand=null;
	Player.prototype.Run=null;
	//怪物类，小怪和BOSS统一继承
	function Monster(){
		
	}
	//小怪
	function LittleMonster(){

	}
	//Boss
	function Boss(){
	
	}
	var basic_path="skillicon/";
	function skill(icon,cd,id){
		this.icon=basic_path+icon+'.png';
		this.id="#"+id;
		this.cd=cd;
		var panel=$("<div class='skill'><img src='skillicon/highlight.png' width='80' height='80' alt='highlight' /><div class='mask'></div></div>");
		panel.attr('id',id);
		panel.css({background:'url('+this.icon+')'});
		$("#skill_panel").append(panel);
	}
	skill.prototype.extract=null;
	skill.prototype.selectSkill=function(){}
	skill.prototype.show=function(){$(this.id).show();}
    skill.prototype.hide=function(){$(this.id).hide();}
	skill.prototype.colddown=function(){$(this.id).find('.mask').animate({height:'0'},this.cd,function(){});}
	//各种技能效果
	function Kill_Monster(){}
	function Get_Spirit(){}
	var Star_Exe=null;
	var Origin=0;
	var count=0;
	var Add=function(){
		Origin=eval(Origin-561);
		if(Origin<-7293){Origin=0}
		$("#skill_effect").find('img').css({marginTop:Origin+'px'});
		count++;
		if(count==75){clearInterval(Star_Exe);
			$("#skill_effect").find('img').hide();	
			count=0;
		}
	}
	function Star_Fall(){
		$("#skill_effect").css({height:'561px'});
		$("#skill_effect").find('img').css({marginTop:'-6732px'});
		$("#skill_effect").find('img').show();
		$("#big_skill").hide();
		Star_Exe=setInterval(Add,100);
	}
	function Wood_Spring(){}
	function Iron_Wall(){}
	//普攻效果
	function Attack_Man(){}
	function Attack_Woman(){}
	
	