<template>
	<div class="main" id="main" v-bind:class="{ hidden: !onlyshow }">
		<loading v-bind:result="loading"></loading>
		<div class="action-bar" v-if="onlyshow">
			<div class="logo">&nbsp;</div>
			<div class="bar"><button v-on:click="show"><img src="../assets/yl.png"/>预览</button>
				<button v-on:click="saveImg"><img src="../assets/bc.png"/>存储</button>
				<button v-on:click="undo"><img src="../assets/cx.png"/>撤销</button>
				<button v-on:click="redo"><img src="../assets/cz.png"/>重做</button>
			<button v-if="test" v-on:click="inthis"><img src="../assets/cz.png"/>导入</button>
			<button v-if="test" v-on:click="out"><img src="../assets/cz.png"/>导出</button>
			<textarea  v-if="test" style="width: 200px;height: 600px;position: absolute;left: -200px;top: 0;"  v-model="testlist"></textarea>
			</div>
				
			<div class="login-out"><button>退出</button></div>
		</div>
		<ul class="preview" v-if="onlyshow">
			<li v-for="(t ,i) in list" v-on:click="viewPanto(i)" v-bind:style="{ top: i*160+'px'}">
				<div class="item">
					<div class="index-num">
						{{i}}
					</div>
					<input type="text" class="item-name" v-model="t.name" />
					<a v-on:click="moduleUp(i)"><img src="../assets/up.png" /></a>
					<a v-on:click="moduleDown(i)"><img src="../assets/down.png" /></a>
					<a v-on:click="remove(i)"><img src="../assets/close.png" /></a>
					<!--<div>
						高度 <input type="text" v-model="t.height" />
						背景 <input type="color" v-model="t.background" />
					</div>-->
				</div>
				<div v-on:click="viewPanto(i)" style="    position: absolute;
    z-index: 999;
    width: 130px;
    height: 130px;
    cursor: pointer;">
	</div>
	<div v-bind:style="{ height: t.height+'px', background:t.background,    marginTop:t.height*-5/12-9+'px'}" class="c-module">

		<template v-for="tt in t.modules">
			<module v-bind:result="tt"></module>
		</template>
	</div>
	</li>
	</ul>
	<ul id="J_view"  v-bind:style="{width:width+'px' }">
		<li v-for="(t,i)  in list" >
			<div v-bind:style="{ height: t.height+'px', background:t.background ,width:width+'px' }" class="c-module" v-if="onlyshow">

				<template v-for="tt in t.modules">
					<module v-bind:class="{ active: tt.current }" v-on:myChild="toFatherSay" v-bind:result="tt"></module>
				</template>

			</div>
			<div v-bind:style="{ height: t.height+'px', background:t.background }" class="c-module" v-else="!onlyshow">
				<div v-bind:style="{ height: t.height+'px',position: 'absolute',zIndex:'9999',width:'880px' }">

				</div>
				<template v-for="tt in t.modules">
					<module v-on:myChild="toFatherSay" v-bind:result="tt"></module>
				</template>

			</div>
		</li>
	</ul>

	<div id="info" v-if="onlyshow">
		<li v-for="t  in list">
			<template v-for="tt in t.modules">
				<moduleInfo v-bind:result="tt"></moduleInfo>
			</template>
		</li>
	</div>
	<div v-if="loadings" id="J_loadings">
		<div id="loading">
			<div id="loading-center">
				<div id="loading-center-absolute">
					<div id="object"></div>
				</div>
			</div>
		</div>
	</div>
	</div>
	</div>
</template>

