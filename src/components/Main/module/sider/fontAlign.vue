<template>
	<div>
		<ul>
			<li 
				v-for="(item, index) in fontAlignData"
				:title="item.text"
				:class="[{active: result.textCenter === item.value}, item.value]"
				@click="clickTextAlign(item,index)">
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'font-align',
		props: ["result"],
		methods: {
			clickTextAlign: function(item, i) {
				this.result.textCenter = item.value;
				this.current = i;
			}
		},
		data() {
			return {
				current: -1,
				fontAlignData: [{ //字体位置
					text: "靠左",
					value: "left"
				}, {
					text: "居中",
					value: "center"
				}, {
					text: "靠右",
					value: "right"
				}]
			}
		}
	}
</script>
<style scoped>
	ul,
	li {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	ul {
		display: flex;
	}
	
	li {
		position: relative;
		flex: 1;
		height: 16px;
		line-height: 16px;
		border: 1px solid #dfdfdf;
		text-align: center;
		margin-right: -1px;
		cursor: pointer;
		background-repeat: no-repeat;
		background-position: center;
	}
	
	li:first-child {
		border-radius: 3px 0 0 3px;
	}
	
	li:last-child {
		border-radius: 0 3px 3px 0;
		margin-left: 0;
	}
	
	li.active {
		border-color: #1790db;
		background-color: #d7effe;
		color: #1790db;
		z-index: 9;
	}
</style>