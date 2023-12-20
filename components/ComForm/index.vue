
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
        <div id="image-preview-container">
            <div id="sample-info" ref="sampleDiv">
                <img style="max-height:500px;width:100%;" :src="structure.sample_image" alt=""
                    :style="`height:${sampleDivHeight - infoDivHeight}px`">
                <div id="box-info-display" ref="infoDiv">
                    {{ structure.description }}
                </div>
            </div>
            <div id="box-fold-preview">
                <div id="page-select-container">
                    <label for=""><small>PAGE PRESET</small></label>
                    <select class="ui dropdown selection" style="width:100%;" v-model="form['PAGEPRESET']">
                        <template v-for=" datum  in  structure.pagepresets_options" :key="datum.name">
                            <option :value="datum.value">{{ datum.name }}</option>
                        </template>
                    </select>
                    <div style="display:flex">
                        <div class="field" style="color:white;padding-right:2px">
                            <div class="label"><small>WIDTH</small></div>
                            <div class="ui right labeled input">
                                <input type="number" placeholder="Page Width" v-model="form['PAGEWIDTH']"
                                    style="width:calc(100% - 80px)" />
                                <div class="ui basic label">
                                    {{ 'in' }}
                                </div>
                            </div>
                        </div>
                        <div class="field" style="color:white;padding-left:2px;">
                            <div class="label"><small>HEIGHT</small></div>
                            <div class="ui right labeled input">
                                <input type="number" placeholder="Page Height" v-model="form['PAGEHEIGHT']"
                                    style="width:calc(100% - 80px)" />
                                <div class="ui basic label">
                                    {{ 'in' }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <img style="max-height:calc(500px - 130px);width:100%;" :src="boxLayout" alt="">
                </div>
            </div>
        </div>
        <div id="form-container">
            <!-- part1 -->
            <div id="unit-select-container">
                <div class="ui buttons">
                    <template v-for="datum in structure.units_options">
                        <button class="ui button red" v-tooltip="datum.name"
                            :class="form['UNITS'] == datum.value ? 'active' : ''" @click="convertTo(datum.value)">{{
                                datum.abbr }}</button>
                    </template>
                </div>
            </div>

            <!-- part2 -->

            <div style="padding:20px;">
                <div class="ui segment" style="">
                    <!-- FORM LABEL -->
                    <div style="margin-bottom:20px;">
                        <h3>DIMENSION</h3>
                    </div>
                    <!-- FORM -->
                    <div class="" style="margin-bottom:20px;width:100%;display:flex;box-sizing:border-box">
                        <template v-for="(datum, index) in structure.parameters_field">
                            <div :style="`width:calc(${100 / structure.parameters_field.length}%);box-sizing:border-box;`">
                                <div style="width:100%;padding:2px;box-sizing:border-box;">
                                    <div style="width:calc(100%);box-sizing:border-box;">
                                        <div
                                            style="text-overflow: ellipsis;width:calc(100% - 1px);white-space:nowrap;overflow:hidden">

                                            <template v-if="datum.tooltip">
                                                <i class="question circle icon link" v-tooltip="datum.tooltip"></i>
                                            </template>
                                            <small>
                                                {{ datum.name.toUpperCase() }}
                                            </small>
                                        </div>
                                        <div class="ui right labeled input" style="width:100%;">
                                            <input :min="datum.minval" :max="datum.maxval" type="number"
                                                v-model="form[datum.symbol]" :placeholder="datum.name"
                                                style="width:calc(100% - 80px)">
                                            <div class="ui basic label" style="box-sizing:border-box;">
                                                {{ display_unit(datum) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>


            <!-- SUBMIT BUTTON -->
            <div style="width:100%;box-sizing: border-box;padding:5px;text-align:center;margin-bottom: 20px;">
                <div class="ui button red">
                    <button class="" @click="submitForm">Submit</button>
                </div>
            </div>



            <!-- part3 -->
            <div style="padding:0px 20px;display:flex;margin-bottom:20px;">
                <!-- others form -->
                <div style="width:50%;padding-right:10px;"
                    v-if="structure.options_field ? structure.options_field.length != 0 : null">
                    <div class="ui segment">
                        <div style="margin-bottom:20px;">
                            <h3>OTHER SPECIFICATIONS</h3>
                        </div>
                        <div>
                            <template v-for="(datum, index) in structure.options_field">
                                <div :style="`box-sizing:border-box;`">
                                    <div style="width:100%;padding:2px;box-sizing:border-box;">
                                        <div style="width:calc(100%);box-sizing:border-box;">
                                            <div
                                                style="text-overflow: ellipsis;width:calc(100% - 1px);white-space:nowrap;overflow:hidden">

                                                <template v-if="datum.tooltip">
                                                    <i class="question circle icon link" v-tooltip="datum.tooltip"></i>
                                                </template>
                                                <small>
                                                    {{ datum.name.toUpperCase() }}
                                                </small>
                                            </div>
                                            <div class="ui right labeled input" style="width:100%;">
                                                <input :min="datum.minval" :max="datum.maxval" type="number"
                                                    v-model="form[datum.symbol]" :placeholder="datum.name"
                                                    style="width:calc(100% - 80px)">
                                                <div class="ui basic label" style="box-sizing:border-box;">
                                                    {{ display_unit(datum) }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <!-- prof form -->
                <div style="width:50%;padding-left:10px;">
                    <div class="ui segment">
                        <div style="margin-bottom:20px;">
                            <h3>PROFESSIONAL</h3>
                        </div>
                        <div>
                            <template v-for="(datum, index) in structure.professional_field">
                                <div :style="`box-sizing:border-box;`">
                                    <div style="width:100%;padding:2px;box-sizing:border-box;">
                                        <template v-if="datum.symbol == 'REGISTRATION'">
                                            <div style="width:calc(100%);box-sizing:border-box;">
                                                <div
                                                    style="text-overflow: ellipsis;width:calc(100% - 1px);white-space:nowrap;overflow:hidden">
                                                    <small>
                                                        {{ datum.name.toUpperCase() }}
                                                    </small>
                                                </div>
                                                <select class="ui dropdown selection"
                                                    style="width:calc(100% - 1px) !important;min-width:calc(100% - 99px) !important;"
                                                    v-model="form['REGISTRATION']">
                                                    <template v-for=" datum  in  structure.regmarks_options"
                                                        :key="datum.name">
                                                        <option :value="datum.value">{{ datum.name }}</option>
                                                    </template>
                                                </select>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div style="width:calc(100%);box-sizing:border-box;">
                                                <div
                                                    style="position:relative;text-overflow: ellipsis;width:calc(100% - 1px);white-space:nowrap;overflow:hidden;z-index:1;">
                                                    <template v-if="datum.tooltip">
                                                        <i class="question circle icon link" v-tooltip="datum.tooltip"></i>
                                                    </template>
                                                    <small>
                                                        {{ datum.name.toUpperCase() }}
                                                    </small>
                                                </div>
                                                <div class="ui right labeled input" style="width:100%;"
                                                    :class="datum.symbol == 'MARK' ? form['REGISTRATION'] == 'none' ? 'disabled' : '' : ''">
                                                    <input :min="datum.minval" :max="datum.maxval" type="number"
                                                        v-model="form[datum.symbol]" :placeholder="datum.name"
                                                        style="width:calc(100% - 80px)">
                                                    <div class="ui basic label" style="box-sizing:border-box;">
                                                        {{ display_unit(datum) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>



            <!-- SUBMIT BUTTON -->
            <div style="width:100%;box-sizing: border-box;padding:5px;text-align:center;margin-bottom: 60px;">
                <div class="ui button red">
                    <button class="" @click="submitForm">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getBoxById, convert } from "@/composables/boxdata"
export default {
    name: "CommonForm",
    props: ["boxId"],
    watch: {
        boxId(v) {
            if (v) {
                let box_data = getBoxById(v);
                this.structure = box_data.form.structure;
                this.form = box_data.form.values;
                this.$nextTick(() => {
                    this.sampleDivHeight = this.$refs.sampleDiv.offsetHeight;
                    this.infoDivHeight = this.$refs.infoDiv.offsetHeight;
                    this.form = box_data.form.values;
                    this.form['MODEL'] = v;
                    this.boxLayoutPreview();
                });
            }
        }
    },
    methods: {
        convertTo(unit_id) {
            let new_unit = unit_id, old_unit = this.form["UNITS"];
            this.form["UNITS"] = new_unit;
            console.log('index.vue')
            console.log(this.form)
            convert(old_unit, new_unit, this.form);
        },
        display_unit(property) {
            let displays = { measure: this.form["UNITS"], percantage: "%", number: "n", angle: "  °  " };
            return displays[property.type];
        },
        boxLayoutPreview() {
            let q = '';
            this.structure.parameters_field.forEach((v) => {
                q = `${q}&${v.symbol}=${this.form[v.symbol]}`
            });
            this.boxLayout = this.structure.preview_image + q;
        },
        async submitForm() {
            let formData = this.form;
            formData['MODEL'] = this.boxId;
            formData['REQUEST'] = 'SIGNCUT';
            formData['CUSTOMER'] = 'whisqu';
            formData['KEY'] = "gAAAAABlcdnsuTKh5-MunYhaHHnQuYiqUGGNk3upJGjTifAR3OUwwZAnZz-4PGMm7um_bJobX1uR-N_f_HdQjqQn5hFz61fDKg%3D%3D";
            console.log(formData);
            // await $fetch('http://www.signcutpro.com/cgi-bin/templatemaker-dev.php', {
            //     method: "POST",
            //     headers: {
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(formData)
            // })

        }
    },
    data() {
        return {
            boxLayout: '',
            structure: {},
            form: {},
            sampleDivHeight: 0,
            infoDivHeight: 0,
        }
    }
}
</script>