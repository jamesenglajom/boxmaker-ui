<template>
    <div id="form-wrapper">
        <div class="ui styled accordion">
            <template v-for="datum in accordion_items">
                <div class="title active">
                    <i class="dropdown icon"></i>
                    {{ datum.toUpperCase() }}
                </div>
                <div class="content active">
                    <template v-if="datum == 'sample image'">
                        <div id="sample-info">
                            <img :src="sample_image" alt="">
                            <div id="box-info-display">
                                {{ description }}
                            </div>
                        </div>
                    </template>
                    <template v-else-if="datum == 'standard'">
                        <div id="page-select" v-if="page_preset" style="margin-top:7px;">
                            <label for="">{{ page_preset.name }}</label>
                            <select @change="handleFieldValueChange(form['PAGEPRESET'])" class="ui dropdown selection"
                                style="width:100%;" v-model="form['PAGEPRESET']">
                                <template v-for=" datum  in Object.entries(page_preset.options)" :key="datum[1]">
                                    <option :value="datum[0]">{{ datum[1] }}</option>
                                </template>
                            </select>
                            <div id="page-w-h" style="display:flex;margin-top:7px;">
                                <template v-for="datum in page_wh">
                                    <div class="field">
                                        <div class="label">{{ datum.name }}</div>
                                        <div class="ui right labeled input"
                                            :class="form['PAGEPRESET'] == 'Custom' ? '' : 'disabled'">
                                            <input @input="handleFieldValueChange(form[datum.symbol])" type="number"
                                                :placeholder="datum.name" v-model="form[datum.symbol]"
                                                style="width:calc(100% - 80px)" />
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
                                <label class="ui button basic" v-tooltip="datum.name" :for="datum.value"
                                    :class="form['UNITS'] == datum.value ? 'active' : ''">{{
                                        datum.abbr }}</label>
                                <input type="radio" :name="datum.value" :id="datum.value" style="display:none;"
                                    :value="datum.value" v-model="form['UNITS']">
                            </template>
                        </div>
                    </template>
                    <template v-else>
                        <V3FormGroup :category="datum" :form_values="form" @formValues="handleFieldValueChange">
                        </V3FormGroup>
                    </template>
                </div>
            </template>
        </div>
        <div style="width:100%;box-sizing: border-box;padding:5px;text-align:center;margin-bottom:30px;">
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
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCookie } from 'nuxt/app';
import { ref, computed, watch } from 'vue';
import { useBoxMakerStore } from "@/stores/boxmaker";
import goldCoin from "@/assets/images/others/gold-coin.svg";
const bm = useBoxMakerStore();

const sc_cookie = useCookie("SC_BOXMAKER_user123");
const {
    getBoxDescription: description,
    getBoxSampleImage: sample_image,
    getBoxPagePresetField: page_preset,
    getBoxPageWidthHeightField: page_wh
} = storeToRefs(bm);

const accordion_items = ref(["sample image", "standard", "dimension", "other specifications", "professional"]);

// data
const form = ref([]);
var default_values = [];
const disable_submit = ref(false);
const emit = defineEmits(["discard"]);

const units = ref([
    { value: 'mm', name: 'Millimeter', abbr: 'mm' },
    { value: 'cm', name: 'Centimeter', abbr: 'cm' },
    { value: 'inch', name: 'Inch', abbr: 'in' },
]);


// watch
watch(() => bm.box_id, (v) => {
    form.value["UNITS"] = undefined;
    initForm();
});
watch(() => form.value["UNITS"], (n, o) => {
    form.value = convert(o, n, form.value);
    bm.setBoxDieLinePreviewImage(form.value);
});
watch(()=> bm.die_line_image, ()=>{
    // console.log("isEqual:" + !isEqual(form.value,JSON.parse(default_values)))
    // console.log("if true open discard component, else.")
    // console.log(form.value);
    // console.log(JSON.parse(default_values));
    emit('discard', !isEqual(form.value,JSON.parse(default_values)));
});

// functions

