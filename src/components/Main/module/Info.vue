<template>
	<div class="moduleInfo" v-on:click="showThis(result)" v-show="result.current">
		<ul>
			<li>
				<div class="info-title">大小</div>
				<div class="info-content"> <input type="text" v-model="result.width" /><small>宽</small></div>
				<div class="info-content"> <input type="text" v-model="result.height" /><small>高</small></div>
			</li>
			<li>
				<div class="info-title">位置</div>
				<div class="info-content"> <input type="text" v-model="result.x" /><small>X</small></div>
				<div class="info-content"> <input type="text" v-model="result.y" /><small>Y</small></div>
			</li>
		</ul>
		<ul>
			<li>
				<div class="info-title">层级</div>
				<div class="info-content"><button v-if="result.zIndex>=6" disabled="disabled"></button><button v-if="result.zIndex<6" v-on:click="result.zIndex += 1" class="zIndexUp"></button><small>上移</small></div>
				<div class="info-content"><button v-if="result.zIndex<=0" disabled="disabled"></button> <button v-if="result.zIndex>0" v-on:click="result.zIndex=result.zIndex- 1" class="zIndexDown"></button> <small>下移</small></div>
			</li>
		</ul>
		<div v-if="result.type==='font'">
			<fontInfo v-bind:result="result.attr"></fontInfo>
		</div>
		<div v-if="result.type==='img'">
			<imgInfo v-bind:result="result"></imgInfo>
		</div>
		<div v-if="result.type==='select'">
			<selectInfo 
				:result="result.attr.editTitle?result.attr.title:result.attr.values[result.attr.index]"
				:resultAttr="result.attr"
			></selectInfo>
		</div>
		<div v-if="result.type==='table'">
			<tableInfo 
				:result="result.attr.data.row[result.attr.data._r_index].col[result.attr.data._c_index]"
				:tableData="result.attr.data"
			></tableInfo>
		</div>
	</div>
</template>

<script>
	import fontInfo from './font/fontInfo'
	import imgInfo from './img/info'
	import tableInfo from './table/tableInfo'
	import selectInfo from './select/fontInfo'
	export default {
		name: 'moduleInfo',
		components: {
			fontInfo,
			imgInfo,
			selectInfo,
			tableInfo
		},
		props: ["result"],
		methods: {
			showThis: function(result) {
				console.log(result)
			}
		},
		data() {
			return {}
		}
	}
</script>
<style scoped lang="less">
	.module {
		position: absolute;
	}
	.info-content{
		button{
			    cursor: pointer;
    width: 57px;
    height: 20px;
    border: 1px solid #f4f4f4;
    background: #ffffff;
    color: #ebebeb;
    line-height: 20px;
    /* margin-top: 15px; */
    /* margin-left: 20px; */
    border-radius: 3px;
    &:disabled{
    	 background: #ebebeb;
    }
		}
		button{
			background-repeat: no-repeat;
			background-color:white;
			background-position:center;
			border:1px solid #f4f4f4;
		}
		.zIndexUp{
			background-image:url('~assets/zIndexUp.jpg')
		}
		.zIndexDown{
			background-image:url('~assets/zIndexDown.jpg')
		}
	}
	
	
	.moduleInfo {
		ul {
			border-bottom: 1px solid #eee;
			overflow: hidden;
			padding-bottom: 20px;
			li {
				text-align: center;
				margin-top: 20px;
				.info-title {
					width: 40px;
					float: left;
				}
				.info-content {
					width: 60px;
					float: left;
					margin-left: 10px;
					input {
						width: 60px;
						text-align: center;
					}
					button {
						width: 60px;
						height: 20px;
					}
				}
			}
		}
	}
</style>