
import type { MultiSelect } from '#ui-colors/components';

import type { select } from '@nuxt/ui/dist/runtime/ui.config';

import type { _left } from '#tailwind-config/theme/backgroundPosition';

import type { _ringOffsetWidth } from '#tailwind-config/theme';

import type { _inherit } from '#tailwind-config/theme/accentColor';

import type { _green } from '#tailwind-config/theme/typography';

import type { resolveDirective } from 'vue';

import type { resolveDirective } from 'vue';

<template>
    <div id="MultiSelec" ref="mainWrap">
        <div class="wrap">
            <!-- placeholder -->
            <!-- <div>{{ placeholder }}</div> -->
            <!-- selected options -->
            <!-- :class="selected_items.length > 0? 'invisible':''" -->
            <div class="ui icon input">
                <input :class="count % 2 == 0 ? '' : 'focused'" type="button" ref="multiSelect" @click="clickED"
                    :style="`caret-color:transparent;cursor:pointer;width:${input_el_width}px !important;height:${input_el_height}px !important;`" :value="selected_items.length == 0 ? 'Please select...' : ''" />                    <!-- icons -->
                <div style="position:absolute;right:8px;top:9px;color:darkgray;pointer-events:none;">
                    <span :style="selected_items.length==0?'display:none':'display:auto'">
                        <i class="close icon" @click="clearSelection" style="pointer-events:auto"></i>
                    </span>
                    <span>
                        <i class="filter icon"></i>
                    </span>
                </div>
                <!-- selected tray -->
                <div style="position:absolute;top:4px;left:3px;pointer-events: none;">
                    <div style="display:flex;"
                        :style="FwrapOn ? 'flex-wrap:wrap;width:' + max_wrap_width + 'px !important;min-width:' + max_wrap_width + 'px !important;' : 'flex-wrap:nowrap;' + (selected_items.length == 0 ? 'width:0px;' : '')"
                        ref="selectTray">
                        <template v-for="datum in selected_items" :key="datum">
                            <div :ref="`dynamicEl${datum}`"
                                style="pointer-events:auto;white-space:nowrap;display:inline-block;width:auto;position:relative;margin:2px;height:26px;padding:1px 30px 1px 7px;background:lightgray;border:1px solid darkgray;border-radius:3px;">
                                <p><b><small>{{ options.filter(i => i.id == datum)[0].name }}
                                        </small></b></p><i class="close icon" @click="unselect(datum)"
                                    style="cursor:pointer;position:absolute;right:4px;top:6px;"></i>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div :class="count % 2 == 0 ? 'invisible' : 'visible'" class="option-tray"
                :style="`width:${option_tray_width}px;top:${option_tray_top}px !important;`">
                <template v-for="datum in options.filter(i => !selected_items.includes(i.id))" :key="datum.name">
                    <div class="options" :data-value="datum.id" @click="optionClicked(datum.id)">{{ datum.name }}</div>
                </template>
                <div class="options disabled" :style="`${selected_items.length != options.length ? 'display:none' : ''}`">
                    <i>No items left...</i></div>
            </div>
        </div>

        <!-- <div class="ui">
            <select class="dropdown selection ui" placeholder="Please Select...">
                <option value="">Please select...</option>
            </select>
        </div> -->
    </div>
</template>

