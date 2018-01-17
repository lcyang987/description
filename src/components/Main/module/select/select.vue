<template>
	<div class="select-component" :class="result.style" :style="{background: result.background}">
		<div v-if="result.title" class="title">
			<p 
				contenteditable="true"
				v-html="result.title.text"
				:style="{
					fontSize: result.title.fontSize+'px',
					fontFamily: result.title.fontFamily,
					textAlign: result.title.textCenter,
					color: result.title.color,
					fontWeight: result.title.other.bold?'bold':'normal',
					fontStyle: result.title.other.italic?'italic':'normal',
					textDecoration:result.title.other.underline?'underline':'none'
				}"
				@click = "changeTitle"
				@keyup = "changeTitleVal($event)"
			>
			</p>	
		</div>
		<ul>
			<li :class="{active:index==result.index}" v-for="(value,index) in result.values">
				<p 
					contenteditable="true" 
					v-html="value.text" 
					@keyup="changeVal(index,$event)"
					@click="selectFn(index)"
					:style="{
						fontSize: value.fontSize+'px',
						fontFamily: value.fontFamily,
						textAlign: value.textCenter,
						color: value.color,
						fontWeight: value.other.bold?'bold':'normal',
						fontStyle: value.other.italic?'italic':'normal',
						textDecoration:value.other.underline?'underline':'none'
					}"
				></p>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'select-component',
		props: ["result", "height"],
		components: {},
		methods: {
			selectFn: function(i) {
				this.result.editTitle = false;
				this.result.index = i;
			},
			changeVal: function(i,e) {
				this.result.values[i].text = e.target.innerHTML
			},
			changeTitle: function(){
				this.result.editTitle = true
			},
			changeTitleVal: function(e){
				this.result.title.text = e.target.innerHTML
			}
		},
		data() {
			return {
			}
		}
	}
</script>
<style scoped>
	ul {
		display: inline-block;
	}
	li {
		display: inline-block;
		width: 50px;
		max-width: 100px;
		min-height: 22px;
		margin: 8px 20px 8px 0;
	}
	.title {
		display: inline-block;
		min-height: 22px;
		margin-right: 10px;
		padding: 0 5px;
	}
	.gray li.active,
	.gray-border li.active {
		background: #888888;
		color: #fff;
	}
	
	.red li.active {
		background: red;
		color: #fff;
	}
	
	.blue li.active {
		background: blue;
		color: #fff;
	}
	
	.gray-border {
		border-bottom: 1px dashed #ccc;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
	
	.white-border {
		border-top: 1px dashed #ccc;
		border-bottom: 1px dashed #ccc;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
	
	.input-style {
		width: inherit;
		min-height: 22px;
		height: 100%;
		line-height: 22px;
		background: none;
		border: 0;
		cursor: default;
		vertical-align: top;
		resize: none;
	}
	
	.input-style:focus {
		cursor: auto;
	}
</style>