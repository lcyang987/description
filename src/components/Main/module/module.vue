<template>
	<div class="module" v-bind:style="{ height: result.height+'px', background:result.background ,width:result.width+'px',zIndex:result.zIndex,left:result.x+'px',top:result.y+'px',transform:'rotateX('+result.attr.rotateX+'deg) '+'rotateY('+result.attr.rotateY+'deg)'}" v-on:click="toFather(result)">
		<div v-if="result.type==='font'">
			<font v-bind:result="result.attr" :height = 'result.height'></font>
		</div>
		<div v-if="result.type==='img'">
			<imgV v-bind:result="result"></imgV>
		</div>
		<div v-if="result.type==='select'">
			<selectComponent :result="result.attr"></selectComponent>
		</div>
		<div v-if="result.type==='table'">
			<tableComponent :result="result.attr.data"></tableComponent>
		</div>
	</div>
</template>

<script>
	import font from './font/font'
	import imgV from './img/img'
	import selectComponent from './select/select'
	import tableComponent from './table/table'
	export default {
		name: 'module',
		props: ["result"],
		components: {
			font,
			imgV,
			selectComponent,
			tableComponent
		},
		methods: {
			greet: function(event) {
				console.log(event);
				event.current = true;
				this.$emit('hideAll')
			},
			toFather: function(result) { // 按钮点击触
				this.$emit('myChild', this.massage) // 使用$emit来向父组件传播
				result.current = true;
			}
		},
		data() {
			return {}
		}
	}
</script>
<style scoped>
	.module {
		position: absolute;
		overflow: hidden;
	}
</style>