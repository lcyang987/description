<template>
	<div class="font">
		<textarea 
			type="text" 
			v-model="result.text" 
			class="input-style"
			:style="{
				height: height+'px',
				fontSize: result.fontSize+'px', 
				fontFamily: result.fontFamily,
				textAlign: result.textCenter,
				color: result.color,
				fontWeight: result.other.bold,
				fontStyle: result.other.italic,
				background: result.background,
				textDecoration:result.other.underline
			}" />
	</div>
</template>

<script>
	//	{ //字体需要双击模块可以修改字
	//						fontSize: "20",
	//						fontFamily: "微软雅黑",
	//						text:"我叫林彬彬",
	//						textCenter: "auto",
	//						color: "#fff",
	//						other: {
	//							bold: false, //加粗
	//							italic: false, //斜体
	//							lineThrough: false,
	//							underline: false //下划线
	//						}
	//					}
	export default {
		name: 'font',
		props: ["result","height"],
		methods: {
			showThis: function(result) {
				console.log(result)
			}
		},
		data() {
			return {
			}
		}
	}
</script>
<style scoped>
	.input-style {
		width: 100%;
		border: 0;
		resize: none;
		background: none;
		overflow: hidden;
		cursor: default;
		vertical-align: top;
	}
	.input-style:focus {
		cursor: auto;
	}
</style>