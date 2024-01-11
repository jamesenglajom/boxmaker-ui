<template>
    <div id="preview-canvas-wrap">
        <div id="canvas" :style="canvas_style">
            <img id="box-image" :src="prop.preview" alt="" :style="preview_dimension">
        </div>
    </div>
</template>
<script setup>
import { watch, computed } from "vue";
import { useBoxMakerStore } from "@/stores/boxmaker";
const bm = useBoxMakerStore();
const prop = defineProps(["preview", "page_width", "page_height"]);
const canvas_style = ref();
const canvas_width = computed(() => bm.cw_width);
const canvas_height = computed(() => bm.cw_height);
const preview_dimension = ref();
watch(() => prop.page_width, (v) => {
    canvas_style.value = makeCanvasStyle()
});

watch(() => prop.page_height, (v) => {
    canvas_style.value = makeCanvasStyle()
});
watch(() => canvas_width.value, (v) => {
    canvas_style.value = makeCanvasStyle()
});

watch(() => canvas_height.value, (v) => {
    canvas_style.value = makeCanvasStyle()
});


watch(() => prop.preview, (v) => {
    canvas_style.value = makeCanvasStyle()
});

const makeCanvasStyle = () => {
    let minval = 100, result = `width:${1 * minval}px;height:${1 * minval}px;`;
    if (prop.page_height > 10 && prop.page_height != "" && prop.page_width > 10 && prop.page_width != "") {
        let space = prop.page_height > prop.page_width ? (canvas_width.value - 35) / prop.page_height : (canvas_width.value - 35) / prop.page_width;
        getMeta(prop.preview, (err, img) => {
            // console.log(img.naturalWidth, img.naturalHeight);
            preview_dimension.value = `width: ${img.naturalWidth * space}px,height: ${img.naturalHeight * space}px`;
        }); 
        result = `width:${space * prop.page_width}px;height:${space * prop.page_height}px;`;
    }
    return result;
}
const getMeta = (url, cb) => {
    const img = new Image();
    img.onload = () => cb(null, img);
    img.onerror = (err) => cb(err);
    img.src = url;
};
</script>
<style lang="scss">
#preview-canvas-wrap {
    position: absolute;
    top: 30px;
    left: 30px;
    padding: 0px;
}

#preview-canvas-wrap>#canvas {
    background: white;
    padding: 0px;
}

</style>