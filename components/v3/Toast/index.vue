<template>
    <div class="top right ui toast-container" :class="(toggle_toast ? 'visible' : 'invisible')" :style="toast_width">

        <!-- MEMORY TOAST -->
        <div class="floating toast-box compact unclickable transition" :class="toggle_memory ? 'visible' : 'invisible'"
            :style="toggle_memory ? '' : 'display:none;'">
            <div role="alert" class="ui toast actions compact" :class="toggle_memory ? 'visible' : 'invisible'"
                style="opacity: 1;" :style="toggle_memory ? '' : 'display:none;'">
                <div class="content">
                    <div class="message">
                        <div style="display:flex">
                            <div class="icon">
                                <i class="bell large icon"></i>
                            </div>
                            <div class="text-message" style="margin-left:20px;">
                                I remembered the latest template that you have created. Would
                                you like to open it?
                            </div>
                        </div>
                        <!-- box container -->
                        <div>
                            <div class="item">
                                <div class="ui tiny image">
                                    <img :src="box.img">
                                </div>
                                <div class="middle aligned content">
                                    <template v-if="Object.keys(box).length > 0">
                                        <div>{{ box.name }} </div>
                                        <div>{{ box.dimension_value.slice(3) }}</div>
                                        <div style="color:gray;"><small>{{ " (" + box.dimension_label.slice(3) + ")"
                                        }}</small>
                                        </div>
                                        <!-- <div style="color:gray;">{{ box.date }}</div> -->
                                        <div class="fromNow"><small style="color:gray;">{{ $dayjs(box.date).fromNow()
                                        }}</small></div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="actions">
                    <div>
                        <button class="ui button inverted" v-tooltip.bottom="'Stored template will be deleted.'"
                            style="color:gray !important;" @click="buttonClick('memory', 'forget')">Don't show this
                            again</button>
                    </div>
                    <div style="display:flex;">
                        <div class="button-wrap">
                            <button class="ui button" @click="buttonClick('memory', 'open')">Yes, Please</button>
                        </div>
                        <div class="button-wrap">
                            <button class="ui button" @click="buttonClick('memory', 'ignore')">Remind me later</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <!-- DISCARD TOAST -->
        <div class="floating toast-box compact unclickable transition" :class="toggle_discard ? 'visible' : 'invisible'"
            :style="toggle_discard ? '' : 'display:none;'">
            <div role="alert" class="ui toast actions compact" :class="toggle_discard ? 'visible' : 'invisible'"
                :style="toggle_discard ? '' : 'display:none;'" style="opacity: 1;">
                <div class="content">
                    <div class="message">
                        <div style="display:flex">
                            <div class="icon">
                                <i class="exclamation large icon"></i>
                            </div>
                            <div class="text-message" style="margin-left:20px;">
                                This action will discard your changes. Do you want to continue?
                            </div>
                        </div>
                    </div>
                </div>
                <div class="actions">
                    <div>
                        <button class="ui button" @click="buttonClick('discard', 'continue')">Yes, Please</button>
                    </div>
                    <div style="display:flex;">
                        <div class="button-wrap">
                            <button class="ui button" @click="buttonClick('discard', 'cancel')">Don't close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { useBoxMakerStore } from "@/stores/boxmaker";
const bm = useBoxMakerStore();
// const {getMemoryBox:memory} = storeToRefs(bm);
const prop = defineProps(["config", "cookie"]);
const emit = defineEmits(["response"]);
const toggle_toast = ref(false);
const toggle_memory = ref(false);
const toggle_discard = ref(false);
const toast_width = ref("");
const box = ref([]);

watch(() => bm.isLoaded, (v) => {
    if (v) {
        toggle_toast.value = prop.cookie ? true : false;
        toggle_memory.value = prop.cookie ? true : false;
        if (prop.cookie) {
            box.value = bm.createMemoryBox(prop.cookie);
            toast_width.value = "max-width: 430px !important;min-width: 430px !important;width: 430px !important;";
        }
    }
});

watch(() => bm.discard, (v) => {
    toggle_toast.value = v;
    toggle_discard.value = v;
    toast_width.value = v ? "max-width: 330px !important;min-width: 330px !important;width: 330px !important;": "";
});
const buttonClick = (toast, response) => {
    if (toast == 'memory') {
        switch (response) {
            case "open":
                bm.$patch({
                    box_id: prop.cookie.data["MODEL"],
                    memory: true,
                })
                break;
        }
        toggle_memory.value = false;
        emit("response", response);
    } else if (toast == 'discard') {
        if(response == 'continue'){
            bm.$patch({
                box_id: null,
                discard: !bm.discard
            });
        }else if(response == 'cancel'){
            // close dimmer and toast
            bm.$patch({
                discard: false,
            });
        }
        toggle_discard.value = false;

    }
    toggle_toast.value = false;
}
</script>

<style lang="scss" scoped>
.item {
    display: flex;
    justify-content: left;
    width: 100%;
    border: #9b9b9b 1px solid;
    padding: 2px;
    margin-top: 4px;

    &>div {
        align-self: center;
    }

    .content {
        position: relative;
        width: 100%;

        .fromNow {
            position: absolute;
            top: 0px;
            right: 4px;
        }
    }

    .image {
        // border: #9b9b9b 1px solid;
        background: darkgray;
        margin-right: 5px;
        padding: 5px;
        width: 15%;
    }
}

// .toast-container {
// max-width: 500px !important;min-width: 500px !important;width: 500px !important;
// }

.text-message {
    font-weight: 900;
}

.toast-box {
    display: table !important;
    width: 100% !important;

    .ui.toast {
        border-radius: 0px !important;
        background: white;
        width: 100% !important;
        border: 1px solid #9b9b9b;
    }

    .actions {
        display: flex;
        justify-content: space-between;

        // justify-content: space-between;
        &div.button-wrap {
            align-self: center;
            width: 50%;
        }

        button {
            padding: 4px 8px;
            border-radius: 0px;
            font-weight: 300;
            border: #9b9b9b 1px solid;
        }
    }
}</style>