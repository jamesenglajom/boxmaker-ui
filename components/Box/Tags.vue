<template>
    <div style="padding-top:50px;">
        <div class="ui grid" style="margin-bottom:40px;">
            <div class="one column" style="width:100%;">
                <div style="display:flex">
                    <div style="width:100%;position:relative">
                        <button class="ui labeled icon basic button" data-tooltip="Filter tags" data-inverted=""
                            @click="show_tag_selection = !show_tag_selection">
                            <i class="filter icon" sryle="background-white"></i>
                            <small><b>{{ available_tags.length }}</b> TAGS</small>
                        </button>


                        <!-- <template v-if="selected_tags.length == 0">
                            <button class="ui button basic">ALL</button>
                        </template> -->
                        <!-- <template v-else>
                            <button @click="clearTags" class="ui icon button">
                                <i class="undo icon"></i>
                            </button>
                        </template> -->
                        <!-- <div class="ui input">
                            <input type="number" placeholder="enter no. of column" v-model="tray_columns">
                        </div> -->



                        <div id="option-container" style="position:absolute;z-index:9000;background:white;width:100%;">
                            <!-- set max height here -->
                            <div class="option-wrapper" :class="show_tag_selection ? '' : 'hide'">
                                <div class="ui grid" style="margin:0px;box-sizing:border-box;">
                                    <template v-for="datum in available_tags">
                                        <div @click="handleSelect(datum.id)" class="four wide column"
                                            :class="selected_tags.includes(datum.id) ? 'active' : ''" style="color:gray">
                                            <i :class="selected_tags.includes(datum.id) ? 'visible' : 'invisible'"
                                                class="ui icon thumbtack"></i>{{ `${datum.name.charAt(0).toUpperCase() +
                                                    datum.name.slice(1)}` }} <small>({{ datum.no_of_boxes }})</small>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="selected-wrapper" :class="show_tag_selection == false ? 'show-height' : 'hide-height'">
                    <div class="selected-inner">
                        <template v-if="selected_tags.length == 0">
                            <div
                                style="background:#B31228;color:white;margin:1px;padding:3px 10px;border-radius:3px;border:solid .5px gray;width:auto;">
                                <small>
                                    <i class="ui icon thumbtack"></i>
                                    <b>All</b></small>
                            </div>
                        </template>
                        <template v-for="datum in available_tags.filter(i => !selected_tags.includes(i.id) == false)">
                            <div
                                style="background:#B31228;color:white;margin:1px;padding:3px 10px;border-radius:3px;border:solid .5px gray;width:auto;">
                                <small>
                                    <i class="ui icon thumbtack"></i>

                                    <b>{{ datum.name.toUpperCase() }}</b></small>
                            </div>
                        </template>
                        <template v-if="selected_tags.length != 0">
                            <div @click="clearTags"
                                style="cursor:pointer;background:#1F1F21;color:white;margin:1px;padding:3px 10px;border-radius:3px;border:solid .5px gray;width:auto;">
                                <small>
                                    <i class="undo icon"></i>
                                </small>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <!-- <div :style="show_tag_selection ? 'display:default' : 'display:none;'">
                <div class="ui equal width grid">
                    <template v-for="(datum, i1) in Math.ceil(available_tags.length / tray_columns)"
                        v-if="show_tag_selection">
                        <div class="ui equal width row" style="padding:0px;margin:0px;">
                            <template v-for="(datum, i2) in tray_columns">
                                <div class="column">


                                    <template v-if="(i1 * tray_columns + i2) < available_tags.length">
                                        <div class="" style="padding:2px;width:100%">

                                            <div :for="available_tags[(i1 * tray_columns + i2)].id"
                                                style="align-self:center;display:flex;background:#CCCCCC;padding:10px 10px 8px 10px;border-radius:3px;position:relative">

                                                <div style="align-self: center;">
                                                    <input type="checkbox" class="ui checkbox"
                                                        @change="handleSelect(available_tags[(i1 * tray_columns + i2)].id)"
                                                        :checked="selected_tags.filter(i => i == available_tags[(i1 * tray_columns + i2)].id).length > 0"
                                                        :name="available_tags[(i1 * tray_columns + i2)].id">
                                                </div>
                                                <div style="align-self: center;margin-left:10px;">
                                                    <label :for="available_tags[(i1 * tray_columns + i2)].id">{{
                                                        available_tags[(i1 * tray_columns +
                                                            i2)].name
                                                    }}
                                                        <a style="margin:0;position:absolute;right:10px;top:7px;"
                                                            class="ui label"
                                                            :data-tooltip="`${available_tags[(i1 * tray_columns + i2)].no_of_boxes} available boxes`">
                                                            {{ available_tags[(i1 * tray_columns + i2)].no_of_boxes }}
                                                        </a>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
            </div> -->
        </div>



    </div>
</template>

<script>
import { tags } from "@/composables/boxdata.js"
export default {
    setup() {
        const available_tags = tags()
        return {
            available_tags
        }
    },
    mounted() {
        this.local_tags = this.available_tags;
        // console.log(this.local_tags)
    },
    watch: {
        tray_columns(o, n) {
            if (o != n) {
                this.reset_column;
            }
        }
    },
    data() {
        return {
            selected_tags: [],
            local_tags: [],
            show_tag_selection: false,
            tray_columns: 3,
            reset_column: false,
        }
    },
    methods: {
        clearTags() {
            this.selected_tags = [];
            this.$emit("selectedTagsId", this.selected_tags)
        },
        handleSelect(id) {
            let selected = "";
            if (this.selected_tags.includes(id)) {
                selected = this.selected_tags.filter(i => i != id);
            } else {
                selected = this.local_tags.filter(i => i.id == id)[0];
                selected = [...this.selected_tags, selected.id];
            }
            this.selected_tags = selected;
            // console.log(this.selected_tags)
            this.$emit("selectedTagsId", this.selected_tags)
        }
    }
}
</script>

<style>
.four.wide.column:hover {
    color: #1F1F21 !important;
    cursor: pointer;
}

.four.wide.column.active {
    color: #B31228 !important;
    cursor: pointer;
}

.option-wrapper {
    overflow-y: auto;
    overflow-x: none;
    box-sizing: border-box;
    min-height: 10px;
    max-height: 500px;
    width: calc(100% - 0px);
    border: .5px solid gray;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    transition: min-height ease-in-out .1s, max-height ease-in-out .1s, width ease-in-out .1s;
}

.option-wrapper.hide {
    min-height: 0px;
    max-height: 0px;
    border: none;
}


#selection-container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    margin-bottom: 30px;
}

#selected-container {
    margin-bottom: 30px;
}

#selection-container>div {
    padding: 2px 10px;
    margin: 2px;
    border-radius: 25px;
    cursor: pointer;
}

#selection-container>div:hover {
    background-color: gray;
    color: white;
}

.selected {
    background-color: rgb(65, 65, 65);
    color: white;
    border: 1px inset darkgray;

}

.selected-inner {
    flex-wrap: wrap;
    width: 100%;
    margin-top: 2px;
    display: flex;
}


.selected-wrapper {
    width: 100%;
    display: flex;

}
</style>
