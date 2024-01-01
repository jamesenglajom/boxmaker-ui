<style>
div#page-w-h :nth-child(1){
padding-right:2px !important;
}
div#page-w-h :nth-child(2){
 padding-left:2px !important;
}
select.ui.dropdown.selection{
    padding: 0px;
}
.ui.accordion>.active.content {
    /* height: calc(100vh - 300px); */
    position: relative;
    padding:20px !important;
    background:whitesmoke;
}

.ui.accordion>.title {
    cursor: pointer;
}

.ui.accordion>.title.active {
    cursor: default;
}

#flyout-content-wrapper {
    width: 100%;
    box-sizing: border-box;
    padding: 0px !important;

}

.content {
    padding: 0px !important;
}

#representation-wrapper {
    width: calc(100% - 60px);
    min-width: 400px;
    background: #cccccc;
    height: calc(100vh - 60px);
}

#form-wrapper {
    min-width: 400px;
    width: 400px;
    position: relative;
    height: calc(100vh - 60px);
    overflow-y: auto;
    background: white;
    padding: 0px 4px;
}

#sample-info {
    width: 100%;
    height: calc(31vh + 4px);
    padding-bottom: 50px;
    background: #F7F7F7;
    border: solid .5px #CCCCCC;
    position: relative;
    display: flex;
    cursor: help;
}

#sample-info>div {
    align-self: center;
    opacity: 0;
    transition: opacity ease-in-out 0.25s;
}

#sample-info:hover>div {
    opacity: 85%;
}

#box-fold-preview {
    width: 100%;
    position: relatve;
}

#flyout-header {
    width: 100%;
    height: 60px;
    background: white;
    display: flex;
    padding: 10px;
}

#flyout-header>div {
    align-self: center;
}

.back-button {
    background: transparent !important;
    cursor: pointer;
}

.back-button:hover {
    background: whitesmoke !important;
}
</style>

<template>
    <div id="flyout-content-wrapper">
        <div id="flyout-header">
            <div class="ui button circular icon back-button" @click="closeFlyout">
                <i class="ui arrow left icon"></i>
            </div>
            <div style="margin-left:10px;">
                <span class="ui text large">{{ box_id ? bm.getStoredBox.name : '' }}</span>
            </div>
        </div>
        <div style="display:flex">
            <div id="representation-wrapper">
                <div id="box-fold-preview">
                    <V1BoxPreviewCanvas :preview="preview"></V1BoxPreviewCanvas>
                </div>
            </div>
            <div id="form-wrapper">
                <div class="ui styled accordion" style="margin-top:7px;">
                    <template v-for="datum in accordion_items">
                        <div class="title active">
                            <i class="dropdown icon"></i>
                            {{ datum.toUpperCase() }}
                        </div>
                        <div class="content active">
                            <template v-if="datum == 'sample image'">
                                <div id="sample-info">
                                    <img style="max-height:500px;width:100%;" :src="sample_image" alt="">
                                    <div id="box-info-display" ref="infoDiv">
                                        {{ description }}
                                    </div>
                                </div>
                            </template>
                            <template v-else-if="datum == 'standard'">
                                <div id="page-select" v-if="page_preset" style="margin-top:7px;">
                                    <label for="">{{ page_preset.name }}</label>
                                    <select @change="check" class="ui dropdown selection" style="width:100%;"
                                        v-model="form['PAGEPRESET']">
                                        <template v-for=" datum  in Object.entries(page_preset.options)" :key="datum[1]">
                                            <option :value="datum[0]">{{ datum[1] }}</option>
                                        </template>
                                    </select>
                                    <div id="page-w-h" style="display:flex;margin-top:7px;">
                                        <template v-for="datum in page_wh">
                                            <div class="field">
                                                <div class="label">{{ datum.name }}</div>
                                                <div class="ui right labeled input" :class="form['PAGEPRESET'] == 'Custom'?'':'disabled'">
                                                    <input @input="check" type="number" :placeholder="datum.name"
                                                        v-model="form[datum.symbol]" style="width:calc(100% - 80px)" />
                                                    <div class="ui basic label">
                                                        {{ form['UNITS'] }}
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                <div class="ui buttons" style="width:100%;margin-top:7px;border-radius:none !important;">
                                    <template v-for="datum in units">
                                        <button class="ui button basic" v-tooltip="datum.name"
                                            @click="unitSelect(form['UNITS'], datum.value)"
                                            :class="form['UNITS'] == datum.value ? 'active' : ''">{{
                                                datum.abbr }}</button>
                                    </template>
                                </div>
                            </template>
                            <template v-else>
                                <V1FormGroup :category="datum" :convert="convert_flag" :unit="form['UNITS']"
                        @formValues="handleFieldValueChange"></V1FormGroup>
                            </template>
                        </div>
                    </template>
                </div>
                <div style="width:100%;box-sizing: border-box;padding:5px;text-align:center;margin:10px 0px;" >
                    <div class="ui button red" @click="submitForm">
                        <div style="display:flex;">
                            <div style="align-self:center;">
                                <img :src="goldCoin" alt="" style="width:18px;">
                            </div>
                            <div style="align-self:center;margin-left:4px;">
                                3
                            </div>
                            <div style="align-self:center;margin-left:10px;">
                                PURCHASE
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script setup>
import { storeToRefs } from 'pinia';
import { ref, onMounted, computed, watch } from 'vue'
import { useBoxMakerStore } from "@/stores/boxmaker"
import goldCoin from "@/assets/images/others/gold-coin.svg"

