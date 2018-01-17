<template>
	<div>
		<img v-bind:src="result.attr.src"  v-bind:originSrc="result.attr.originSrc" :width="result.width" :height="result.height" :w="result.attr.w" :h="result.attr.h" :x="result.attr.x" :y="result.attr.y" :angle="result.attr.angle" :scale="result.attr.scale" v-on:dblclick="crop"  v-on:click="exchange" v-on:mouseover="mouseover" v-on:mouseout="mouseout" :style="[{opacity:opacity}]"/>
	</div>
</template>

<script>
	export default {
		name: 'imgV',
		props: ["result"],
		components: {
		},
		computed:{
			opacity(){
				return this.result.attr.opacity/100;
			}
		},
		methods: {
			crop(){
				new CropImage({
					vue:this
				});
			},
			exchange(){
				if(this.$root.exchangeImg){
					let temp={}
					temp.src=this.$root.exchangeImg.src;
					temp.originSrc=this.$root.exchangeImg.originSrc;
					this.$root.exchangeImg.src=this.result.attr.src;
					this.$root.exchangeImg.originSrc=this.result.attr.originSrc;
					this.result.attr.src=temp.src;
					this.result.attr.originSrc=temp.originSrc;
					delete this.$root.exchangeImg;
					this.$el.style.opacity=1;
				}
			},
			mouseover(){
				if(this.$root.exchangeImg&&(this.$root.exchangeImg.src!=this.result.attr.src))
					if(this.$root.exchangeImg){
						this.$el.style.opacity=0.5;
					}
			},
			mouseout(){
				if(this.$root.exchangeImg){
					this.$el.style.opacity=1;
				}
			}
		},
		data() {
			return {
			}
		}
	}
</script>
<style scoped>
	
</style>