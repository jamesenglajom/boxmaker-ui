<template>
    <div id="preview-canvas-wrap">
        <div>
            <img :src="prop.preview" alt="">
        </div>
    </div>
</template>
<script setup>
import {watch} from "vue";

const prop = defineProps(["preview"])

watch(()=> prop.preview,()=>{
console.log(prop.preview)
});
</script>
<style>
#preview-canvas-wrap{
    position:absolute;
    top:50px;
    left:50px;
    width:calc(100% - 100px);
    height:100vh;
}
#preview-canvas-wrap > div{
    background:whitesmoke;
    height:calc(100vh - 160px);
}
#preview-canvas-wrap > div > img{
    height:100%;
}
</style>