<template>
    <div id="preview-canvas-wrap">
        <div>
            <img src="https://templatemaker-dev.signcut.com/?REQUEST=DIELINESPREVIEW&MODEL=arced&CUSTOMER=whisqu&UNITS=mm&PAGEPRESET=Auto&PAGEWIDTH=200&PAGEHEIGHT=200&T=0.5&N=8&SLOT=2&FLAP=20&GLUEANGLE=80&GLUE=15&R=10&OS=10&L=100&W=70&H=50&REGISTRATION=page&MARK=6&BLEED=3&OVERCUT=0&DASH=40&GAP=0&FILMIN=0" alt="">
        </div>
    </div>
</template>
<script setup>
import {watch} from "vue";

const prop = defineProps("preview")

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
    height:calc(100vh - 300px);
}
</style>