<script>import module from './Main/module/module'
import moduleInfo from './Main/module/Info'
import actionBar from './Main/actionBar'
import $ from 'jquery'
import loading from './Main/loading'
function convertCanvasToImage(canvas) {
	//新Image对象，可以理解为DOM 
	var image = new Image();
	// canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持 
	// 指定格式 PNG 
	image.src = canvas.toDataURL("image/png", 1.0);
	return image;
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
export default {
	name: 'cmain',
	components: {
		module,
		moduleInfo,
		actionBar,
		loading
	},
	methods: {
		inthis() {
			this.list = JSON.parse(this.testlist)
		},
		out() {
			this.testlist = JSON.stringify(this.list)
		},
		show() {
			this.onlyshow = false;
		},
		saveImg() {
			//loading
			//				var self = this;
			//				$.ajax({
			//											type: "post",
			//											url: "http://yilian.im/zhihui/template/settemplateinfo",
			//											async: false,
			//											dataType: "json",
			//											data: {
			//												id: getQueryString("id") || 1,
			//												info: JSON.stringify(self.list).replace(/\\n/g,'<n>'),
			//												//pictures: JSON.stringify(self.pictures)
			//											},
			//											success: function() {
			//												self.loadings = false;
			//											}
			//										});

			this.pictures = [];
			var self = this;
			self.loading.show = true;
			$("#canvansList").hide().html("");
			var _arr = [];
			_arr.length = ("#J_view .c-module").length;

			$("#J_view .c-module").each(function(i, t) {
				html2canvas(t, {
					onrendered: function(canvas) {
						$("#canvansList").show().append(canvas);
						var formData = new FormData();
						formData.append('file', convertCanvasToImage(canvas).src);
						$.ajax({
							type: "post",
							url: "http://yilian.im/zhihui/template/uploadimage",
							data: formData,
							async: false,
							contentType: false,
							processData: false,
							dataType: "json",
							success: function(d) {
								self.pictures.push(d.data.url);
								_arr[i] = (d.data.url);
								self.loading.num=self.pictures.length+1;
								self.loading.max= $("#J_view .c-module").length ;
								console.log("正在保存第" + self.pictures.length + "/" + $("#J_view .c-module").length + "张");
								if(self.pictures.length == $("#J_view .c-module").length) {
									console.log(_arr);

									$.ajax({
										type: "post",
										url: "http://yilian.im/zhihui/template/settemplateinfo",
										async: false,
										dataType: "json",
										data: {
											id: getQueryString("id") || 1,
											info: JSON.stringify(self.list).replace(/\\n/g, '<n>'),
											pictures: JSON.stringify(_arr)
										},
										success: function() {
											//self.loadings = false;
											self.loading.show=false;
										}
									});
								}
							},

						});
					}
				});
			});
			//				$("#J_view .c-module").each(function() {
			//					html2canvas(this, {
			//						allowTaint: true,
			//						onrendered: function(canvas) {
			//							$("#canvansList").html(canvas);
			//							var formData = new FormData();
			//							formData.append('file', convertCanvasToImage(canvas).src);
			//							var _i=0;
			//							$.ajax({
			//								type: "post",
			//								url: "http://yilian.im/zhihui/template/uploadimage",
			//								data: formData,
			//								async: false,
			//								contentType: false,
			//								processData: false,
			//								dataType: "json",
			//								success: function(d) {
			//									self.pictures.push(d.data.url);
			//									console.log("正在保存第"+self.pictures.length+"/"+$("#J_view .c-module").length+"张");
			//									_i++;
			//									if(self.pictures.length == $("#J_view .c-module").length) {
			////										$.ajax({
			////											type: "post",
			////											url: "http://yilian.im/zhihui/template/settemplateinfo",
			////											async: false,
			////											dataType: "json",
			////											data: {
			////												id: getQueryString("id") || 1,
			////												info: JSON.stringify(self.list).replace(/\n/g,'\\n'),
			////												pictures: JSON.stringify(self.pictures)
			////											},
			////											success: function() {
			////												self.loadings = false;
			////											}
			////										});
			//										
			//										$.ajax({
			//											type: "post",
			//											url: "http://yilian.im/zhihui/template/settemplateinfo",
			//											async: false,
			//											dataType: "json",
			//											data: {
			//												id: getQueryString("id") || 1,
			//												info: JSON.stringify(self.list).replace(/\\n/g,'<n>'),
			//												pictures: JSON.stringify(self.pictures)
			//											},
			//											success: function() {
			//												self.loadings = false;
			//											}
			//										});
			//									}
			//								},
			//
			//							});
			//						}
			//					});
			//				});

		},
		remove(i) {
			this.list = _.remove(_.cloneDeep(this.list), function(t, ii) { return i != ii });
		},
		toFatherSay: function(massage) { // mychlid事件触发调用的方法
			this.list.forEach(function(t, i) {
				t.modules.forEach(function(tt, ii) {
					tt.current = false;
				})
			})
		},
		moduleUp: function(i) {
			if(i == 0) {
				console.log("第一个无法再往上");
			} else {
				var _tem = this.list[i - 1];
				var _tem1 = this.list[i];
				this.list.splice(i, 1, _tem)
				this.list.splice(i - 1, 1, _tem1)
			}

		},
		moduleDown: function(i) {
			if(i == this.list.length) {
				console.log("最后一个无法向下");
			} else {
				var _tem = this.list[i + 1];
				var _tem1 = this.list[i];
				this.list.splice(i, 1, _tem)
				this.list.splice(i + 1, 1, _tem1)
			}

		},
		viewPanto: function(index) {
			let scroll = 0;
			for(var i = 0; i < index; i++) {
				scroll += this.list[i].height
			}
			this.scroll = scroll;
		},
		redo: function() { //重做
			if(this.redoList.length > 1) {
				this.list = this.redoList[this.redoList.length - 1];
				this.redoList.length = this.redoList.length - 2;
			}
		},
		undo() { //撤销
			this.redoList.push(_.cloneDeep(this.list));
			if(this.redoList.length > 10) {
				this.redoList = _.drop(this.redoList);
			}
			if(this.undoList.length > 1) {
				this.list = this.undoList[this.undoList.length - 2];
				this.undoList.length = this.undoList.length - 2;

			}

		},
	},
	created() {
		var self = this;
		if(getQueryString("test") == "true") {
			this.test = true;
		}
		self.loadings = true;
		$.ajax({
			type: "post",
			url: "http://yilian.im/zhihui/template/gettemplateinfo",
			async: false,
			dataType: "json",
			data: {
				id: getQueryString("id") || 1
			},
			success: function(d) {
				
				if(d.data.info != undefined) {
					self.width=d.data.width||880;
					var _tem = JSON.parse(d.data.info.replace(/\n/g, '<n>'));
					_.each(_tem, (t, i) => {
						_.each(t.modules, (tt, ii) => {
							if(tt.attr.text != undefined) {
								tt.attr.text = tt.attr.text.replace(/<n>/g, '\n')
							}
						})
					})

					self.list = _tem;

					self.loadings = false;
				}
			}
		});
	},
	watch: {
		scroll(newValue) {
			$("body").animate({
				scrollTop: newValue
			})

			// $(window).scrollTop(newValue);
		},

		list: {
			handler(newValue) {
				this.undoList.push(_.cloneDeep(newValue));
				if(this.undoList.length > 10) {
					this.undoList = _.drop(this.undoList);
				}

			},
			deep: true
		}
	},
	data() {
		return {
			loading:{
				show:false,
				num:0,
				max:0
			},
			width:"880",
			testlist: "",
			test: false,
			onlyshow: true,
			loadings: false,
			pictures: [],
			scroll: 0,
			redoList: [],
			undoList: [],
			list: [{
					"name": "模块1",
					"background": "#fff",
					"height": 900,
					"modules": [{
							"x": 50,
							"y": 100,
							"width": 750,
							"height": 1110,
							"zIndex": 0,
							"background": "",
							"url": false,
							"angle": 0,
							"type": "img",
							"attr": {
								"href": "https://www.baidu.com",
								"x": 0,
								"y": 0,
								"w": 750,
								"h": 1110,
								"src": "static/aaaa.png",
								"originSrc": "static/aaaa.png",
								"scale": 1,
								"angle": 0,
								"rotateX": 0,
								"rotateY": 0,
								"opacity": 90
							},
							"current": false
						},
						{
							"x": 420,
							"y": 700,
							"width": 354,
							"height": 107,
							"zIndex": 0,
							"background": "",
							"url": false,
							"angle": 0,
							"type": "img",
							"attr": {
								"href": "https://www.baidu.com",
								"x": 0,
								"y": 0,
								"w": 354,
								"h": 107,
								"src": "static/a-1.png",
								"originSrc": "static/a-1.png",
								"scale": 1,
								"angle": 0,
								"rotateX": 0,
								"rotateY": 0,
								"opacity": 100
							},
							"current": false
						},
						{
							"x": 50,
							"y": 40,
							"width": 750,
							"height": 62,
							"zIndex": 0,
							"background": "",
							"url": false,
							"angle": 0,
							"type": "img",
							"attr": {
								"href": "https://www.baidu.com",
								"x": 0,
								"y": 0,
								"w": 750,
								"h": 62,
								"src": "static/a-2.png",
								"originSrc": "static/a-2.png",
								"scale": 1,
								"angle": 0,
								"rotateX": 0,
								"rotateY": 0,
								"opacity": 100
							},
							"current": false
						}
					]
				},
				{
					"name": "模块2",
					"background": "#fff",
					"height": 900,
					"modules": [{
							"x": 100,
							"y": 50,
							"width": 90,
							"height": 38,
							"zIndex": 1,
							"url": false,
							"background": "none",
							"type": "font",
							"angle": 0,
							"attr": {
								"fontSize": "20",
								"fontFamily": "微软雅黑",
								"text": "时尚圆领",
								"textCenter": "auto",
								"color": "#000",
								"background": "none",
								"other": {
									"bold": false,
									"italic": false,
									"lineThrough": false,
									"underline": false
								}
							},
							"current": false
						},
						{
							"x": 185,
							"y": 55,
							"width": 300,
							"height": 32,
							"zIndex": 1,
							"url": false,
							"background": "none",
							"type": "font",
							"angle": 0,
							"attr": {
								"fontSize": "16",
								"fontFamily": "微软雅黑",
								"text": "/大圆领设计，凸显纤细锁骨，气质迷人。",
								"textCenter": "auto",
								"color": "#000",
								"background": "none",
								"other": {
									"bold": false,
									"italic": false,
									"lineThrough": false,
									"underline": false
								}
							},
							"current": false
						},
						{
							"x": 100,
							"y": 320,
							"width": 730,
							"height": 120,
							"zIndex": 0,
							"background": "none",
							"url": false,
							"angle": 0,
							"type": "table",
							"attr": {
								"data": {
									"style": "gray",
									"_r_index": 0,
									"_c_index": 0,
									"row": [{
											"col": [{
													"text": "尺码",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#fff",
													"background": "#888",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "胸围",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#fff",
													"background": "#888",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "臀围",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#fff",
													"background": "#888",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "腰围",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#fff",
													"background": "#888",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "可拉伸",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#fff",
													"background": "#888",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "肩宽",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#fff",
													"background": "#888",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "袖长",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#fff",
													"background": "#888",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "袖口",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#fff",
													"background": "#888",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "全长",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#fff",
													"background": "#888",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "脚口",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#fff",
													"background": "#888",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												}
											]
										},
										{
											"col": [{
													"text": "M",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												}
											]
										},
										{
											"col": [{
													"text": "S",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "90",
													"fontSize": "16",
													"fontFamily": "微软雅黑",
													"textCenter": "center",
													"color": "#333",
													"background": "#FFF",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												}
											]
										}
									]
								}
							},
							"current": false
						},
						{
							"x": 100,
							"y": 100,
							"width": 500,
							"height": 50,
							"zIndex": 0,
							"background": "none",
							"url": false,
							"angle": 0,
							"type": "select",
							"attr": {
								"background": "none",
								"style": "gray",
								"index": 1,
								"editTitle": false,
								"title": {
									"text": "厚度",
									"fontSize": "16",
									"fontFamily": "微软雅黑",
									"textCenter": "center",
									"color": "inherit",
									"other": {
										"bold": "bold",
										"italic": false,
										"lineThrough": false,
										"underline": false
									}
								},
								"values": [{
										"text": "偏薄",
										"fontSize": "16",
										"fontFamily": "微软雅黑",
										"textCenter": "center",
										"color": "inherit",
										"background": "none",
										"other": {
											"bold": false,
											"italic": false,
											"lineThrough": false,
											"underline": false
										}
									},
									{
										"text": "适中",
										"fontSize": "16",
										"fontFamily": "微软雅黑",
										"textCenter": "center",
										"color": "inherit",
										"background": "none",
										"other": {
											"bold": false,
											"italic": false,
											"lineThrough": false,
											"underline": false
										}
									},
									{
										"text": "稍厚",
										"fontSize": "16",
										"fontFamily": "微软雅黑",
										"textCenter": "center",
										"color": "inherit",
										"background": "none",
										"other": {
											"bold": false,
											"italic": false,
											"lineThrough": false,
											"underline": false
										}
									}
								],
								"select": "aaa"
							},
							"current": false
						},
						{
							"x": 100,
							"y": 170,
							"width": 500,
							"height": 50,
							"zIndex": 0,
							"background": "none",
							"url": false,
							"angle": 0,
							"type": "select",
							"attr": {
								"style": "gray-border",
								"index": 2,
								"background": "none",
								"values": [{
										"text": "偏薄",
										"fontSize": "16",
										"fontFamily": "微软雅黑",
										"textCenter": "center",
										"color": "inherit",
										"background": "none",
										"other": {
											"bold": false,
											"italic": false,
											"lineThrough": false,
											"underline": false
										}
									},
									{
										"text": "适中",
										"fontSize": "16",
										"fontFamily": "微软雅黑",
										"textCenter": "center",
										"color": "inherit",
										"background": "none",
										"other": {
											"bold": false,
											"italic": false,
											"lineThrough": false,
											"underline": false
										}
									},
									{
										"text": "稍厚",
										"fontSize": "16",
										"fontFamily": "微软雅黑",
										"textCenter": "center",
										"color": "inherit",
										"background": "none",
										"other": {
											"bold": false,
											"italic": false,
											"lineThrough": false,
											"underline": false
										}
									}
								],
								"select": "aaa"
							},
							"current": false
						},
						{
							"x": 100,
							"y": 240,
							"width": 500,
							"height": 50,
							"zIndex": 0,
							"background": "none",
							"url": false,
							"angle": 0,
							"type": "select",
							"attr": {
								"style": "blue",
								"index": 0,
								"background": "#ff9900",
								"values": [{
										"text": "偏薄",
										"fontSize": "16",
										"fontFamily": "微软雅黑",
										"textCenter": "center",
										"color": "inherit",
										"background": "none",
										"other": {
											"bold": false,
											"italic": false,
											"lineThrough": false,
											"underline": false
										}
									},
									{
										"text": "适中",
										"fontSize": "16",
										"fontFamily": "微软雅黑",
										"textCenter": "center",
										"color": "inherit",
										"background": "none",
										"other": {
											"bold": false,
											"italic": false,
											"lineThrough": false,
											"underline": false
										}
									},
									{
										"text": "稍厚",
										"fontSize": "16",
										"fontFamily": "微软雅黑",
										"textCenter": "center",
										"color": "inherit",
										"background": "none",
										"other": {
											"bold": false,
											"italic": false,
											"lineThrough": false,
											"underline": false
										}
									}
								],
								"select": "aaa"
							},
							"current": false
						}
					]
				},
				{
					"name": "模块1",
					"background": "#ff0",
					"height": 900,
					"modules": [{
							"x": 50,
							"y": 100,
							"width": 200,
							"height": 200,
							"zIndex": 1,
							"url": false,
							"background": "#000",
							"type": "font",
							"diaphaneity": 0,
							"angle": 0,
							"attr": {
								"fontSize": "20",
								"fontFamily": "微软雅黑",
								"text": "我叫林彬彬",
								"textCenter": "auto",
								"color": "#fff",
								"background": "#000",
								"other": {
									"bold": false,
									"italic": false,
									"lineThrough": false,
									"underline": false
								}
							},
							"current": false
						},
						{
							"x": 100,
							"y": 100,
							"width": 750,
							"height": 1110,
							"zIndex": 0,
							"background": "#eee",
							"url": false,
							"angle": 0,
							"type": "img",
							"attr": {
								"href": "https://www.baidu.com",
								"x": 0,
								"y": 0,
								"w": 750,
								"h": 1110,
								"src": "static/bbbb.png",
								"originSrc": "static/bbbb.png",
								"scale": 1,
								"angle": 0,
								"rotateX": 0,
								"rotateY": 0,
								"opacity": 100
							},
							"current": false
						},
						{
							"x": 0,
							"y": 300,
							"width": 500,
							"height": 300,
							"zIndex": 0,
							"background": "#ddd",
							"url": false,
							"angle": 0,
							"type": "table",
							"attr": {
								"data": {
									"_r_index": 0,
									"_c_index": 0,
									"row": [{
											"col": [{
													"text": "标题1",
													"fontSize": "20",
													"fontFamily": "微软雅黑",
													"textCenter": "left",
													"color": "#bbb",
													"background": "#666666",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "标题2",
													"fontSize": "20",
													"fontFamily": "微软雅黑",
													"textCenter": "left",
													"color": "#bbb",
													"background": "#666666",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												}
											]
										},
										{
											"col": [{
													"text": "第一行内容1",
													"fontSize": "20",
													"fontFamily": "微软雅黑",
													"textCenter": "left",
													"color": "#bbb",
													"background": "#666666",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "第一行内容2",
													"fontSize": "20",
													"fontFamily": "微软雅黑",
													"textCenter": "left",
													"color": "#bbb",
													"background": "#666666",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												}
											]
										},
										{
											"col": [{
													"text": "第二行内容1",
													"fontSize": "20",
													"fontFamily": "微软雅黑",
													"textCenter": "left",
													"color": "#bbb",
													"background": "#666666",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												},
												{
													"text": "第二行内容2",
													"fontSize": "20",
													"fontFamily": "微软雅黑",
													"textCenter": "left",
													"color": "#bbb",
													"background": "#666666",
													"other": {
														"bold": false,
														"italic": false,
														"lineThrough": false,
														"underline": false
													}
												}
											]
										}
									]
								}
							},
							"current": false
						},
						{
							"x": 100,
							"y": 100,
							"width": 200,
							"height": 200,
							"zIndex": 0,
							"background": "#000",
							"url": false,
							"angle": 0,
							"type": "select",
							"attr": {
								"style": "",
								"index": 0,
								"values": [{
										"text": "aaa",
										"fontSize": "20",
										"fontFamily": "微软雅黑",
										"textCenter": "left",
										"color": "#bbb",
										"background": "#666666",
										"other": {
											"bold": false,
											"italic": false,
											"lineThrough": false,
											"underline": false
										}
									},
									{
										"text": "bbb",
										"fontSize": "20",
										"fontFamily": "微软雅黑",
										"textCenter": "left",
										"color": "#bbb",
										"background": "#666666",
										"other": {
											"bold": false,
											"italic": false,
											"lineThrough": false,
											"underline": false
										}
									},
									{
										"text": "ccc",
										"fontSize": "20",
										"fontFamily": "微软雅黑",
										"textCenter": "left",
										"color": "#bbb",
										"background": "#666666",
										"other": {
											"bold": false,
											"italic": false,
											"lineThrough": false,
											"underline": false
										}
									}
								],
								"select": "aaa"
							},
							"current": false
						}
					]
				}
			]

		}
	}

}</script>
<style scoped lang="less">
html {
	background: #d7effe;
}


.active {
	border: 2px dashed #eee;
	box-sizing: border-box;
	/*z-index: 100!important;*/
}

.c-module {
	width: 880px;
	position: relative;
	overflow: hidden;
}

.main {
	width: 1300px;
	margin: 0 auto;
	position: relative;
	overflow: hidden;
	background: #e9f4fb;
	
}
.main.hidden{
		    background: #d7effe;
		    #J_view{
		    	padding-top: 0;
		    	margin-top: 0px;
		    }
	}
