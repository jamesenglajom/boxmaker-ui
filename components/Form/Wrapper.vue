
<style>
/* partition divs */
#image-preview-container {
    width: 100%;
    height: 500px;
    display: flex
}

#sample-info {
    background: #F7F7F7;
    border: solid .5px #CCCCCC;
    width: 40%;
    position: relative;
    display: flex;
    cursor: help;
}

#sample-info>div {
    align-self: center;
}

#sample-info:hover>div {
    opacity: 85%;
}

#box-fold-preview {
    background: #F7F7F7;
    border: solid .5px #CCCCCC;
    border-left: none;
    width: 60%;
    position: relative;
}

#box-fold-preview>div {
    align-self: center;
}

#box-info-display {
    background: #1F1F21;
    color: white;
    position: absolute;
    padding: 8px 16px;
    width: 100%;
    bottom: 0;
    left: 0;
    opacity: 0%;
    transition: opacity ease-in-out .45s;
}

#page-select-container {
    width: 100%;
    border-bottom: solid .5px #CCCCCC;
    background: #666666;
    /* background: gray; */
    padding: 5px;
}

#page-select-container>label {
    color: white;
}


#unit-select-container {
    margin-top: 30px;
    padding: 2px 15px;
    text-align: center;
}

.input>.ui.label {
    background: #CCCCCC;
}

select.ui.selection.dropdown {
    padding: 0px;
}

i.circular.icon {
    font-size: .75em;
    color: gray;
}

.v-popper__popper {
    max-width: 250px;
}

.ui.basic.label {
    width: 50px;
    text-align: center;
}
</style>

<template>
    <div id="CommonFormComponent">

        <template v-if="box_loading">
            <div class="ui inverted segment" style="height:100vh">
                <div class="ui active large inverted loader text">
                    Loading ...
                </div>
            </div>
        </template>
        <div :style="box_loading?'display:none;':''">
            <div style="padding:20px 40px;">
                <span class="ui large text" style="color:white;">{{ box.name }}</span>
            </div>
            <div id="image-preview-container">
                <div id="sample-info" ref="sampleDiv">
                    <img style="max-height:500px;width:100%;" :src="sample_image" alt="">
                    <div id="box-info-display" ref="infoDiv">
                        {{ description }}
                    </div>
                </div>
                <div id="box-fold-preview">
                    <div id="page-select-container" v-if="page_preset">
                        <label for=""><small>{{ page_preset.name }}</small></label>
                        <select @change="check" class="ui dropdown selection" style="width:100%;"
                            v-model="form['PAGEPRESET']">
                            <template v-for=" datum  in Object.entries(page_preset.options)" :key="datum[1]">
                                <option :value="datum[0]">{{ datum[1] }}</option>
                            </template>
                        </select>
                        <div style="display:flex">
                            <template v-for="datum in page_wh">
                                <div class="field" style="color:white;padding-right:2px">
                                    <div class="label"><small>{{ datum.name }}</small></div>
                                    <div class="ui right labeled input">
                                        <input @input="check" type="number" :placeholder="datum.name"
                                            v-model="form[datum.symbol]" style="width:calc(100% - 80px)" />
                                        <div class="ui basic label">
                                            {{ 'in' }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div>
                        <img style="max-height:calc(500px - 130px);width:100%;" :src="preview" alt="">
                    </div>
                </div>
            </div>
            <div id="form-container">
                <!-- units -->
                <div id="unit-select-container">
                    <div class="ui buttons">
                        <template v-for="datum in units">
                            <button class="ui button red" v-tooltip="datum.name"
                                @click="unitSelect(form['UNITS'], datum.value)"
                                :class="form['UNITS'] == datum.value ? 'active' : ''">{{
                                    datum.abbr }}</button>
                        </template>
                    </div>
                </div>

                <!-- dimensions -->
                <div style="padding:20px;">
                    <FormGroup :category="'dimension'" :convert="convert_flag" :unit="form['UNITS']"
                        @formValues="handleFieldValueChange"></FormGroup>
                </div>


                <!-- SUBMIT BUTTON -->
                <div style="width:100%;box-sizing: border-box;padding:5px;text-align:center;margin-bottom: 20px;">
                    <div class="ui button red" :class="disable_submit ? 'disabled' : ''">
                        <button @click="submitForm">Submit</button>
                    </div>
                </div>


                <div style="padding:0px 20px;margin-bottom:20px;">
                    <!-- others form -->
                    <!-- <div style="width:50%;padding-right:10px;"> -->
                    <FormGroup :category="'other specifications'" :convert="convert_flag" :unit="form['UNITS']"
                        @formValues="handleFieldValueChange">
                    </FormGroup>
                    <!-- </div> -->
                    <!-- prof form -->
                    <!-- <div style="width:50%;padding-left:10px;"> -->
                    <FormGroup :category="'professional'" :convert="convert_flag" :unit="form['UNITS']"
                        @formValues="handleFieldValueChange">
                    </FormGroup>
                    <!-- </div> -->
                </div>
                <!-- SUBMIT BUTTON -->
                <div style="width:100%;box-sizing: border-box;padding:5px;padding-bottom:30px;text-align:center;margin-bottom: 60px;">
                    <div class="ui button red" :class="disable_submit ? 'disabled' : ''">
                        <button @click="submitForm">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ComFormComponent',
    inheritAttrs: false,
    customOptions: {}
}
</script>


