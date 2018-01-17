<template>
	<select class="c-font-size" v-model="result.fontSize">
		<option v-for="o in options" :value="o.value">
			{{ o.text }}
		</option>
	</select>
</template>

<script>
	let fontValue = [];
	
	for (var i = 12; i <= 60; i+=2){
		fontValue.push({
			text: i+'px',
			value: i
		})
	}
	console.log(fontValue)
	export default {
		name: 'font-size',
		props: ["result"],
		methods: {
			showThis: function(result) {
				console.log(result)
			}
		},
		data() {
			return {
				options: fontValue
			}
		}
	}
</script>
<style scoped>
	
</style>