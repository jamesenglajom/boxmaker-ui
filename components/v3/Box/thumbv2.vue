<template>
    <div class="image-item-container" :data-tooltip="box.name" data-inverted="">
        <!-- <div class="tag" :class="index%2==0?'free':'pro'">{{index%2==0?'FREE':'PRO'}}</div> -->
        <div style="display:flex;justify-content:center;height:100px;">

            <div style="align-self:center;justify-content:center;text-align:center;">
                <center>
                    <img style="width:60px;color:rgb(0,78,97);" class="ui image" :src="box.img" />
                </center>
                <!-- <div class="label"
                    style="color:rgb(0,78,97);padding:3px;margin-top:7px;font-size:.85em;text-align:center;">
                    {{ box.name }}</div> -->
            </div>
        </div>
    </div>
</template>
<script setup>
const prop = defineProps(["box"])
</script>