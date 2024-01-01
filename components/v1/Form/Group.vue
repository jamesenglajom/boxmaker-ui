<template>
    <div v-if="fields.length != 0" style="flex:1;">
        <!-- <div>{{ form }}</div> -->
        <!-- <div :class="prop.category.toLowerCase() == 'dimension' ? 'ui equal width centered grid' : ''"> -->
        <div class="ui equal width grid" style="padding:0px;margin:0px;">
            <template v-for="(d1, i1) in Math.ceil(fields.length / row_field_limit)">
                <div :class="generateGridClass(fields.length, i1)" style="padding:3px 0px;">
                    <template v-for="(d2, i2) in row_field_limit">
                        <!-- <template v-if="fields.length > c_index(i1, i2)"> -->
                        <!-- <div :class="prop.category.toLowerCase() == 'dimension' ? 'column' : ''"> -->
                        <div class="column" style="box-sizing:border-box;padding:0px;margin:0px;">
                            <template v-if="(c_index(i1, i2)) < fields.length">
                                <div style="display:flex;width:100%;justify-content: space-between;">
                                    <template v-if="fields[c_index(i1, i2)].type != 'select'">
                                        <div style="text-align:right;align-self:center;width:50%;">
                                            <template v-if="fields[c_index(i1, i2)].tooltip">
                                                <i class="question circle icon link"
                                                    v-tooltip="fields[c_index(i1, i2)].tooltip"></i>
                                            </template>
                                            {{ `${fields[c_index(i1,
                                                i2)].name}` }}
                                        </div>
                                        <div class="ui right labeled input" :class="fields[c_index(i1, i2)].symbol == 'MARK' ?
                                            form['REGISTRATION'] == 'none' ? 'disabled' : ''
                                            :
                                            ''" style="width:40%">
                                            <input @input="onChange" :min="fields[c_index(i1, i2)].minval"
                                                :max="fields[c_index(i1, i2)].maxval" type="number"
                                                v-model="form[fields[c_index(i1, i2)].symbol]"
                                                :placeholder="fields[c_index(i1, i2)].name" style="width:calc(100% - 80px)">
                                            <div class="ui basic label" style="box-sizing:border-box;">
                                                {{ display_unit(fields[c_index(i1, i2)]) }}
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div style="display:block;width:100%;">
                                            <div style="width:100%;">
                                                <template v-if="fields[c_index(i1, i2)].tooltip">
                                                    <i class="question circle icon link"
                                                        v-tooltip="fields[c_index(i1, i2)].tooltip"></i>
                                                </template>
                                                {{ `${fields[c_index(i1,
                                                    i2)].name}` }}
                                            </div>
                                            <div style="width:100%;">
                                                <select id="reg-mark" class="ui dropdown selection" @change="onChange"
                                                    v-model="form[fields[c_index(i1, i2)].symbol]">
                                                    <template
                                                        v-for=" datum  in  Object.entries(fields[c_index(i1, i2)].options)"
                                                        :key="datum[1]">
                                                        <option :value="datum[0]">{{ datum[1] }}</option>
                                                    </template>
                                                </select>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </template>
                        </div>
                    </template>
                    <!-- </template> -->
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref, onMounted, watch } from 'vue';
import { useBoxMakerStore } from '@/stores/boxmaker';
const boxmaker = useBoxMakerStore();
const { getBoxForm: box, getBoxFormValue: formVal } = storeToRefs(boxmaker);
// props
const prop = defineProps(['category', 'unit', 'convert']);
// emits
const emit = defineEmits(['formValues']);
// data
const row_field_limit = ref(1);
const form = ref([]);
const convert_flag = ref(false);


const fields = computed(() => boxmaker.getBoxForm(prop.category));

// watch
watch(() => boxmaker.box_id, (v) => {
    if (v) {
        form.value = boxmaker.getBoxFormValue(prop.category);
    }
});
watch(() => prop.unit, (v, o) => {
    if (convert_flag.value) {
        Object.assign(form.value, convert(o, v, form.value))
        emit('formValues', form)
        convert_flag.value = false;
    }
});
watch(() => prop.convert, (v, o) => {
    convert_flag.value = true;
});
// functions
function convert(from, to, data) {
    // specify to-convert properties
    let units = {
        mm: { name: "mm", mm: 1, cm: .1, inch: 0.0393700787 },
        cm: { name: "cm", mm: 10, cm: 1, inch: 0.3937007874 },
        inch: { name: "inch", mm: 25.4, cm: 2.54, inch: 1 }
    }
    let temp = data,
        prop = computed(() => boxmaker.getBoxForm());
    Object.keys(data).forEach((v) => {
        if (['PAGEWIDTH', 'PAGEHEIGHT'].includes(v) == false) {
            let tmp = prop.value.filter(i => i.symbol == v);
            if (tmp.length != 0 && tmp[0].type == 'measure') {
                temp[v] = parseFloat((temp[v] * units[from][to]).toFixed(2));
            }
        }
    });
    return temp;
}
function display_unit(property) {
    let displays = { measure: prop.unit, percantage: "%", number: "n", angle: "  °  " };
    return displays[property.type];
};
function c_index(i1, i2) {
    return i1 * row_field_limit.value + i2;
};
function onChange() {
    emit('formValues', form)
}
function generateGridClass(length, index) {
    let gclass = 'equal width row'
    // if (length % row_field_limit.value != 0) {
    //     if (Math.ceil(length / row_field_limit.value) - 1 == index) {
    //         gclass = 'ui two column centered grid'
    //     }
    // }
    return gclass;
}
</script>


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
}

#sample-info>div {
    align-self: center;
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

#reg-mark.ui.selection.dropdown {
    width: calc(100% - 1px) !important;
    min-width:calc(100% - 1px) !important;
    max-width:calc(100% - 1px) !important;
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