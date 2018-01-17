<template>
	<div class="table-component" :class="result.style">
		<table>
			<tr v-for="(row,rowIndex) in result.row">
				<td v-for="(col,colIndex) in row.col" @click='getIndex(rowIndex,colIndex)' :style="{
					background: col.background
				}">
					<input type="text" v-model="col.text" class="input-style" :style="{
						fontSize: col.fontSize+'px',
						fontFamily: col.fontFamily,
						color: col.color,
						textAlign: col.textCenter,
						fontWeight: col.other.bold?'bold':'normal',
						fontStyle: col.other.italic?'italic':'normal',
						textDecoration:col.other.underline?'underline':'none'
					}" />
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
	export default {
		name: 'table-component',
		props: ["result", "height"],
		components: {},
		methods: {
			getIndex: function(r, c) {
				this.result._r_index = r;
				this.result._c_index = c;
			}
		},
		data() {
			return {}
		}
	}
</script>
<style scoped>
	.table-component td {
		border: 1px solid #ffffff;
		border-left: 0;
		border-right: 0;
		min-height: 36px;
		height: 36px;
	}
	
	.table-component td:first-child {
		border-left: 1px solid #ffffff;
	}
	
	.table-component td:last-child {
		border-right: 1px solid #ffffff;
	}
	
	.table-component.gray td {
		border: 1px solid #888888;
	}
	
	.table-component.gray td:first-child {
		border-left: 1px solid #888888;
	}
	
	.table-component.gray td:last-child {
		border-right: 1px solid #888888;
	}
	
	.table-component.red td {
		border: 1px solid red;
	}
	
	.table-component.red td:first-child {
		border-left: 1px solid red;
	}
	
	.table-component.red td:last-child {
		border-right: 1px solid red;
	}
	
	.table-component.blue td {
		border: 1px solid blue;
	}
	
	.table-component.blue td:first-child {
		border-left: 1px solid blue;
	}
	
	.table-component.blue td:last-child {
		border-right: 1px solid blue;
	}
	
	.input-style {
		width: 100%;
		border: none;
		cursor: default;
		vertical-align: top;
		background: none;
	}
	
	.input-style:focus {
		cursor: auto;
		border: 1px dashed #ddd;
	}
</style>