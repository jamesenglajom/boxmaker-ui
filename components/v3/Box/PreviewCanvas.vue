<template>
    <div id="preview-canvas-wrap">
        <div>
            <img :src="prop.preview" alt="">
        </div>
    </div>
</template>
<script setup>
const prop = defineProps(["preview"])
</script>
<style>
#preview-canvas-wrap{
    position:absolute;
    top:50px;
    left:50px;
    width:calc(100% - 100px);
    height:calc(100vh - 200px);
    display:flex;
    justify-content:center;
}
#preview-canvas-wrap > div{
    align-self:center;
    background:transparent;
    height:calc(100vh - 160px);
}
#preview-canvas-wrap > div > img{
    height:100%;
}
</style>