// store
const bm = useBoxMakerStore();
const { getStoredBox: box,
    getBoxFormValue: formVal,
    box_id,
    getBoxDescription: description,
    getBoxSampleImage: sample_image,
    getBoxDieLinePreviewImage: preview_image,
    getBoxPagePresetField: page_preset,
    getBoxPageWidthHeightField: page_wh
} = storeToRefs(bm);

// data
const units = ref([
    { value: 'mm', name: 'Millimeter', abbr: 'mm' },
    { value: 'cm', name: 'Centimeter', abbr: 'cm' },
    { value: 'inch', name: 'Inch', abbr: 'in' },
]);
const form = ref({});
const preview = ref('');
const disable_submit = ref(false);
const convert_flag = ref('true');
const accrodion_tab = ref("dimension");
const accordion_items = ref(["sample image", "standard", "dimension", "other specifications", "professional"]);
// watch
watch(
    () => bm.box_id, (v) => {
        if (v) {
            form.value = bm.getBoxFormValue();
            preview.value = bm.getBoxDieLinePreviewImage(form.value);
            console.log(preview.value);
        }
    }
);

function unitSelect(o, n) {
    form.value['UNITS'] = n;
    convert_flag.value = !convert_flag.value;
}
function handleFieldValueChange(v) {
    form.value = Object.assign(form.value, v.value)
    preview.value = bm.getBoxDieLinePreviewImage(form.value);
}
async function submitForm() {
    disable_submit.value = true;
    let formData = form.value;
    formData['MODEL'] = bm.getStoredBox.MODEL;
    formData['REQUEST'] = 'SIGNCUT';
    formData['CUSTOMER'] = bm.getStoredBox.CUSTOMER;
    formData['KEY'] = "gAAAAABlcdnsuTKh5-MunYhaHHnQuYiqUGGNk3upJGjTifAR3OUwwZAnZz-4PGMm7um_bJobX1uR-N_f_HdQjqQn5hFz61fDKg";
    let url = bm.getStoredBox.action,
        search = new URLSearchParams(formData) + "%3D%3D";
    await navigateTo(url + '?' + search, {
        open: {
            target: '_blank',
        }
    }).then(res => {
        disable_submit.value = false;
    });
};

const closeFlyout = () => {
    bm.$patch({
        box_id: null
    });
}
</script>