<script setup>
import { storeToRefs } from 'pinia';
import { ref, onMounted, computed, watch } from 'vue'
import { useBoxMakerStore } from "@/stores/boxmaker"
// store
const boxmaker = useBoxMakerStore();
const { getStoredBox: box,
    getBoxFormValue: formVal,
    box_id,
    getBoxDescription: description,
    getBoxSampleImage: sample_image,
    getBoxDieLinePreviewImage: preview_image,
    getBoxPagePresetField: page_preset,
    getBoxPageWidthHeightField: page_wh
} = storeToRefs(boxmaker);

// data
const units = ref([
    { value: 'mm', name: 'Millimeter', abbr: 'mm' },
    { value: 'cm', name: 'Centimeter', abbr: 'cm' },
    { value: 'inch', name: 'Inch', abbr: 'in' },
]);
const form = ref({});
const preview = ref('');
const disable_submit = ref(false);
const convert_flag = ref(true);
const box_loading = ref(false)
const loading_delay = ref(1000);
// mounted
onMounted(async () => {
    if (box_id.value) {
        form.value = boxmaker.getBoxFormValue();
        preview.value = boxmaker.getBoxDieLinePreviewImage(form.value);
    }
})
// watch
watch(
    () => boxmaker.box_id, (v) => {
        box_loading.value = true;
        setTimeout(() => {
            box_loading.value = false;
        }
            , loading_delay.value);
        if (v) {
            form.value = boxmaker.getBoxFormValue();
            preview.value = boxmaker.getBoxDieLinePreviewImage(form.value);
        }
    }
);

function unitSelect(o, n) {
    form.value['UNITS'] = n;
    convert_flag.value = !convert_flag.value;
}
function handleFieldValueChange(v) {
    form.value = Object.assign(form.value, v.value)
    preview.value = boxmaker.getBoxDieLinePreviewImage(form.value);
}
async function submitForm() {
    disable_submit.value = true;
    let formData = form.value;
    formData['MODEL'] = boxmaker.getStoredBox.MODEL;
    formData['REQUEST'] = 'SIGNCUT';
    formData['CUSTOMER'] = boxmaker.getStoredBox.CUSTOMER;
    formData['KEY'] = "gAAAAABlcdnsuTKh5-MunYhaHHnQuYiqUGGNk3upJGjTifAR3OUwwZAnZz-4PGMm7um_bJobX1uR-N_f_HdQjqQn5hFz61fDKg";
    let url = boxmaker.getStoredBox.action,
        search = new URLSearchParams(formData) + "%3D%3D";
    await navigateTo(url + '?' + search, {
        open: {
            target: '_blank',
        }
    }).then(res => {
        disable_submit.value = false;
    });
};
</script>