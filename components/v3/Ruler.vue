<template>
    <template v-if="rendering == false">
        <div v-show="rendering == false" id="custom-ruler">
            <div id="ruler-x" class="rulers" :style="ruler_style ? ruler_style.x : null">
                <div class="label">
                    <ul :style="ruler_style ? ruler_style.xul : null">
                        <template v-for="( label, i ) in  label_count ">
                            <li :style="ruler_style ? ruler_style.li : null">{{ i * (unit ? unit_config[unit].init : 10) }}
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
            <div id="ruler-y" :style="ruler_style ? ruler_style.y : null">
                <div class="label">
                    <ul :style="ruler_style ? ruler_style.yul : null">
                        <template v-for="( label1, i1 ) in  label_count ">
                            <li :style="ruler_style ? ruler_style.li : null">{{ i1 * (unit ? unit_config[unit].init : 10) }}
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
        </div>
        <!-- canvas -->
        <div id="preview-canvas-wrap">
            <div style="position:relative;padding:0px;">
                <div id="canvas" :style="canvas_style">
                </div>
                <div :style="preview_dimension + `padding:0px;position:absolute;`">
                    <img id="box-image" :src="getImg()" alt="" style="width:100%;height:100%;object-fit: contain;z-index:2;position:relative;">
                </div>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="ui segment" style="height:100vh;z-index:9000;background:#ccc">
            <div class="ui active text loader">{{ loading_text }}
            </div>
        </div>
    </template>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useBoxMakerStore } from "@/stores/boxmaker";
const bm = useBoxMakerStore();

// boolean for loading view
const rendering = ref(false);
const loading_text = ref("Rendering...");
// ruler and canvas variables
// ---- dynamic
const cxmargin = 35;
const canvas_width = computed(() => bm.cw_width);
const canvas_height = computed(() => bm.cw_height);
const label_count = ref(10000);
const ruler_style = ref();
const canvas_style = ref();
const preview_dimension = ref();
const unit = ref(null);
const img = ref(null);
// ----- ruler static variables
const unit_config = ref({
    mm: { multi: 1, init: 10, conv_m: 1, can_m: 1 },
    cm: { multi: 10, init: 1, conv_m: 0.1, can_m: 1 },
    inch: { multi: 10, init: 1, conv_m: 0.039, can_m: 0.39 },
});
watch(() => bm.die_line_image, () => {
    // onchange loading to true
    renderRulers();
});

watch(() => canvas_height.value, () => {
    // onchange loading to true
    renderRulers();
});

watch(() => canvas_width.value, () => {
    // onchange loading to true
    renderRulers();
});

