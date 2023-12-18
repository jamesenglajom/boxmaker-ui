<template>
    <div style="">
        <div class="ui grid" style="margin-bottom:40px;">
            <div class="one column" style="width:100%;">
                <div style="display:flex">
                    <div>
                        <button class="ui labeled icon basic button" data-tooltip="Filter tags" data-inverted=""
                            @click="show_tag_selection = !show_tag_selection">
                            <i class="filter icon" sryle="background-white"></i>
                            <small><b>{{ available_tags.length }}</b> TAGS</small>
                        </button>
                    </div>
                    <template v-if="selected_tags.length == 0">
                        <button class="ui button basic">ALL</button>
                    </template>
                    <template v-else>
                        <button @click="clearTags" class="ui icon button">
                            <i class="undo icon"></i>
                        </button>
                    </template>
                </div>


                <div class="selected-wrapper" :class="show_tag_selection == false ? 'show-height' : 'hide-height'">
                    <div class="selected-inner">

                        <template v-if="selected_tags.length != 0">
                            <template v-for="datum in available_tags.filter(i => !selected_tags.includes(i.id) == false)">
                                <div
                                    style="margin:1px;padding:3px 10px;border-radius:3px;border:solid .5px gray;width:auto;">
                                    <small><b>{{ datum.name.toUpperCase() }}</b></small>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </div>

            <div :style="show_tag_selection ? 'display:default' : 'display:none;'" class="selection-wrapper">
                <div class="ui grid">
                    <template v-for="(datum, i1) in Math.ceil(available_tags.length / 3)">
                        <div class="stackable three column row" style="padding:0px;margin:0px;">
                            <template v-for="(datum, i2) in 3">
                                <template v-if="(i1 * 3 + i2) < available_tags.length">
                                    <div class="column" style="padding:2px;">

                                        <div :for="available_tags[(i1 * 3 + i2)].id"
                                            style="align-self:center;display:flex;background:#CCCCCC;padding:10px 10px 8px 10px;border-radius:3px;position:relative">

                                            <div style="align-self: center;">
                                                <input type="checkbox" class="ui checkbox"
                                                    @change="handleSelect(available_tags[(i1 * 3 + i2)].id)"
                                                    :checked="selected_tags.filter(i => i == available_tags[(i1 * 3 + i2)].id).length > 0"
                                                    :name="available_tags[(i1 * 3 + i2)].id">
                                            </div>
                                            <div style="align-self: center;margin-left:10px;">
                                                <label :for="available_tags[(i1 * 3 + i2)].id">{{ available_tags[(i1 * 3 +
                                                    i2)].name
                                                }}
                                                    <a style="margin:0;position:absolute;right:10px;top:7px;" class="ui label" :data-tooltip="`${available_tags[(i1 * 3 + i2)].no_of_boxes} available boxes`">
                                                        {{ available_tags[(i1 * 3 + i2)].no_of_boxes }}
                                                    </a>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
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
    data() {
        return {
            selected_tags: [],
            local_tags: [],
            show_tag_selection: false
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