.main #J_view {
	    width: 867px;
    padding: 10px 10px 10px 0;
    margin: 60px auto 0 auto;
    overflow: hidden;
}

.main .preview {
	padding: 0;
	height: 900px;
	overflow-y: scroll;
	overflow-x: hidden;
	width: 180px;
	margin: 10px 0 0 10px;
	float: left;
	border: 1px solid #dfdfdf;
	background: #f8f8f8;
}

#info {
	width: 200px;
	height: 900px;
	position: fixed;
	top: 60px;
	margin: 10px 0 10px 1092px;
	background: rgb(255, 255, 255);
}

.preview {
	width: 180px;
	position: fixed;
	top: 60px;
}

.preview li {
	width: 133.5px;
	height: 160px;
	margin: 24px 24px 24px 0;
	padding-left: 24px;
	overflow: hidden;
	position: absolute;
	.index-num {
		position: absolute;
		left: 10px;
		font-family: "微软雅黑";
		top: 4px;
	}
	.item {
		border: 1px solid #eee;
		background: #fff;
		height: 20px;
		line-height: 20px;
		.item-name {
			width: 80px;
			padding-left: 10px;
		}
		a {
			cursor: pointer;
		}
	}
}

.preview input {
	border: none;
}

.preview .c-module {
	/*left: -106px;
		position: absolute;
		transform: scale(0.2);
		margin-top: -141px;
		margin-left: -213px;*/
	transform: scale(0.15);
	margin-left: -280%;
}

