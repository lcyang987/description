// window.addEventListener('load',function(){
// 	window.crop=new CropImage({
// 		imgs:document.querySelectorAll('img')
// 	});
// });
class CropImage{
	constructor(opt){		
		this.translateX=opt.translateX?opt.translateX:0;
		this.translateY=opt.translateY?opt.translateY:0;			
		this.show({
			result:opt.vue.result,
			contrastImg:opt.contrastImg
		});
		this.sourceAttr=opt.vue.result.attr;
	}
	createItem(opt){
		let obj=document.createElement(opt.tagName);
		opt.container.appendChild(obj);
		obj.className=opt.class;
		if(opt.attr){
			for(let i in opt.attr){
				obj.setAttribute(i,opt.attr[i]);
			}
		}
		return obj;
	}
	removeItem(obj){
		if(obj&&obj.parentNode){
			obj.parentNode.removeChild(obj);
			for(let i in this){
				if(this[i]==obj){
					delete this[i];
					break;
				}
			}
		}
	}
	clearItem(){
		for(let i in this){
			if(i!='imgs'&&!this.constructor.prototype[i]){
				if(this[i].parentNode&&this[i].parentNode.removeChild)
					this[i].parentNode.removeChild(this[i]);
				delete this[i];
			}
		}
		window.onmouseup=window.onresize=null;
		document.body.style.overflow='';
	}
	show(opt){
		document.body.style.overflow='hidden';
		this.createModal(opt);
	}
	createModal(opt){
		this.modal=this.createItem({
			tagName:'div',
			class:'crop-modal',
			container:document.body
		});
//		this.modal.onclick=(opt)=>{
//			this.clearItem();
//		}
		this.createWindow(opt);
		this.createCloseBtn();
	}
	createWindow(opt){
		this.window=this.createItem({
			tagName:'div',
			class:'crop-window',
			container:document.body
		});
//		if(opt.result.attr.scale){
////			this.scale=1/opt.result.attr.scale;
////			this.window.style.transform='scale('+opt.result.attr.scale+')';
//			this.window.style.transform='scale('+this.window.scale+')';
//		}else{
//			this.scale=1;
//		}
		this.createSourceImgBox(opt);
		this.window.onclick=ev=>{
			ev.cancelBubble=true;
		}
	}
	createSourceImgBox(opt){
		let angle=opt.result.attr.angle || 0;
		this.sourceImgBox=this.createItem({
			tagName:'div',
			class:'source-img-Box',
			container:this.window,
			attr:{
				angle:angle,
				style:'transform:rotate('+angle+'deg)'
			}
		});
		this.sourceImgBox.ondragstart=ev=>{
			ev.preventDefault();
		}
		this.createSourceImg(opt);
		this.createRotateBtn();
	}
	createSourceImg(opt){
		this.sourceImg=this.createItem({
			tagName:'img',
			class:'source-img',
			container:this.sourceImgBox,
			attr:{
				src:opt.result.attr.originSrc
			}
		});
		this.sourceImg.ondragstart=ev=>{
			ev.preventDefault();
		}
		this.drawRect(opt);
		this.createLoading();
		this.sourceImg.onload=()=>{
			this.closeLoading();
			this.window.scale=(document.documentElement.clientHeight/this.sourceImg.height).toFixed(1)-0.1;
			if(this.window.scale>1)
				this.window.scale=1;
			else if(this.window.scale<0.2)
				this.window.scale=0.2;
			this.window.style.transform='scale('+this.window.scale+')';
	//		this.window.scale=opt.result.attr.scale || 1;
	//		this.window.scale=parseFloat(this.window.scale).toFixed(1);
			this.setWindow();
			this.setRect(opt);
			this.setOther();
			this.setAngle();
			this.wheel();
		}
	}
	createCloseBtn(){
		this.closeBtn=this.createItem({
			tagName:'div',
			class:'close-btn',
			container:document.body
		});
		this.closeBtn.innerHTML='×';
		this.closeBtn.onclick=ev=>{
			this.clearItem();
		}
	}
	createRotateBtn(){
		this.rotateBtn=this.createItem({
			tagName:'div',
			class:'rotate-btn',
			container:this.sourceImgBox
		});
		this.rotateBtn.ondragstart=ev=>{
			ev.preventDefault();
		}
		this.nowRotate=0;
		var ctx=this.ctx;
		this.rotateBtn.onmousedown=ev=>{
			window.onmousemove=ev=>{
		        ev.preventDefault();
		        let x=ev.clientX-document.documentElement.clientWidth/2-this.translateX;
		        let y=ev.clientY-document.documentElement.clientHeight/2-this.translateY;
		        let len = Math.sqrt(x*x + y*y);
		        let oldRotate=Math.atan2(y,x);
		        let newRatote =oldRotate-this.nowRotate;
		        newRatote = Math.atan2(len*Math.cos(newRatote),-len*Math.sin(newRatote));
		        this.nowRotate+=newRatote;
		        let rotate=360*(this.nowRotate/(2*Math.PI));
		        if(Math.abs(rotate)>=360)
	        		rotate=rotate%360;
		        if(rotate<0)
		        	rotate+=360;
		        this.sourceImgBox.style.transform="rotate("+rotate+"deg)";
		        this.sourceImgBox.setAttribute('angle',rotate);
		        this.showPosition();
		        if(this.tempCanvas)
		        	this.setTempCanvas();
			}
			window.onmouseup=ev=>{
				window.onmousemove=window.onmouseup=null;
			}
		}
		window.onresize=ev=>{
			this.setWindow()
		}
	}
	drawRect(opt){
		this.rect=this.createItem({
			tagName:'div',
			class:'rect',
			container:this.window
		});
		this.rect.onmousedown=ev=>{
			this.modal.oldonclick=this.modal.onclick;
			this.modal.onclick=null;
			var disX=ev.clientX-this.rect.offsetLeft-this.rect.offsetParent.offsetLeft;
			var disY=ev.clientY-this.rect.offsetTop-this.rect.offsetParent.offsetTop;
			var nX=ev.clientX;
			var nY=ev.clientY;
			window.onmousemove=ev=>{
				let x=ev.clientX-this.rect.offsetParent.offsetLeft-disX;
				let y=ev.clientY-this.rect.offsetParent.offsetTop-disY;
				let max=this.r*2;
				if(x<=-max/4)
					x=-max/4;
				else if(this.rect.offsetWidth+x>=max)
					x=max-this.rect.offsetWidth;
				if(y<=-max/4)
					y=-max/4;
				else if(this.rect.offsetHeight+y>=max)
					y=max-this.rect.offsetHeight;
//				let wcx=document.documentElement.clientWidth/2;
//				let wcy=document.documentElement.clientHeight/2;
//				let rectcx=this.rect.offsetLeft+this.rect.offsetParent.offsetLeft+this.rect.offsetWidth/2;
//				let rectcy=this.rect.offsetTop+this.rect.offsetParent.offsetTop+this.rect.offsetHeight/2;
//				console.log(wcx-rectcx,(wcx-rectcx)/this.window.scale,(wcx-rectcx)/this.window.scale-(wcx-rectcx))
//				let ratioX=(ev.clientX-nX)/this.window.scale;
//				let ratioY=(ev.clientY-nY)/this.window.scale;
				let ratioX=(1-this.window.scale)*(ev.clientX-nX);
				let ratioY=(1-this.window.scale)*(ev.clientY-nY);
				this.rect.style.left=x+ratioX+'px';
				this.rect.style.top=y+ratioY+'px';
				console.log()
		        if(this.tempCanvas)
		        	this.setTempCanvas();
			}
			window.onmouseup=ev=>{
				window.onmousemove=null;
				window.onmouseup=null;
				setTimeout(()=>{
					if(this.modal)
						this.modal.onclick=this.modal.oldonclick
				},1);
			}
		}
		this.rect.ondragstart=ev=>{
			ev.preventDefault();
		}
		this.sourceImg.onload=ev=>{
		}
		this.rect.ondblclick=ev=>{
			this.removeItem(this.canvas);
	        this.tX=this.window.offsetLeft-this.window.offsetWidth/2-(this.window.offsetLeft-this.rect.offsetLeft-this.rect.offsetWidth/2);
	        this.tY=this.window.offsetTop-this.window.offsetHeight/2-(this.window.offsetTop-this.rect.offsetTop-this.rect.offsetHeight/2);
			this.canvas=this.createItem({
				tagName:'canvas',
				class:'canvas',
				container:document.body
			});
			this.canvas.width=this.rect.offsetWidth;
			this.canvas.height=this.rect.offsetHeight;
			this.canvas.style.display='none';
			var ctx=this.canvas.getContext('2d');
			ctx.fillStyle="white";//填充背景
			ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
			this.requestImg(this.sourceImg.getAttribute('src'),ctx,opt);
		}
		for(var i=0;i<4;i++){
			this['rectBorder'+i]=this.createItem({
				tagName:'div',
				class:'rect-border',
				container:this.rect
			});
		}
		this.zoom=this.createItem({
			tagName:'div',
			class:'zoom',
			container:this.rect
		});
		this.zoom.onmousedown=ev=>{
			ev.cancelBubble=true;
			this.modal.oldonclick=this.modal.onclick;
			this.modal.onclick=null;
			var nX=ev.clientX;
			var nY=ev.clientY;
			var nW=this.rect.offsetWidth;
			var nH=this.rect.offsetHeight;
			window.onmousemove=ev=>{
//				this.window.style.transform='scale(1)';
//				this.window.style.transform='scale('+this.window.scale+')';
				let w=ev.clientX-nX+nW;
				let h=ev.clientY-nY+nH;
				let max=this.sourceImg.width>this.sourceImg.height?this.sourceImg.width:this.sourceImg.height;
				if(w<=20)
					w=20;
				else if(w+this.rect.offsetLeft>=max)
					w=max-this.rect.offsetLeft;
				if(h<=20)
					h=20;
				else if(h+this.rect.offsetTop>=max)
					h=max-this.rect.offsetTop;
				let ratioX=(ev.clientX-nX)/this.window.scale;
				let ratioY=(ev.clientY-nY)/this.window.scale;
				this.rect.style.width=nW+ratioX+'px';
				this.rect.style.height=nH+ratioY+'px';
				console.log('x=',ratioX,'y=',ratioY)
//				this.window.style.transform='scale('+this.window.scale+')';
				// this.setRectHeight();
				if(opt.contrastImg)
					this.createTempCanvas(opt);
				        // if(this.tempCanvas)
				        // 	this.setTempCanvas();
			}
			window.onmouseup=ev=>{
				window.onmousemove=null;
				window.onmouseup=null;
				setTimeout(()=>this.modal.onclick=this.modal.oldonclick,1);
			}
		}
		this.createOperations();
	}
	createOperations(){
		this.operations=this.createItem({
			tagName:'div',
			class:'operations',
			container:this.rect
		});
		this.createConfirm();
		this.createCancel();
	}
	createConfirm(){
		this.confirmBtn=this.createItem({
			tagName:'div',
			class:'confirm',
			container:this.operations
		});
		this.confirmBtn.innerHTML='确定';
		this.confirmBtn.onclick=this.rect.ondblclick;
	}
	createCancel(){
		this.cancelBtn=this.createItem({
			tagName:'div',
			class:'cancel',
			container:this.operations
		});
		this.cancelBtn.innerHTML='取消';
		this.cancelBtn.ondblclick=ev=>{
			var oEvent=ev || window.event;
			oEvent.cancelBubble=true;
		}
		this.cancelBtn.onclick=ev=>{
			var oEvent=ev || window.event;
			oEvent.cancelBubble=true;
	   		this.clearItem();
		}
	}
	createLoading(){
		this.loading=this.createItem({
			tagName:'div',
			class:'loading',
			container:document.body
		});
		this.loading.style.width=document.documentElement.clientWidth+'px';
		this.loading.style.height=document.documentElement.clientHeight+'px';
	}
	closeLoading(){
		this.removeItem(this.loading);
	}
	requestImg(src,ctx,opt){
		this.createLoading();
		var _this=this;
	  	var img = new Image();
		img.setAttribute('crossOrigin', 'anonymous');
		img.src = src;
		img.onload=ev=>{
			ctx.save();
			ctx.translate(this.canvas.width/2-this.tX,this.canvas.height/2-this.tY);
			ctx.rotate(parseFloat(this.sourceImgBox.getAttribute('angle')) * Math.PI / 180);
			ctx.translate(-this.sourceImg.offsetWidth/2,-this.sourceImg.offsetHeight/2);
			ctx.drawImage(img,0,0);
			ctx.restore();
			function convertCanvasToImage(canvas) {
				//新Image对象，可以理解为DOM 
				var image = new Image();
				// canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持 
				// 指定格式 PNG 
				image.src = canvas.toDataURL("image/png", 1.0);
				return image;
			}
			var formData = new FormData();
			formData.append('file', convertCanvasToImage(this.canvas).src);
			$.ajax({
				type: "post",
				url: "http://yilian.im/zhihui/template/uploadimage",
				data: formData,
				contentType: false,
				processData: false,
				dataType: "json",
				success: function(data) {
					_this.closeLoading();
		            if(data.status===1){
				   		var json={
				   			src:'http://yilian.im/zhihui_image/?imgurl='+data.data.url,
				   			angle:_this.sourceImgBox.getAttribute('angle'),
				   			scale:_this.window.scale,
				   			x:_this.rect.offsetLeft,
				   			y:_this.rect.offsetTop,
				   			w:_this.rect.offsetWidth,
				   			h:_this.rect.offsetHeight
				   		}
				   		// opt.result['width']=this.rect.offsetWidth;
				   		// opt.result['height']=this.rect.offsetHeight;
				   		// console.log(submitImageFile(json.src));
				   		for(var i in json){
				   			opt.result.attr[i]=json[i];
				   		}
				   		_this.clearItem();
		            }else
		            	alert('图片裁剪上传失败')
				}
			});
		}
	  	img.onerror=ev=>{
	    	var timeStamp = +new Date();
	    	this.requestImg(src+'?'+timeStamp,ctx);
	  	}
	}
	wheel(){
		this.sourceImgBox.onmousewheel=this.rect.onmousewheel=ev=>{
			var oEvent=ev || window.event;
			if(oEvent.wheelDelta>0){
				if(this.window.scale<1)
					this.window.scale=parseFloat(this.window.scale)+0.025;
			}else{
				if(this.window.scale>0.2)
					this.window.scale=parseFloat(this.window.scale)-0.025;
			}
			this.window.style.transform='scale('+this.window.scale+')';
			this.setOther();
		}
	}
	setWindow(opt){
		this.window.style.left=document.documentElement.clientWidth/2-this.sourceImg.offsetWidth/2+this.translateX+'px';
		this.window.style.top=document.documentElement.clientHeight/2-this.sourceImg.offsetHeight/2+this.translateY+'px';
	}
	setOther(){
    	this.confirmBtn.style.width=this.cancelBtn.style.width=80/this.window.scale+'px';
    	this.confirmBtn.style.marginRight=this.cancelBtn.style.marginRight=10/this.window.scale+'px';
    	this.confirmBtn.style.fontSize=this.cancelBtn.style.fontSize=30/this.window.scale+'px';
    	this.confirmBtn.style.padding=this.cancelBtn.style.padding='"'+2/this.window.scale+'px '+16/this.window.scale+'px';
		this.zoom.style.width=this.zoom.style.height=28/this.window.scale+'px';
		
		this.rotateBtn.style.width=this.rotateBtn.style.height=40/this.window.scale+'px';
		this.rotateBtn.style.top=-60/this.window.scale+'px';
		this.rotateBtn.style.padding=10/this.window.scale+'px';
		this.rotateBtn.style.marginLeft=-20/this.window.scale+'px';
	}
	setRect(opt){
		// if(opt.result.attr.originSrc==opt.result.attr.src&&!opt.contrastImg){
		// 	this.rect.style.width=parseInt(this.sourceImg.offsetWidth)*.8+'px';
		// 	this.rect.style.height=parseInt(this.sourceImg.offsetHeight)*.8+'px';
		// 	this.rect.style.left=this.sourceImg.offsetWidth/2-this.rect.offsetWidth/2+'px';
		// 	this.rect.style.top=this.sourceImg.offsetHeight/2-this.rect.offsetHeight/2+'px';
		// }else{
			this.rect.style.width=opt.result.attr.w+'px';
			this.rect.style.height=opt.result.attr.h+'px';
			this.rect.style.left=opt.result.attr.x+'px';
			this.rect.style.top=opt.result.attr.y+'px';
		// }
		// this.createRectHeight();
		if(opt.contrastImg)
			this.createTempCanvas(opt);
	}
	createRectHeight(){
		this.rectHeight=this.createItem({
			tagName:'div',
			class:'rect-height',
			container:this.rect
		});
		this.setRectHeight();
	}
	setRectHeight(){
		this.rectHeight.innerHTML='h = '+this.rect.offsetHeight;
	}
	setAngle(opt){
		this.r=Math.sqrt(Math.pow(this.sourceImg.offsetWidth/2,2)+Math.pow(this.sourceImg.offsetHeight/2,2));
		this.createPosition();
	}
	createPosition(){
		let angle=Math.acos(this.window.offsetHeight/2/this.r)*180/Math.PI;
		this.startAngle=parseFloat(this.sourceImgBox.getAttribute('angle'));
        this.positionArr=[{
    		name:'lt',
			attr:{
				x:this.window.offsetLeft,
				y:this.window.offsetTop,
				angle:270-angle+this.startAngle
			}
    	},{
    		name:'rt',
			attr:{
				x:this.window.offsetLeft+this.window.offsetWidth,
				y:this.window.offsetTop,
				angle:-90+angle+this.startAngle
			}
    	},{
    		name:'lb',
			attr:{
				x:this.window.offsetLeft,
				y:this.window.offsetTop+this.window.offsetHeight,
				angle:90+angle+this.startAngle
			}
    	},{
    		name:'rb',
			attr:{
				x:this.window.offsetLeft+this.window.offsetWidth,
				y:this.window.offsetTop+this.window.offsetHeight,
				angle:90-angle+this.startAngle
			}
    	}];
        this.positionArr.forEach(pos=>{
			this[pos.name]=this.createItem({
				tagName:'div',
				class:'point',
				container:this.sourceImgBox,
				attr:pos.attr
			});
        	this.window.appendChild(this[pos.name]);
//          this[pos.name].style.zIndex=1;
            //this[pos.name].style.background='red';
        });
		this.showPosition();
	}
	showPosition(){
		//绝对定位：相对于body
        // var xcenter=document.documentElement.clientWidth/2;
        // var ycenter=document.documentElement.clientHeight/2;
		//相对定位：相对于this.window
        var xcenter=document.documentElement.clientWidth/2-this.window.offsetLeft+this.translateX;
        var ycenter=document.documentElement.clientHeight/2-this.window.offsetTop+this.translateY;
        this.positionArr.forEach(pos=>{
        	let angle=parseFloat(this[pos.name].getAttribute('angle'))+parseFloat(this.sourceImgBox.getAttribute('angle'))-this.startAngle;
            let X=Math.cos(Math.PI/180*angle)*this.r+xcenter;
            let Y=Math.sin(Math.PI/180*angle)*this.r+ycenter;
            this[pos.name].style.left=X+'px';
            this[pos.name].style.top=Y+'px';
//          this[pos.name].innerHTML='x:'+parseInt(X)+',y:'+parseInt(Y);//显示图片四角坐标
        });
	}
	createTempCanvas(opt){
		let scale;
		let canvasScale;
		// if(opt.contrastImg.width>opt.contrastImg.height){
		// 	let w=opt.contrastImg.width>document.documentElement.clientWidth*.4?document.documentElement.clientWidth*.4:opt.contrastImg.width;
		// 	scale=w/opt.contrastImg.width;
		// }else{
			let h=opt.contrastImg.height>document.documentElement.clientHeight*.4?document.documentElement.clientHeight*.4:opt.contrastImg.height;
			scale=h/opt.contrastImg.height;
		// }
		// this.nowSourceImgBox=this.createItem({
		// 	tagName:'div',
		// 	class:'nowSource-img-box',
		// 	container:document.body
		// });
		// this.nowSourceImgBox.style.transform='scale('+scale+')';
		// this.nowSourceImgBox.style.width=opt.contrastImg.width+'px';
		// this.nowSourceImgBox.style.height=opt.contrastImg.height+'px';
		// this.nowSourceImgBox.style.transformOrigin='0 0';
		// this.nowSourceImgBox.style.left=10*scale+'%';
		// this.nowSourceImgBox.style.top=10*scale+'%';

		// this.nowSourceImg=this.createItem({
		// 	tagName:'img',
		// 	class:'nowSource-img',
		// 	container:this.nowSourceImgBox
		// });
		// this.nowSourceImg.src=this.sourceImg.src;
		if(!this.contrastImg){
			this.contrastImg=this.createItem({
				tagName:'img',
				class:'contrast-img',
				container:document.body
			});
		}
		this.contrastImg.src=opt.contrastImg.src;
		this.contrastImg.style.transform='scale('+scale+')';
		this.contrastImg.width=opt.contrastImg.width;
		this.contrastImg.height=opt.contrastImg.height;
		this.contrastImg.style.transformOrigin='0 '+opt.contrastImg.height+'px';
		this.contrastImg.style.left=10*scale+'%';
		this.contrastImg.style.bottom=10*scale+'%';
		if(!this.tempCanvas){
			this.tempCanvas=this.createItem({
				tagName:'canvas',
				class:'temp-canvas',
				container:document.body
			});
		}

		this.tempCanvas.width=this.rect.offsetWidth;
		this.tempCanvas.height=this.rect.offsetHeight;
		this.tempCanvas.style.transform='scale('+scale*opt.contrastImg.width/this.rect.offsetWidth+','+scale*opt.contrastImg.height/this.rect.offsetHeight+')';
		this.tempCanvas.style.transformOrigin='0 0';
		this.tempCanvas.style.left=10*scale+'%';
		this.tempCanvas.style.top=10*scale+'%';
		let ctx=this.tempCanvas.getContext('2d');
		ctx.fillStyle="white";//填充背景
		this.setTempCanvas();
	}
	setTempCanvas(){
        this.tX=this.window.offsetLeft-this.window.offsetWidth/2-(this.window.offsetLeft-this.rect.offsetLeft-this.rect.offsetWidth/2);
        this.tY=this.window.offsetTop-this.window.offsetHeight/2-(this.window.offsetTop-this.rect.offsetTop-this.rect.offsetHeight/2);
		let ctx=this.tempCanvas.getContext('2d');
		ctx.fillRect(0,0,this.tempCanvas.width,this.tempCanvas.height);
		ctx.save();
		ctx.translate(this.tempCanvas.width/2-this.tX,this.tempCanvas.height/2-this.tY);
		ctx.rotate(parseFloat(this.sourceImgBox.getAttribute('angle')) * Math.PI / 180);
		ctx.translate(-this.sourceImg.offsetWidth/2,-this.sourceImg.offsetHeight/2);
		ctx.drawImage(this.sourceImg,0,0);
		ctx.restore();
		// this.sourceAttr.x=this.rect.offsetLeft;
		// let scaleX=this.nowSourceImgBox.offsetWidth/this.rect.offsetWidth;
		// let scaleY=this.nowSourceImgBox.offsetHeight/this.rect.offsetHeight;
		// this.nowSourceImg.style.marginLeft=scaleX*(-this.sourceAttr.x)+'px';
		// this.nowSourceImg.style.marginTop=scaleY*(-this.sourceAttr.y)+'px';
		// this.nowSourceImg.width=this.nowSourceImgBox.offsetWidth;
		// this.nowSourceImg.height=this.nowSourceImgBox.offsetHeight;
		// this.nowSourceImg.style.transform='rotate('+360*(this.nowRotate/(2*Math.PI))+'deg)';
	}
}