<template>
	<div class="font-component">
		<div style="width: 100%;height: 100%;position: fixed;left: 0;top: 0;" v-if="ifBgColor" @click="ifBgColor=false">
			<!--隐藏的透明层处理取色器无法关闭的BUG-->
		</div>
		<div style="width: 100%;height: 100%;position: fixed;left: 0;top: 0;" v-if="ifFontColor" @click="ifFontColor=false">
			<!--隐藏的透明层处理取色器无法关闭的BUG-->
		</div>
		<div class="f-title">
			字体
		</div>
		<div class="f-content">
			<div class="font-item font-family-item">
				<fontFamily :result="result" class="form-style">
				</fontFamily>
			</div>
			<div class="font-item clearfix">
				<div class="font-color-item">
					<div class="color-show" @click="ifFontColor=!ifFontColor;ifBgColor=false">
						<span :style="{background:result.color}"></span>
					</div>
					<div v-if="ifFontColor" class="color-picker">
						<sketch-picker v-model="defaultFontColor" @change-color="changeFont"></sketch-picker>
					</div>
					<p>颜色</p>
				</div>
				<div class="font-color-item">
					<div class="color-show" @click="ifBgColor=!ifBgColor;ifFontColor=false">
						<span :style="{background:result.background}"></span>
					</div>
					<div v-if="ifBgColor" class="color-picker">
						<sketch-picker v-model="defaultBgColor" @change-color="changeBg"></sketch-picker>
					</div>
					<p>背景</p>
				</div>
				<div class="font-size-item">
					<fontSize :result="result" class="form-style">
					</fontSize>
					<p>大小</p>
				</div>
			</div>
			<div class="font-item">
				<div class="font-bold font-other" :class="{active:isBold}" @click="changeBold">
					B
				</div>
				<div class="font-italic font-other" :class="{active:isItalic}" @click="changeItalic">
					I
				</div>
				<div class="font-underline font-other" :class="{active:isLine}" @click="changeLine">
					U<span></span>
				</div>
			</div>
			<div class="font-item">
				<fontAlign 
					class="text-align" 
					:result="result"
				></fontAlign>
			</div>
		</div>
	</div>
</template>

<script>
	import fontSize from '../sider/fontSize';
	import fontFamily from '../sider/fontFamily';
	import fontAlign from '../sider/fontAlign';
	import {
		Sketch
	} from 'vue-color';
	import "../../../../css/module.css";
	export default {
		name: 'fontInfo',
		props: ["result"],
		components: {
			fontSize,
			fontFamily,
			fontAlign,
			'sketch-picker': Sketch
		},
		methods: {
			changeFont: function(val) {//改变字体颜色
				this.defaultFontColor = val;
				this.result.color = val.hex;
			},
			changeBg: function(val) {//改变背景颜色
				this.defaultBgColor = val;
				this.result.background = val.hex;
			},
			changeBold: function() {//加粗
				this.isBold = !this.isBold;
				this.isBold ? this.result.other.bold = 'bold' : this.result.other.bold = 'normal';
			},
			changeItalic: function() {//斜体
				this.isItalic = !this.isItalic;
				this.isItalic ? this.result.other.italic = 'italic' : this.result.other.italic = 'normal';
			},
			changeLine: function(){//添加下划线
				this.isLine = !this.isLine;
				this.isLine ? this.result.other.underline = 'underline' : this.result.other.underline = 'none';
			}
		},
		data() {
			return {
				ifFontColor: false, //字体颜色拾色器开关
				ifBgColor: false, //背景颜色开关
				defaultFontColor: this.result.color, //字体初始颜色
				defaultBgColor: "#000000",
				isBold: false, //加粗开关
				isItalic: false,//斜体开关
				isLine: false,//下划线开关
			}
		}
	}
</script>
<style scoped>
	
</style>