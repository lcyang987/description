<template>
	<div  v-if="result.show">
		<div class="fc">
			
		</div>
		<div class="bg">
			<div class="font">
			正在保存第{{result.num}}/{{result.max}}张
		</div>
			<div class="loading-bar" v-bind:style="{width:556*result.num/result.max+'px'}">
		</div>
		</div>
		
		
	</div>
</template>

<script>
	export default {
		props:["result"] 
	}
</script>

<style scoped="scoped">
	.font{
		    height: 31px;
    line-height: 30px;
    margin-top: 10px;
    margin-left: 20px;
    font-size: 20px;
	}
	.fc{
	    background-color: rgb(255, 255, 255);
    opacity: 0.8;
    display: block;
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 990px;
    overflow: hidden;
    z-index: 9998;
	}
	.bg{
		background: url(../../../static/loadingbg.png)  no-repeat;
		    width: 593px;
    height: 167px;
    position: fixed;
    z-index: 9999;
    top: 50%;
    left: 50%;
    margin-top: -80px;
    margin-left: -300px;
	}
	.loading-bar{
		background: url(../../../static/loadingbody.png);
		width: 100px;
		    height: 88px;
    position: absolute;
    left: 11px;
    top: 48px;
	}
	
</style>