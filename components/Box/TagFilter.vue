
<style>
#tag-filter-flyout > .ui.flyout.overlay {
    background: #1F1F21;
    width: 130px !important;
    z-index: 999;
    overflow: hidden;
    max-width: 720px;
}

#tag-filter-flyout > .ui.flyout.visible>.ui.header {
    background: #1F1F21;
    border: none !important;

}

#tag-filter-flyout > .ui.flyout.visible>.content {
    -webkit-box-shadow: inset 2px 2px 15px -8px rgba(10, 10, 10, 1);
    -moz-box-shadow: inset 2px 2px 15px -8px rgba(10, 10, 10, 1);
    box-shadow: inset 2px 2px 15px -8px rgba(10, 10, 10, 1);
    background: #1F1F21;
    overflow-y: scroll;
    max-height: calc(100vh - 65px);
    display: relative;
    padding: 0px;
}

</style>

<template>
    <div id="tag-filter-flyout">
        <div class="ui flyout left" :class="false ? 'overlay visible' : ''" tab-index="-1">
            <div class="ui header" style="display:flex;justify-content:space-between">
                <div style="display:flex;align-self:center">
                    <div 
                        style="background-color:lightgrey;cursor:pointer;padding:5px 10px;border-radius:4px;">
                        <i class="arrow left icon"></i>
                    </div>
                    <div style="align-self:center;width:30px;margin-left:15px;">
                        <!-- <img height="100px" width="100px" :src="storedBox ? box.img : ''" class="ui image" /> -->
                    </div>
                    <div class="content" style="align-self:center;margin-left:10px">
                        <div class="box_name">
                            <!-- {{ boxmaker.getStoredBox ? boxmaker.getStoredBox.name : '' }} -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="content">
            </div>
        </div>
    </div>
</template>