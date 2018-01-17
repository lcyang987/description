<template>
	<div class="font-component">
		<div style="width: 100%;height: 100%;position: fixed;left: 0;top: 0;" v-if="ifBgColor" @click="ifBgColor=false">
			<!--隐藏的透明层处理取色器无法关闭的BUG-->
		</div>
		<div style="width: 100%;height: 100%;position: fixed;left: 0;top: 0;" v-if="ifFontColor" @click="ifFontColor=false">
			<!--隐藏的透明层处理取色器无法关闭的BUG-->
		</div>
		<div class="f-title">
			<p style="margin-bottom: 16px;">样式</p>
			<p>字体</p>
			<p class="table-title">表格</p>
		</div>
		<div class="f-content">
			<div class="font-item select-style">
				<select v-model="tableData.style" class="form-style">
					<option :value="d.value" v-for="d in styleData">{{d.text}}</option>
				</select>
			</div>
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
				<div class="font-bold font-other" :class="{active:result.other.bold}" @click="changeBold">
					B
				</div>
				<div class="font-italic font-other" :class="{active:result.other.italic}" @click="changeItalic">
					I
				</div>
				<div class="font-underline font-other" :class="{active:result.other.underline}" @click="changeLine">
					U<span></span>
				</div>
			</div>
			<div class="font-item">
				<fontAlign class="text-align" :result="result"></fontAlign>
			</div>
			<div class="table-item" style="width: 100%;">
				<div @click="insertCol(tableData._c_index, 0)" class="insert-before-col insert-btn" title="向前插入列">&nbsp;</div>
				<div @click="insertCol(tableData._c_index, 1)" class="insert-after-col insert-btn" title="向后插入列">&nbsp;</div>
				<div @click="insertRow(tableData._r_index, 0)" class="insert-up-row insert-btn" title="向上插入行">&nbsp;</div>
				<div @click="insertRow(tableData._r_index, 1)" class="insert-down-row insert-btn" title="向下插入行">&nbsp;</div>
			</div>
			<div class="table-item" style="width: 50%;">
				<div @click="removeCol(tableData._c_index)" class="remove-col remove-btn" title="删除列">&nbsp;</div>
				<div @click="removeRow(tableData._r_index)" class="remove-row remove-btn" title="删除行">&nbsp;</div>
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
		name: 'table-info',
		props: ["result", "tableData"],
		components: {
			fontSize,
			fontFamily,
			fontAlign,
			'sketch-picker': Sketch
		},
		methods: {
			changeFont: function(val) { //改变字体颜色
				this.defaultFontColor = val
				this.result.color = val.hex;
			},
			changeBg: function(val) { //改变背景颜色
				this.defaultBgColor = val;
				this.result.background = val.hex
			},
			changeBold: function() { //加粗
				this.result.other.bold = !this.result.other.bold;
			},
			changeItalic: function() { //斜体
				this.result.other.italic = !this.result.other.italic;
			},
			changeLine: function() { //添加下划线
				this.result.other.underline = !this.result.other.underline;
			},
			insertRow: function(index, j) {
				var _col_obj = {};
				_col_obj.col = []

				for(var i = 0; i < this.tableData.row[0].col.length; i++) {
					var addData = {
						text: '添加',
						fontSize: "12",
						fontFamily: "微软雅黑",
						textCenter: "center",
						color: "#000",
						background: "#fff",
						other: {
							bold: false,
							italic: false,
							lineThrough: false,
							underline: false
						}
					}
					_col_obj.col.push(addData)
				}
				this.tableData.row.splice(index + j, 0, _col_obj);
			},
			insertCol: function(index, j) {
				for(var i = 0; i < this.tableData.row.length; i++) {
					var addData = {
						text: '添加',
						fontSize: "12",
						fontFamily: "微软雅黑",
						textCenter: "center",
						color: "#000",
						background: "#fff",
						other: {
							bold: false,
							italic: false,
							lineThrough: false,
							underline: false
						}
					}
					this.tableData.row[i].col.splice(index + j, 0, addData)
				}
			},
			removeRow: function(index) {
				if(this.tableData.row.length <= 1) {
					alert('不能在删行了')
					return false
				}
				if(this.tableData._r_index == (this.tableData.row.length - 1)) {
					this.tableData._r_index -= 1
				}

				this.tableData.row.splice(index, 1);
			},
			removeCol: function(index) {
				if(this.tableData.row[0].col.length <= 1) {
					alert('不能再删列了')
					return false
				}
				if(this.tableData._c_index == (this.tableData.row[0].col.length - 1)) {
					this.tableData._c_index -= 1
				}

				for(var i = 0; i < this.tableData.row.length; i++) {
					this.tableData.row[i].col.splice(index, 1)
				}
				console.log(this.tableData)
			}
		},
		data() {
			return {
				ifFontColor: false, //字体颜色拾色器开关
				ifBgColor: false, //背景颜色开关
				defaultFontColor: this.result.color, //字体初始颜色
				defaultBgColor: this.result.color,
				isBold: false, //加粗开关
				isItalic: false, //斜体开关
				isLine: false, //下划线开关
				addData: {
					text: '添加',
					fontSize: "12",
					fontFamily: "微软雅黑",
					textCenter: "left",
					color: "#000",
					background: "#fff",
					other: {
						bold: false,
						italic: false,
						lineThrough: false,
						underline: false
					}
				},
				styleData: [{
					text: '样式-01',
					value: ''
				}, {
					text: '样式-02',
					value: 'gray'
				}, {
					text: '样式-03',
					value: 'red'
				}, {
					text: '样式-03',
					value: 'blue'
				}]
			}
		}
	}
</script>
<style scoped>
	.table-title {
		margin-top: 139px;
	}
</style>