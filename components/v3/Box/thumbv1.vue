<template>
    <div class="image-item-container-v2">
        <!-- <div class="tag" :class="index%2==0?'free':'pro'">{{index%2==0?'FREE':'PRO'}}</div> -->
        <div style="display:flex;justify-content:center;height:100px;">
            <div style="align-self:center;justify-content:center;text-align:center;">
                <center>
                    <img style="width:60px;color:rgb(0,78,97);" class="ui image" :src="box.img" />
                </center>
                <div class="label"
                    style="color:rgb(34, 34, 34);padding:3px;margin:7px;margin-top:14px;text-align:center;">
                    {{ box.name }}</div>
                <div class="price" style="margin-top:8px;display:flex;justify-content:center;">
                    <div style="display:flex;justify-content:center;width:normal;background:rgb(220, 220, 220);padding:2px 10px;border-radius:15px;">
                        <div>{{ 3  }}</div>
                        <div style="margin-left:2px;">
                            <img :src="goldCoin" alt="" style="width:20px;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import goldCoin from "@/assets/images/others/gold-coin.svg"
const prop = defineProps(["box"])
</script>

<style>
.image-item-container-v2 {
    width: 200px;
    margin: 10px;
    padding: 30px;
    border-radius: 60px;
    /* background:rgb(220, 220, 220); */
    height:200px;
    display:flex;
    justify-content: center;
    cursor:pointer;
    div{
        align-self:center;
    }
    &:hover{
        border:7px solid rgba(0,0,0,0.20);
        /* box-shadow: -2px 3px 25px 3px rgba(0,0,0,0.39);
-webkit-box-shadow: -2px 3px 25px 3px rgba(0,0,0,0.39);
-moz-box-shadow: -2px 3px 25px 3px rgba(0,0,0,0.39); */
    }
}
</style>