<script>
export default {
    name: "MultiSelect",
    props: {placeholder:String,options:Array},
    data() {
        return {
            // options: [
            //     { id: 1, name: "Remember Me" },
            //     { id: 2, name: "Joni" },
            //     { id: 3, name: "Don't let me down" },
            //     { id: 4, name: "Dont't cry" },
            //     { id: 5, name: "Joni" },
            //     { id: 6, name: "Joni" },
            // ],
            // dynamicElement:[]
            FwrapOn: false,
            show_options: false,
            option_tray_width: 220,
            input_el_width: 220,
            input_el_height: 38,
            option_tray_top: 35,
            max_wrap_width: 220,
            count: 0,
            selected_items: []
        }
    },
    mounted() {
        // consloe(this.options);   
        this.$nextTick(() => {
            this.option_tray_width = 220;
            this.input_el_width = 220;
            this.input_el_height = 38;
            this.option_tray_top = 35;
            this.max_wrap_width = 220;
        });
    },
    methods: {
        clearSelection(){
            this.selected_items = [];
            this.$emit("selected_items",this.selected_items);
            this.adjustELWidth(false,'')
        },
        clickED() {
            this.option_tray_width = this.$refs.multiSelect.offsetWidth;
            this.count++;
        },
        optionClicked(value) {
            // check if value exist
            this.selected_items = [...this.selected_items, value];
            this.$emit("selected_items",this.selected_items);
            this.adjustELWidth(true, value);
        },
        unselect(v) {
            this.selected_items = this.selected_items.filter(i => i != v);
            this.$emit("selected_items",this.selected_items);
            this.adjustELWidth(false, v);
        },
        adjustELWidth(increase, val) {
            let w = this.$refs.selectTray.offsetWidth,
                mw = this.$refs.mainWrap.offsetWidth;
            this.$nextTick(() => {
                // width
                let tmp = increase ? this.$refs[`dynamicEl${val}`][0].offsetWidth : 0;
                let h = this.$refs.selectTray.offsetHeight,
                    DW_DElW = w + tmp, max_stretch = w;
                let check = `DW_DElW = ${DW_DElW}, mw = ${mw}, w = ${w};  DW_DElW > mw : ${DW_DElW > mw}`;
                let select_tray_max_stretch = mw - 60, element_stretch = DW_DElW + 64;
                if (DW_DElW > mw - 60) {
                    this.max_wrap_width = select_tray_max_stretch;
                    this.option_tray_width = mw;
                    this.input_el_width = mw;
                    this.input_el_height = this.FwrapOn ? h + 8 : h + 38;
                    this.option_tray_top = this.input_el_height - 2;
                    this.FwrapOn = true;
                    // height
                } else {
                    if (increase) {
                        this.option_tray_width = (DW_DElW + 4) < 220 - 60 ? 220 : (element_stretch);
                        this.input_el_width = (DW_DElW + 4) < 220 - 60 ? 220 : (element_stretch);
                        // console.log(`input_el = ${this.input_el_width}, option_tray = ${this.option_tray_width}, element_stretch = ${element_stretch}`)
                    } else {
                        if (this.selected_items.length == 0) {
                            this.FwrapOn = false;
                            this.option_tray_width = 220;
                            this.input_el_width = 220;
                            this.input_el_height = 38;
                            this.option_tray_top = 35;
                            this.max_wrap_width = 220;
                        }else{
                            this.input_el_height = this.selected_items.length == 0 ? 38 : h + 8;
                            this.option_tray_top = this.input_el_height - 2;
                        }
                    }
                }
            })
        }
    }
}
</script>

<style>
#MultiSelec {
    /* margin-left: 100px; */
    max-width: 100%;
}
span > i.icon{
    pointer-events: none;
}

.wrap {
    position: relative;
    max-width: inherit;
}

.wrap>input {
    cursor: pointer;
    max-width: inherit;
}

input.focused {
    border: .7px solid rgba(59 130 246 / 0.5) !important;
}

.option-tray {
    position: absolute;
    left: 0px;
    width: 100%;
    min-height: 25px;
    max-height: 200px;
    background-color: white;
    border-radius: 0px 0px 4px 4px;
    z-index: 99;
    border: .7px solid rgba(59 130 246 / 0.5);
    overflow: auto;
}

.options {
    padding: 10px 15px;
    color: rgb(69, 69, 69);
}

.options:hover {
    background-color: lightgray;
}

i.icon.close{
    cursor:pointer;
}
i.icon.caret{
    color:rgb(73, 73, 73)
}
i.icon:hover{
    color:rgb(73, 73, 73);
}
</style>