const initForm = () => {
    if (bm.memory) {
        form.value = sc_cookie.value.data;
        default_values = JSON.stringify(sc_cookie.value.data);
    }else{
        form.value = bm.getBoxFormValue();
        default_values = JSON.stringify(bm.getBoxFormValue());
    }
    bm.setBoxDieLinePreviewImage(form.value);
}
function convert(from, to, data) {
    from = from ?? to;
    // specify to-convert properties
    let units = {
        mm: { name: "mm", mm: 1, cm: .1, inch: 0.0393700787 },
        cm: { name: "cm", mm: 10, cm: 1, inch: 0.3937007874 },
        inch: { name: "inch", mm: 25.4, cm: 2.54, inch: 1 }
    }
    let temp = data,
        prop = computed(() => bm.getBoxForm());
    Object.keys(data).forEach((v) => {
        let tmp = prop.value.filter(i => i.symbol == v);
        if (tmp.length != 0 && tmp[0].type == 'measure') {
            temp[v] = parseFloat((temp[v] * units[from][to]).toFixed(2));
        }
    });
    return temp;
}
const handleFieldValueChange = (v) => {
    form.value = Object.assign(form.value, v.value);
    bm.setBoxDieLinePreviewImage(form.value);
}   
async function submitForm() {
    disable_submit.value = true;
    let formData = form.value;
    formData['MODEL'] = bm.getStoredBox().MODEL;
    formData['REQUEST'] = 'SIGNCUT';
    formData['CUSTOMER'] = bm.getStoredBox().CUSTOMER;
    formData['KEY'] = "gAAAAABlcdnsuTKh5-MunYhaHHnQuYiqUGGNk3upJGjTifAR3OUwwZAnZz-4PGMm7um_bJobX1uR-N_f_HdQjqQn5hFz61fDKg";
    let url = bm.getStoredBox().action,
        search = new URLSearchParams(formData) + "%3D%3D";
    await navigateTo(url + '?' + search, {
        open: {
            target: '_blank',
        }
    }).then(res => {
        disable_submit.value = false;
        const sc_cookie = useCookie("SC_BOXMAKER_user123");
        sc_cookie.value = { date: new Date(), data: formData };
    });
};

</script>

<style lang="scss" scoped>
#flyout-content-wrapper.v3-1 {
    #form-wrapper {
        background: #f0f0f0;
        border-left: #DBDBDB 1px solid;

        select.ui.dropdown.selection {
            border-radius: 0px;
            border: #9b9b9b solid 1px;
            padding: 0px !important;
            margin: 0px !important;
        }


        #sample-info {
            width: 100%;
            padding: 10px;
            padding-bottom: 50px;
            background: #F7F7F7;
            border: solid .5px #CCCCCC;
            position: relative;
            display: flex;
            cursor: help;
            height: 350px;

            img {
                width: 100%;
            }

            &:hover {
                div#box-info-display {
                    opacity: 85%;
                }
            }

            div#box-info-display {
                padding: 5px;
                bottom: 0px;
                left: 0px;
                width: 100%;
                position: absolute;
                color: white;
                background: black;
                align-self: center;
                opacity: 0;
                transition: opacity ease-in-out 0.25s;
            }
        }




        div#page-w-h {
            padding: 0px;


            .field {
                padding: 0px;

                .label {
                    padding: 0px;
                }
            }


            .ui.right.labeled.input {
                border-radius: 0px !important;
                padding: 0px;
                width: 100%;
                border: 1px solid #9b9b9b;

                input {
                    padding: 0px !important;
                    background: #ffffff;
                    border: none;
                }

                div {
                    border-radius: 0px !important;
                    padding: 4px;
                    margin: 0px;
                    width: 50px;
                    text-align: center;
                    background: #ccc;
                }
            }

        }


        div.ui.styled.accordion {
            border-radius: 0px !important;
            margin-top: 7px;
        }

        div.ui.buttons {
            label.ui.button {
                border-radius: 0px !important;
                border: #9b9b9b solid 1px;

                &.active {
                    background: #ccc;
                }
            }
        }

        div.ui.button {
            background: #e1e1e1 !important;
            background-color: #e1e1e1 !important;
            border-radius: 0px;
            border: 1px solid #bebebe;
            color: black;
            padding: 2px 30px;
            border: 1px solid #9b9b9b;

        }

        .ui.accordion>.content {
            padding: 4px !important;
            border: 1px solid #9b9b9b;
        }
    }
}


#form-wrapper {
    min-width: 400px;
    width: 400px;
    position: relative;
    height: calc(100vh - 45px);
    overflow-y: auto;
    padding: 0px 4px;
}


select.ui.dropdown.selection {
    padding: 0px;
}

.ui.accordion>.active.content {
    /* height: calc(100vh - 300px); */
    position: relative;
    padding: 20px !important;
    background: whitesmoke;
}

.ui.accordion>.title {
    cursor: pointer;
}

.ui.accordion>.title.active {
    cursor: default;
}


.content {
    padding: 0px !important;
}



div#page-w-h :nth-child(1) {
    padding-right: 2px !important;
}

div#page-w-h :nth-child(2) {
    padding-left: 2px !important;
}</style>