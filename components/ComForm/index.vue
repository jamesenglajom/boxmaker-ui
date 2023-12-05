<template>
    <div id="CommonFormComponent" style="display:flex;">
        <!-- image and preview display -->
        <div class="preview-display"
            style="border-right:1px solid lightgray;width:35%;position:fixed;background-color:white;">
            <div style="display:flex">
                <template v-for="datum in box_preview_options" :key="datum">
                    <div 
                        class="box-preview-button"
                    @click="box_preview = datum"
                        :style="( box_preview == datum ? 'background-color:rgb(18,121,198) !important;color:white' : '')">
                        {{ datum }}</div>
                </template>
            </div>
            <div style="height:calc(100vh - 113px);position:relative">
                <div v-show="box_preview == 'Sample'">
                    <img src="https://templatemaker-dev.signcut.com/?MODEL=arced&CUSTOMER=whisqu&REQUEST=EXPLANATION"
                        width="500px" height="500px" />
                </div>
                <div v-show="box_preview == 'Box outline'">
                    <img src="https://templatemaker-dev.signcut.com?REGISTRATION=model&REQUEST=DIELINESPREVIEW&MODEL=arced&CUSTOMER=whisqu" alt="" width="500px" height="500px"/>
                </div>
                
                <div class="box-description ui text" style="position:absolute;bottom:0; background-color:lightgray;padding:10px 20px;width:100%;border-top:1px solid darkgray" >
                    {{ boxData ? boxData.description:'' }}
                </div>
            </div>
        </div>
        <!-- Form -->
        <div class="form-display" style="width:65%; margin-left:35%;padding:35px 50px;">
            <div class="ui form">
                <div class="header" style="margin-bottom:20px;">
                    <h5 class="ui header text darkgray"><b>DIMENSIONS</b></h5>
                </div>
                <div class="content">
                    <div class="custom-form-card">
                        <div class="field">
                            <label for="unit">
                                <small>UNIT</small>
                            </label>
                            <div class="ui buttons blue fluid">
                                <template v-for="datum in units" :key="datum.name">
                                    <button class="ui button" :class="selected_unit == datum.name ? 'active' : ''"
                                        @click="selected_unit = datum.name">{{ datum.name }}</button>
                                </template>
                            </div>
                        </div>
                        <div class="three fields">
                            <div class="field">
                                <label for="length">
                                    <small>Length</small>
                                </label>
                                <div class="ui right labeled input">
                                    <input step="1" type="number" min="0" v-model="form.length" />
                                    <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                                </div>
                            </div>
                            <div class="field">
                                <label for="width">
                                    <small>Width</small>
                                </label>
                                <div class="ui right labeled input">
                                    <input step="1" type="number" min="0" v-model="form.width" />
                                    <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                                </div>
                            </div>
                            <div class="field">
                                <label for="height">
                                    <small>Height</small>
                                </label>
                                <div class="ui right labeled input">
                                    <input step="1" type="number" min="0" v-model="form.height" />
                                    <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ui horizontal divider">
                        <small>Other Specifications</small>
                    </div>
                    <div class="custom-form-card">
                        <div class="field">
                            <label for="material_thickness">
                                <small>Material thickness</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="segments_per_arc">
                                <small>Segments per arc</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">Seg</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="slot_width">
                                <small>Slot width</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="closing_flap_size">
                                <small>Closing flap size</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="glue_flap_angle">
                                <small>Glue flap angle</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">°</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="glue_flap_size">
                                <small>Glue flap size</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="crash_lock_corner_radius">
                                <small>Crash lock corner radius</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="crash_lock_flap_size">
                                <small>Crash lock flap size</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- pro -->


                <div class="header" style="margin:20px 0px;">
                    <h5 class="ui header text darkgray"><b>PAGE SETTINGS</b></h5>
                </div>
                <div class="content">
                    <div class="custom-form-card">
                        <div class="field">
                            <label for="unit">
                                <small>Page size</small>
                            </label>
                            <!--select option insert here -->
                            <select class="ui selection dropdown">
                                <template v-for="datum in paper_sizes" :key="datum.name">
                                    <option :value="datum.id">{{ datum.name }}</option>
                                </template>
                            </select>
                        </div>
                        <div class="two fields">
                            <div class="field">
                                <label for="width">
                                    <small>Page width</small>
                                    <div class="left pointing basic ui label red">Custom</div>
                                </label>
                                <div class="ui right labeled input">
                                    <input step="1" type="number" min="0" v-model="form.width" />
                                    <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                                </div>
                            </div>
                            <div class="field">
                                <label for="height">
                                    <small>Page height</small>
                                    <div class="left pointing basic ui label red">Custom</div>
                                </label>
                                <div class="ui right labeled input">
                                    <input step="1" type="number" min="0" v-model="form.height" />
                                    <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="custom-form-card" style="margin-top:10px">
                        <div style="display:flex;justify-content:space-between">
                            <div class="field" style="align-self:center;width:100%;">
                                <div class="ui checkbox">
                                    <input type="checkbox" name="example">
                                    <label><small>Registration marks</small></label>
                                </div>

                                <select class="ui selection dropdown">
                                    <template v-for="datum in form.registration_marks" :key="datum.description">
                                        <option :value="datum.id">{{ datum.description }}</option>
                                    </template>
                                </select>
                            </div>
                        </div>
                        <div class="field">
                            <label for="segments_per_arc">
                                <small>Segments per arc</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">Seg</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="slot_width">
                                <small>Slot width</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="closing_flap_size">
                                <small>Closing flap size</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="glue_flap_angle">
                                <small>Glue flap angle</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">°</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="glue_flap_size">
                                <small>Glue flap size</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="crash_lock_corner_radius">
                                <small>Crash lock corner radius</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="crash_lock_flap_size">
                                <small>Crash lock flap size</small>
                            </label>
                            <div class="ui right labeled input">
                                <input step=".1" type="text" min="0" />
                                <div class="ui basic label blue input-unit">{{ selected_unit }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "CommonForm",
    props:["boxData"],
    data() {
        return {
            box_preview: "Sample",
            box_preview_options: ["Box outline", "Sample"],
            selected_unit: "mm",
            units: [
                { name: "mm", size_in_mm: 0 },
                { name: "cm", size_in_mm: 0 },
                { name: "inch", size_in_mm: 0 },
            ],
            form: {
                length: 0,
                width: 0,
                height: 0,
                registration_marks: [
                    // {id:1,description:"No registrations marks"},
                    { id: 2, description: "In the corners of the page" },
                    { id: 3, description: "Around each model" },
                ]
            },
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
        convertTo(n, u) {
            let result = 0;
            switch (u) {
                case 'mm':
                    result = n * 25.4;
                    break;
                case 'cm':
                    result = n * 2.54;
                    break;
                // case 'cm':
                //         result = n * 2.54;
                //     break;
            }
            return result;
        },
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
.box-preview-button{
    border:solid 1px lightgray;width:50%;cursor:pointer;background-color:white;padding:10px 2px;text-align:center;
}
.box-preview-button:hover{
    background-color:lightgray;
}
</style>