::-webkit-scrollbar-track {
	background-color: #ffffff;
}

::-webkit-scrollbar {
	width: 6px;
	height: 0;
	background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
	background-color: #337ab7;
}

.action-bar {
	background: #fff;
	border: 1px solid #dbe7ee;
	height: 60px;
	width: 1300px;
	line-height: 60px;
	position: fixed;
	z-index: 999;
	.logo,
	.login-out {
		width: 200px;
		float: left;
		button {
			width: 80px;
			height: 30px;
			border: 1px solid #0085d7;
			background: #0085d7;
			color: #fff;
			line-height: 30px;
			margin-top: 15px;
			margin-left: 20px;
			border-radius: 3px;
			cursor: pointer;
		}
	}
	.login-out {
		float: right;
	}
	.bar {
		width: 600px;
		float: left;
		button {
			cursor: pointer;
			width: 80px;
			height: 30px;
			border: 1px solid #0085d7;
			background: #d7effe;
			color: #0c8cd9;
			line-height: 30px;
			margin-top: 15px;
			margin-left: 20px;
			border-radius: 3px;
			&[disabled] {
				border: 1px solid #DDD;
				background-color: #F5F5F5;
				color: #ACA899;
			}
			img{
				margin-right: 10px;
			}
		}
	}
}

