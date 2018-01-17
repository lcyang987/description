<template>
	<div>
		<div class="info-block">
			<small>透明度</small>
			<div class="opacity">
				<span :style="[{left:result.attr.opacity+'px'}]" v-on:mousedown="opacityMousedown"></span>
			</div>
			<small v-text="result.attr.opacity+'%'"></small>
		</div>
		<div class="f-title">
			<p class="table-title">图片</p>
		</div>
		<div class="f-content">
			<ul>
				<li>
				</li>
				<!--<li>
			<div class="info-block">
				<small>图片链接</small>
				<input type="text" v-model="result.attr.href" />
			</div>
		</li>-->
				<li>
					<div class="info-content">
						<button class="crop" v-on:click="crop"></button>
						<small>裁剪</small></div>
					<div class="info-content">
						<button class="crop" v-on:click="contrast"></button>
						<small>对比裁剪</small>
					</div>
				</li>
				<li>
					<div class="info-content">
						<button class="vertical" v-on:click="vertical"></button>
						<small>垂直翻转</small></div>
					<div class="info-content">
						<button class="horizontal" v-on:click="horizontal"></button>
						<small>水平翻转</small>
					</div>
				</li>
				<li>
					<div class="info-content">
						<button class="replace" onclick="this.children[0].click()"><input style="display:none" type="file" v-on:change="upload" value="上传" /></button>
						<!--			
				<button class="crop" class="sm" onclick="this.children[0].click()" >上传<input style="display:none" type="file" v-on:change="upload" value="上传" /></button>
				<button class="sm" v-on:click="replace">地址</button>
				-->
						<small>图片替换</small></div>
					<div class="info-content">
						<button class="exchange" v-on:click="exchange"></button>
						<small>图片交换</small>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'fontInfo',
		props: ["result"],
		components: {

		},
		methods: {
			opacityMousedown(ev) {
				let oEvent = ev || window.event;
				const disX = oEvent.clientX;
				const oldOpacity = this.result.attr.opacity;
				document.body.style.userSelect = 'none';
				window.onmousemove = ev => {
					let oEvent = ev || window.event;
					let l;
					if(oldOpacity + (oEvent.clientX - disX) < 0)
						l = 0;
					else if(oldOpacity + (oEvent.clientX - disX) > 100)
						l = 100;
					else
						l = oldOpacity + (oEvent.clientX - disX);
					this.result.attr.opacity = l;
				}
				window.onmouseup = ev => {
					window.onmousemove = window.onmouseup = null;
					document.body.style.userSelect = '';
				}
			},
			crop() {
				new CropImage({
					vue: this
				});
			},
			contrast() {
				var _this = this;
				if(this.isContrast) {
					this.$root.$el.onmouseover = null;
					this.isContrast = false;
				} else {
					alert('必须要是一样尺寸的图片，如果符合条件会高亮')
					this.isContrast = true;
					this.$root.$el.onmouseover = ev => {
						if(/img/i.test(ev.target.tagName)) {
							if(ev.target.width == _this.result.width && ev.target.height == _this.result.height && ev.target.getAttribute('src') != _this.result.attr.src) {
								ev.target.style.opacity = 0.5;
								ev.target.onclick = ev => {
									new CropImage({
										vue: this,
										translateX: document.documentElement.clientWidth / 5,
										contrastImg: ev.target,
									});
									ev.target.style.opacity = 1
									this.$root.$el.onmouseover = ev.target.onclick = null;
								}
							}
						}
					}
					this.$root.$el.onmouseout = ev => {
						if(/img/i.test(ev.target.tagName)) {
							if(ev.target.getAttribute('w') == _this.result.width && ev.target.getAttribute('h') == _this.result.height && ev.target.getAttribute('src') != _this.result.attr.src) {
								ev.target.style.opacity = 1
								ev.target.onclick = null;
							}
						}
					}
					this.$root.$el.onclick = ev => {
						if(!this.isContrast)
							this.$root.$el.onmouseover = null;
						this.isContrast = false;
					}
				}
			},
			horizontal() {
				this.result.attr.rotateX = this.result.attr.rotateX == 0 ? 180 : 0
			},
			vertical() {
				this.result.attr.rotateY = this.result.attr.rotateY == 0 ? 180 : 0;
			},
			upload(e) {
				var files = e.target.files || e.dataTransfer.files;
				if(!files.length)
					return;
				var reader = new FileReader();
				var vm = this;
				reader.onload = (e) => {
					vm.result.attr.src = vm.result.attr.originSrc = e.target.result;
				};
				reader.readAsDataURL(files[0]);
			},
			replace() {
				let location = prompt("请输入图片地址:");
				if(location) {
					this.result.attr.src = this.result.attr.originSrc = location;
				}
			},
			exchange() {
				this.$root.exchangeImg = this.result.attr;
			}
		},
		data() {
			return {
				isContrast: false,
				isExchange: false
			}
		}
	}
</script>
<style lang='less' scoped>
	.info-content {
		float: left;
		padding-top: 20px;
		width: 50%;
		text-align: center;
		button {
			width: 60px;
			height: 20px;
		}
		.sm {
			width: 28px;
			height: 20px;
		}
		small {
			display: block;
		}
		button {
			background-repeat: no-repeat;
			background-color: white;
			background-position: center;
			border: 1px solid #f4f4f4;
		}
		.crop {
			background-image: url('~assets/crop.jpg')
		}
		.vertical {
			background-image: url('~assets/vertical.jpg')
		}
		.horizontal {
			background-image: url('~assets/horizontal.jpg')
		}
		.replace {
			background-image: url('~assets/replace.jpg')
		}
		.exchange {
			background-image: url('~assets/exchange.jpg')
		}
	}
	
	.info-block {
		margin-top: 20px;
		small {
			margin: 0 5px 0 10px;
		}
		input {
			width: 120px
		}
		.opacity {
			width: 100px;
			height: 4px;
			display: inline-block;
			vertical-align: middle;
			background: steelblue;
			position: relative;
			border-radius: 3px;
			span {
				border-radius: 50%;
				width: 16px;
				height: 16px;
				display: block;
				position: absolute;
				top: -7px;
				background: white;
				border: 1px solid gray;
				margin-left: -8px;
			}
		}
	}
	.f-title{
		float:left;
		margin-top:22px;
		
	}
	.f-title p{
		text-indent:10px;
	}
	.f-content{
		float:right;
		
	}
	.f-content li{
		width:150px;
		margin-right:10px;
	}
</style>