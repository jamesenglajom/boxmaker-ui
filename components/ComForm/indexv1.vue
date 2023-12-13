<template>
    <div id="CommonFormComponent" style="display:flex;">
        <!-- image and preview display -->
        <div class="preview-display"
            style="border-right:1px solid lightgray;width:50%;position:fixed;background-color:white;">
            <div style="display:flex"> 
                <template v-for="datum in box_preview_options" :key="datum">
                    <div class="box-preview-button" @click="box_preview = datum"
                        :style="(box_preview == datum ? 'background-color:rgb(18,121,198) !important;color:white' : '')">
                        {{ datum }}</div>
                </template>
            </div>
            <div style="height:calc(100vh - 113px);position:relative">
                <div v-show="box_preview == 'Sample'" style="width:100%;height:100vh;">
                    <img style="width:100%;height:calc(100vh - 110px);" :src="boxData ? `https://templatemaker.signcut.com/?MODEL=${boxData.id}&CUSTOMER=whisqu&REQUEST=EXPLANATION` : ''"
                         />
                </div>
                <div v-show="box_preview == 'Box outline'" style="height:100vh">
                    <img style="width:100%;height:calc(100vh - 110px);" :src="boxData ? box_outline_preview : ''" alt=""/>
                </div>

                <div class="box-description ui text" style="position:absolute;bottom:0;padding:10px 20px;">
                    <div style="position:relative">
                        <div class="ui icon button circular grey" @click="info_toggle = !info_toggle">
                            <i class="question icon"></i>
                        </div>
                    </div>
                    <div class="ui custom popup top left inverted" :class="info_toggle ? 'transition visible' : 'invisible'"
                        style="inset: auto auto 60px 20px; display: block !important; width:400px !important;">
                        {{ boxData ? boxData.description : '' }}
                    </div>
                </div>
            </div>
        </div>
        <!-- Form -->
        <div class="form-display" style="width:50%; margin-left:50%;padding:20px;">
            <div class="ui form">
                <div class="header" style="margin-bottom:10px;">
                    <h5 class="ui header text darkgray"><b>DIMENSIONS</b></h5>
                </div>
                <div class="content">
                    <div class="custom-form-card">
                        <div class="field">
                            <label for="unit">
                                <small>UNIT</small>
                            </label>
                            <div class="ui buttons blue fluid">
                                <template v-for=" datum  in  units " :key="datum.name">
                                    <button class="ui button" :class="selected_unit == datum.name ? 'active' : ''"
                                        @click="selected_unit = datum.name">{{ datum.name }}</button>
                                </template>
                            </div>
                        </div>
                        <template v-if="boxData">
                            <template v-for=" datum  in  form_elements.parameters ">
                                <div class="field">
                                    <label :for="slug(datum.name)">
                                        <small>{{ datum.name }}</small>
                                    </label>
                                    <div class="ui right labeled input">
                                        <input @change="generatePreviewImage(datum.symbol)" :id="slug(datum.name)" step="1"
                                            type="number" :min="datum.minval" :max="datum.maxval"
                                            v-model="form[`${datum.symbol}`]" />
                                        <div class="ui basic label blue input-unit">{{ datum.type == "measure" ?
                                            selected_unit : (datum.type == 'number' ? '' : '°') }}</div>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                    <div class="ui horizontal divider">
                        <small>Other Specifications</small>
                    </div>
                    <div class="custom-form-card">
                        <template v-if="boxData">
                            <template v-for=" datum  in  form_elements.options ">
                                <div class="field">
                                    <label :for="slug(datum.name)">
                                        <small>{{ datum.name }}</small>
                                    </label>
                                    <div class="ui right labeled input">
                                        <input @change="generatePreviewImage(datum.symbol)" :id="slug(datum.name)"
                                            type="number" :min="datum.minval" :max="datum.maxval"
                                            v-model="form[`${datum.symbol}`]" />
                                        <div class="ui basic label blue input-unit">{{ datum.type == "measure" ?
                                            selected_unit : (datum.type == 'number' ? '' : '°') }}</div>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>


                <!-- pro -->

                <!-- page settings -->
                <div class="header" style="margin:30px 0px 10px 0px ;">
                    <h5 class="ui header text darkgray"><b>PAGE SETTINGS</b></h5>
                </div>
                <div class="content">
                    <div class="custom-form-card">
                        <div class="ui field">
                            <label for="unit">
                                <small>Page size</small>
                            </label>
                            <!--select option insert here -->
                            <select @change="generatePreviewImage('PAGEPRESET')" class="ui dropdown selection"
                                v-model="selected_page_size">
                                <template v-for=" datum  in  paper_sizes " :key="datum.name">
                                    <option :value="datum.id">{{ datum.name }}</option>
                                </template>
                            </select>
                        </div>
                        <div class="two fields">
                            <div class="field">
                                <label for="pagewidth">
                                    <small>Page width</small>
                                    <div class="left pointing basic ui label red"
                                        :class="selected_page_size == 'Custom' ? '' : 'invisible'">Custom</div>
                                </label>
                                <div class="ui right labeled input"
                                    :class="selected_page_size != 'Custom' ? 'disabled' : ''">
                                    <input @change="generatePreviewImage('PAGEWIDTH')" step="1" type="number" min="0"
                                        v-model="form['PAGEWIDTH']" />
                                    <div class="ui basic label blue input-unit">{{ "in" }}</div>
                                </div>
                            </div>
                            <div class="field">
                                <label for="pageheight">
                                    <small>Page height</small>
                                    <div class="left pointing basic ui label red"
                                        :class="selected_page_size == 'Custom' ? '' : 'invisible'">Custom</div>
                                </label>
                                <div class="ui right labeled input"
                                    :class="selected_page_size != 'Custom' ? 'disabled' : ''">
                                    <input @change="generatePreviewImage('PAGEHEIGHT')" step="1" type="number" min="0"
                                        v-model="form['PAGEHEIGHT']" />
                                    <div class="ui basic label blue input-unit">{{ "in" }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- registration mark -->

                <div class="header" style="margin:30px 0px 10px 0px ;display:flex;">
                    <div class="ui checkbox">
                        <input @change="generatePreviewImage('REGISTRATION')" type="checkbox" v-model="reg_mark_chkbox">
                        <label for="">
                            <h5 class="ui header text darkgray"><b>REGISTRATION MARKS</b></h5>
                        </label>
                    </div>
                </div>
                <div class="content">
                    <div class="custom-form-card">
                        <div class="field">
                            <label for="registration_mark_diameter">
                                <small>Diameter</small>
                            </label>
                            <div class="ui right labeled input" :class="reg_mark_chkbox == false ? 'disabled' : ''">
                                <input @change="generatePreviewImage('MARK')" type="number" min="0" max="1000"
                                    v-model="form['MARK']" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="grouped fields">
                                <div class="two fields">
                                    <template v-for=" datum  in  registration_marks " :key="datum.id">
                                        <div class="field">
                                            <div class="ui radio checkbox"
                                                :class="reg_mark_chkbox == false ? 'disabled' : ''">
                                                <input @change="generatePreviewImage(datum.symbol)" type="radio"
                                                    name="regmark" :value="datum.id" v-model="selected_reg_mark">
                                                <label>{{ datum.description }}</label>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="ui horizontal divider">
                    <small>Other Specifications</small>
                </div>

                <div class="custom-form-card" style="margin-top:10px">
                    <template v-for=" datum  in  pro_setting_form ">
                        <div class="field">
                            <label for="segments_per_arc">
                                <small>{{ datum.name }}</small>
                            </label>
                            <div class="ui right labeled input">
                                <input @change="generatePreviewImage(datum.symbol)" type="text" :min="minval" :max="maxval"
                                    v-model="form[`${datum.symbol}`]" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>node 
    </div>
</template>
<script>
export default {
    name: "CommonForm",
    props: ["boxData"],
    watch: {
        selected_unit(n, o) {
            // alert(o +"  :  "+ n)
            // let formElements =  this.boxData.parameters.
            this.convertFormValues(o, n);
        },
        selected_page_size(v) {
            if (v != "Auto") {
                let paper = this.paper_sizes.filter(i => i.id == v)[0];
                this.form["PAGEWIDTH"] = paper.width;
                this.form["PAGEHEIGHT"] = paper.height;
            }
        },
        reg_mark_chkbox(v) {
            if (v) {
                this.form["REGISTRATION"] = this.selected_reg_mark;
            } else {
                this.form["REGISTRATION"] = 'none';
            }
        },
        form(v) {
            // alert(v);
        },
        boxData(v) {
            // console.log("BOXDATA");
            // console.log(v);
            this.extractFormElements();
            this.generatePreviewImage();
        }
    },
    data() {
        return {
            form_elements: [], // segregated form
            form_elements_inline: [], // inline form
            box_preview: "Sample",
            box_preview_options: ["Box outline", "Sample"],
            selected_unit: "mm",
            reg_mark_chkbox: false,
            selected_reg_mark: "page",
            selected_page_size: "Auto",
            pro_setting_form: [],
            box_outline_preview: "",
            info_toggle: false,
            registration_marks: [
                // {id:1,description:"No registrations marks"},
                { id: "page", description: "In the corners of the page" },
                { id: "model", description: "Around each model" },
            ],
            units: [
                { name: "mm", mm: 1, cm: .1, inch: 0.0393700787 },
                { name: "cm", mm: 10, cm: 1, inch: 0.3937007874 },
                { name: "inch", mm: 25.4, cm: 2.54, inch: 1 },
            ],
            form: {},
            // paper sizes default unit is in inches
            paper_sizes: [
                { id: "Auto", name: "Fit page to drawing", width: 0, height: 0 },
                { id: "Custom", name: "Custom: You decide.", width: 0, height: 0 },
                { id: "A4", name: "A4 Portrait", width: 8.27, height: 11.69 },
                { id: "A4L", name: "A4 Landscape", width: 11.69, height: 8.27 },
                { id: "Letter", name: "US Letter Portrait", width: 8.5, height: 11 },
                { id: "LetterL", name: "US Letter Landscape", width: 11, height: 8.5 },
                { id: "A3", name: "A3 Portrait", width: 11.7, height: 16.5 },
                { id: "A3L", name: "A3 Landscape", width: 16.5, height: 11.7 },
                { id: "12x12", name: "12 x 12 inch", width: 12, height: 12 },
                { id: "12x24", name: "12 x 24 inch", width: 12, height: 24 },
                { id: "24x12", name: "24 x 12 inch", width: 24, height: 12 },
                { id: "A3PLUS", name: "A3 Plus (Portrait)", width: 12.95, height: 19.02 },
                { id: "A3PLUSL", name: "A3 Plus (Landscape)", width: 19.02, height: 12.95 },
                //"1020x710" => array("1020 x 710 mm",1020,710),
                //"710x1020" => array("710 x 2020 mm",2020,710),
                //"915x540" => array("915 x 540 mm",915,540),
                //"540x915" => array("540 x 915 mm",540,915)
                //"FLUTE" => array("Flute Board, 1200 x 2400 mm",1200,2400),
                //"FLUTEL" => array("Flute Board Landscape, 2400x1200 mm",2400,1200),
            ],
        }
    },
    methods: {
        generatePreviewImage(el) {
            // alert(el + " element has detected change"); // el variable for testing each element
            let temp = this.form, url = "", akeys = Object.keys(temp);
            akeys.forEach((v) => {
                switch (v) {
                    case "REGISTRATION":
                    case "MARK":
                        if (this.reg_mark_chkbox) {
                            url = url + `&${v}=${temp[v]}`;
                        }
                        break;
                    case "PAGEWIDTH":
                    case "PAGEHEIGHT":
                        if (this.selected_page_size != "Auto") {
                            url = url + `&${v}=${temp[v]}`;
                        }
                        break;
                    default:
                        if (temp[v] != 0) {
                            if (this.reg_mark_chkbox == false) { }
                            url = url + `&${v}=${temp[v]}`;
                        }
                        break;
                }
            });
            this.box_outline_preview = `https://templatemaker.signcut.com?REQUEST=DIELINESPREVIEW&MODEL=${this.boxData.id}&CUSTOMER=whisqu` + url;
        },
        slug(name) {
            return name.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, "").toLowerCase();
        },
        extractFormElements() {
            let tmp = this.boxData, parameter_class = Object.keys(this.boxData.parameters), form_elements = [], form_elements_inline = [];
            parameter_class.forEach(((v) => {
                let temp = [...Object.values(tmp["parameters"][v])];
                if (v == "professional") {
                    temp = [...(Object.values(tmp["parameters"][v])).filter(i => ["REGISTRATION", "MARK", "BLEED", "OVERCUT", "DASH", "GAP", "FILMIN"].includes(i.symbol))]
                    this.pro_setting_form = [...(Object.values(tmp["parameters"][v])).filter(i => ["BLEED", "OVERCUT", "DASH", "GAP", "FILMIN"].includes(i.symbol))]
                } else if (v == "standard") {
                    temp = [...(Object.values(tmp["parameters"][v])).filter(i => ["PAGEPRESET", "PAGEHEIGHT", "PAGEWIDTH"].includes(i.symbol))]
                }
                form_elements[v] = [...form_elements, ...temp];
                form_elements_inline = [...form_elements_inline, ...temp];

            }));
            this.form_elements = form_elements;
            this.form_elements_inline = form_elements_inline;
            this.initializeFormData();
        },
        initializeFormData() {
            Object.keys(this.form_elements).forEach(((v) => {
                this.form_elements[v].forEach(((v1) => {
                    this.form[v1.symbol] = v1.value;
                }));
            }))
            
            // console.log(this.form);
        },
        resetFormValues() {
            this.initializeFormData();
        },
        convertFormValues(from, to) {
            let tmp = this.form, operation = this.units.filter(i => i.name == from)[0];
            Object.entries(tmp).filter(i=> !["PAGEWIDTH","PAGEHEIGHT"].includes(i[0])).forEach(((v) => {
                let el = this.form_elements_inline.filter(i => i.symbol == v[0])[0];
                    if (el["type"] == "measure") {
                        this.form[v[0]] = (to == "mm" ? Math.round((v[1] * operation[to])): Math.round((v[1] * operation[to])*100) / 100);
                    }
            }));
        }
    }
}
</script>
<style>
.custom-form-card {
    padding: 20px 40px;
    background-color: white;
    box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
}

.input-unit {
    /* width: 75px; */
    text-align: center;
}

.box-preview-button {
    border: solid 1px lightgray;
    width: 50%;
    cursor: pointer;
    background-color: white;
    padding: 10px 2px;
    text-align: center;
}

.box-preview-button:hover {
    background-color: lightgray;
}
</style>