<template>
	<select v-model="result.fontFamily">
		<option v-for="o in fontFamilyOptions" v-bind:value="o.value">
			{{ o.text }}
		</option>
	</select>
</template>

<script>
	export default {
		name: 'font-family',
		props: ["result"],
		methods: {
			showThis: function(result) {
				console.log(result)
			}
		},
		data() {
			return {
				fontFamilyOptions: [{ //字体样式
					text: "微软雅黑",
					value: "微软雅黑"
				}, {
					text: "宋体",
					value: "宋体"
				}, {
					text: "黑体",
					value: "黑体"
				}]
			}
		}
	}
</script>
<style scoped>

</style>