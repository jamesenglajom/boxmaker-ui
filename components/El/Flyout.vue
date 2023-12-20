
<template>
    <div id="flyout-element">
        <div ref="flyout" class="ui flyout left" :class="flyout ? 'overlay visible' : ''" tab-index="-1">
            <div class="ui header" style="display:flex;justify-content:space-between">
                <div style="display:flex;align-self:center">
                    <div @click="closeFlyout" style="background-color:lightgrey;cursor:pointer;padding:5px 10px;border-radius:4px;">
                        <i class="arrow left icon" ></i>
                    </div>
                    <div style="align-self:center;width:30px;margin-left:15px;">
                        <img height="100px" width="100px" :src="`/assets/images/box_icons/${box? box.img: ''}`" class="ui image"/>
                    </div>
                    <div class="content" style="align-self:center;margin-left:10px">
                        <!-- Arced Top Box -->
                        <div class="box_name">
                        {{ box!=undefined ? box.name: '' }}
                        </div>
                    </div>
                </div>
                <!-- <div style="align-self:center">
                    <button class="ui button red mini">PROCEED</button>
                </div> -->
            </div>
            <div class="content">
                <ComForm :boxId="box.id"></ComForm>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["isOpen","box"],
    data() {
        return {
            flyout: false,
        }
    },
    methods: {
        closeFlyout() {
            this.flyout = false;
            this.$emit("isClosed", true)
        },
    },
    watch: {
        isOpen(value) {
            if (value) {
                this.flyout = value;
            }
        },
        flyout(value) {
            if (value) {
                document.querySelector('body').style.overflow = "hidden";

            } else {
                document.querySelector('body').style.overflow = "visible";
            }
        },
    }
}
</script>
<style>
.ui.flyout.overlay {
    background: whitesmoke;
    width: 90% !important;
    z-index: 999;
    overflow: hidden;
    max-width:720px;
}

.ui.flyout.visible>.ui.header {
    background: white;
    border: none !important;

}

.ui.flyout.visible>.content {
    -webkit-box-shadow: inset 2px 2px 15px -8px rgba(10, 10, 10, 1);
    -moz-box-shadow: inset 2px 2px 15px -8px rgba(10, 10, 10, 1);
    box-shadow: inset 2px 2px 15px -8px rgba(10, 10, 10, 1);
    background: whitesmoke;
    overflow-y: scroll;
    max-height: calc(100vh - 65px);
    display: relative;
    padding:0px;    
}

.ui.pusher.dimmer.active {
    height: 100vh !important;
    top: auto !important;
    z-index: 1;
}
</style>