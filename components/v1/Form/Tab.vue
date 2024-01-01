<template>
    <div id="form-tab" :style="`top:0px;`">
        <div>
            <div class="ui button circular icon back-button">
                <i class="ui arrow left icon"></i>
            </div>
            <div>
                Professional
            </div>
        </div>
        <div>
            <div>
                Professional
            </div>
            <div class="ui button circular icon back-button">
                <i class="ui arrow right icon"></i>
            </div>
        </div>
    </div>


    <div id="form-tab" :style="`bottom:0px;`">
        <div>
            <div class="ui button circular icon back-button">
                <i class="ui arrow left icon"></i>
            </div>
            <div>
                Professional
            </div>
        </div>
        <div>
            <div>
                Professional
            </div>
            <div class="ui button circular icon back-button">
                <i class="ui arrow right icon"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
const prop = defineProps(["placement","tabs","at"])
</script>


<style>
#form-tab {
    background: white;
    border: 1px solid #ccc;
    padding: 5px;
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: space-between;
}


#form-tab>div {
    align-self: center;
    display: flex;
}

#form-tab>div>div {
    align-self: center;
}
</style>