const renderRulers = () => {
    if (bm.box_id) {
        loading_text.value = "Rendering...";
        rendering.value = true;
        let cookie_var = new URL(bm.die_line_image);
        let params = new URLSearchParams(cookie_var.search);
        // rendering ruler and canvas from the request image url
        getMeta(getImg(), (err, img) => {
            // cookier variable * TODO: to be stored in a cookie
            // extracting variables from image preview request
            let pagewidth = params.get("PAGEWIDTH"),
                pageheight = params.get("PAGEHEIGHT"),
                pagepreset = params.get("PAGEPRESET");
            unit.value = params.get("UNITS");

            let multi = unit ? unit_config.value[unit.value].multi : 1;
            let conv_m = unit_config.value[unit.value].conv_m;
            let can_m = unit_config.value[unit.value].can_m;
            // creating the ruler
            let lengths = [];
            let cbase_length = canvas_width.value > canvas_height.value ? canvas_height.value : canvas_width.value;
            if (pagepreset.toLowerCase() == "auto") {
                lengths = [img.naturalWidth * conv_m, img.naturalHeight * conv_m];
            } else {
                lengths = [pagewidth, pageheight];
            }
            let pbase_length = Math.max(...lengths) * multi;

            let space = Math.floor(parseFloat((cbase_length - cxmargin) / pbase_length).toFixed(2));


            // console.log("=================================================");
            // console.log(pagepreset);
            // console.log("image url(full/dynamic)");
            // console.log(bm.die_line_image);
            // console.log("image url (static/base)");
            // console.log(getImg());
            // console.log(`${cbase_length}(cbase) - ${cxmargin}(margin)/(${pbase_length}(pbase) * ${multi}(multi))) `)
            // console.log(`space: ${space}`)

            // ruler variables
            const number_color = "#888", font_size = "10px", number_pi = "0.75ch", ruler_x = 1, ruler_y = 1;
            const r_color = "gray";
            // ruler 1 (small lines)
            const r1_bdw = 1, r1_height = 8, r1_space = space;
            // ruler 2 (tall lines)
            const r2_bdw = 1, r2_height = 16, r2_space = space * 5;
            // ruler 3 (tall lines)
            const r3_bdw = 1, r3_height = 24, r3_space = space * 10;
            // background-image
            let xbi = `background-image: linear-gradient(90deg, ${r_color} 0 ${r1_bdw}px, transparent 0),linear-gradient(90deg, ${r_color} 0 ${r2_bdw}px, transparent 0),linear-gradient(90deg, ${r_color} 0 ${r3_bdw}px, transparent 0);`;
            let ybi = `background-image: linear-gradient(0deg, ${r_color} 0 ${r1_bdw}px, transparent 0),linear-gradient(0deg, ${r_color} 0 ${r2_bdw}px, transparent 0),linear-gradient(0deg, ${r_color} 0 ${r3_bdw}px, transparent 0);`;
            // background-size
            let xbs = `background-size: ${r1_space * ruler_x}px ${r1_height}px,${r2_space * ruler_x}px ${r2_height}px,${r3_space * ruler_x}px ${r3_height}px;`;
            let ybs = `background-size: ${r1_height}px ${r1_space * ruler_y}px,${r2_height}px ${r2_space * ruler_y}px,${r3_height}px ${r3_space * ruler_y}px;`;
            // width
            let x = xbi + xbs + `width: ${canvas_width.value - cxmargin}px;`;
            let y = ybi + ybs + `height: ${canvas_height.value - 29}px;`;
            let li = `counter-increment: d ${r3_space};flex: 0 0 ${r3_space}px;`;
            let xul = `height: ${r2_height};inset-inline-start: ${r2_space}px);opacity: ${ruler_x};`;
            let yul = `opacity: ${ruler_y};width: ${r2_height};inset-block-start: ${r2_space}px;`;
            preview_dimension.value = `width: ${img.naturalWidth * space * can_m}px;height: ${img.naturalHeight * space * can_m}px;`;
            ruler_style.value = { x, y, li, xul, yul };

            // console.log(`canvas size: ${canvas_width.value + ' x ' + canvas_height.value}`)
            // console.log(`template size(original): ${img.naturalWidth + ' x ' + img.naturalHeight}`)
            // console.log(`template size(unit converted): ${img.naturalWidth * conv_m + ' x ' + img.naturalHeight * conv_m}`)
            // console.log(`page size: ${pagewidth + ' x ' + pageheight}`)

            if (pagepreset.toLowerCase() == "auto") {
                canvas_style.value = preview_dimension.value;
                rendering.value = false;
            } else {
                let width = img.naturalWidth * conv_m, height = img.naturalHeight * conv_m;
                // console.log(`width:  ${width} height: ${height}`)
                if (pagewidth > width && pageheight > height) {
                    canvas_style.value = `width: ${pagewidth * space * multi}px;height: ${pageheight * space * multi}px;`;
                    rendering.value = false;
                } else {
                    loading_text.value = `Invalid page settings. Page dimension must be greater than the generated template ${width} x ${height} (${unit.value}).`;
                }
            }
        });
    }
}

const getMeta = (url, cb) => {
    const img = new Image();
    img.onload = () => cb(null, img);
    img.onerror = (err) => cb(err);
    img.src = url;
};
// temporary only to display static image
const getImg = () => {
    return `https://templatemaker-dev.signcut.com/?REQUEST=DIELINESPREVIEW&MODEL=${bm.box_id}&CUSTOMER=whisqu`;
}
const round = (num) => {
    return +(Math.round(num + "e+2")  + "e-2");
}
</script>

<style>
/* canvas styles */
#preview-canvas-wrap {
    position: absolute;
    top: 30px;
    left: 30px;
    padding: 0px;
}

#canvas {
    background: white;
    padding: 0px;
    z-index: 1;
    position: absolute;
}


/* ruler styles */
#custom-ruler {
    width: 100%;
    padding: 0px;
    background-color: lightgray;
    position: relative;
}

.rulers {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

#ruler-x {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    margin-left: 30px;
    background: whitesmoke;
    background-attachment: fixed;
    background-repeat: repeat-x, repeat-x, repeat-x;
    padding: 0px;
}

#ruler-y {
    position: absolute;
    top: 0;
    left: 0;
    background: whitesmoke;
    color: gray;
    height: calc(100vh - 120px);
    width: 25px;
    margin-top: 30px;
    background-attachment: fixed;
    padding: 0px 0px 0px 5px;
    background-repeat: repeat-y, repeat-y;
}

ul:hover {
    color: black;
}

ul {
    color: #ccc;
    display: flex;
    font-size: 0.5em;
    list-style: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    z-index: 1000;
}

#ruler-x>div>ul {
    width: 100%;
    margin-top: 10px;
}

#ruler-y>div>ul {
    flex-direction: column;
    height: 100%;
    inset-inline-start: 0;
}

#ruler-x>div>ul>li {
    align-self: flex-end;
}


#ruler-x>div>ul>li::after {
    line-height: 1;
    padding-inline-start: 0.75ch;
}

#ruler-y>div>ul>li::after {
    display: block;
    padding-inline-end: 0.75ch;
    transform: rotate(-90deg) translateY(-13px) !important;
    transform-origin: 100% 0%;
    text-align: end;
    width: 100%;
}

* {
    box-sizing: border-box;
}
</style>

