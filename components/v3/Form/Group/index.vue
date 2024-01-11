<template>
    <div v-if="fields.length != 0" style="flex:1;" class="v3-1">
        <div class="ui equal width grid" style="padding:0px;margin:0px;">
            <template v-for="(d1, i1) in Math.ceil(fields.length / row_field_limit)">
                <div :class="generateGridClass(fields.length, i1)">
                    <template v-for="(d2, i2) in row_field_limit">
                        <div class="column" style="box-sizing:border-box;padding:0px;margin:0px;">
                            <template v-if="(c_index(i1, i2)) < fields.length">
                                <div style="display:flex;width:100%;justify-content: space-between;padding:2px 0px;">
                                    <template v-if="fields[c_index(i1, i2)].type != 'select'">
                                        <div class="field-label">
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
                                            ''">
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
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue';
import { useBoxMakerStore } from '@/stores/boxmaker';
const bm = useBoxMakerStore();
// props
const prop = defineProps(['category', 'form_values']);
// emits
const emit = defineEmits(['formValues']);
// data
const row_field_limit = ref(1);
const form = ref([]);
const unit = ref("mm");
const fields = computed(() => bm.getBoxForm(prop.category));
watch(() => bm.die_line_image, () => {
    form.value = prop.form_values;
    unit.value = prop.form_values.UNITS;
});
// functions
function display_unit(property) {
    let displays = { measure: unit.value, percantage: "%", number: "n", angle: "  °  " };
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
    return gclass;
}
</script>


<style lang="scss">
.v3-1 {
    .ui.right.labeled.input {
        border-radius: 0px !important;
        padding: 0px;
        width: 35%;
        border: 1px solid #9b9b9b;

        input {
            padding: 0px;
        }

        div.ui.basic.label {
            border-radius: 0px !important;
            padding: 4px;
            margin: 0px;
            width:50px;
            text-align:center;
            background:#ccc;
        }
    }


    input::placeholder {
        color: white !important;
    }

    .equal.width.row,
    .equal.width.row>div.column {
        padding: 0px !important;
        margin: 0px !important;

    }

    .field-label {
        text-align: left;
        align-self: center;
        width: 65%;

    }
}

select.ui.dropdown.selection{
    padding:0px;
    width:100%;
    border-radius:0px;
    border: 1px solid #9b9b9b;
}
</style>