#J_loadings {
	background: #000000;
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 9999;
	#loading {
		background-color: #bd4932;
		height: 100%;
		width: 100%;
		position: fixed;
		z-index: 1;
		margin-top: 0px;
		top: 0px;
	}
	#loading-center {
		width: 100%;
		height: 100%;
		position: relative;
	}
	#loading-center-absolute {
		position: absolute;
		left: 50%;
		top: 50%;
		height: 200px;
		width: 200px;
		margin-top: -100px;
		margin-left: -100px;
	}
	#object {
		width: 80px;
		height: 80px;
		background-color: #FFF;
		-webkit-animation: animate 1s infinite ease-in-out;
		animation: animate 1s infinite ease-in-out;
		margin-right: auto;
		margin-left: auto;
		margin-top: 60px;
	}
	@-webkit-keyframes animate {
		0% {
			-webkit-transform: perspective(160px);
		}
		50% {
			-webkit-transform: perspective(160px) rotateY(-180deg);
		}
		100% {
			-webkit-transform: perspective(160px) rotateY(-180deg) rotateX(-180deg);
		}
	}
	@keyframes animate {
		0% {
			transform: perspective(160px) rotateX(0deg) rotateY(0deg);
			-webkit-transform: perspective(160px) rotateX(0deg) rotateY(0deg);
		}
		50% {
			transform: perspective(160px) rotateX(-180deg) rotateY(0deg);
			-webkit-transform: perspective(160px) rotateX(-180deg) rotateY(0deg);
		}
		100% {
			transform: perspective(160px) rotateX(-180deg) rotateY(-180deg);
			-webkit-transform: perspective(160px) rotateX(-180deg) rotateY(-180deg);
		}
	}
}</style>