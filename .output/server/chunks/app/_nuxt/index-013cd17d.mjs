import { useSSRContext, resolveComponent, mergeProps, withCtx, createVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';
import '../../nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'tailwind-merge';

const _sfc_main$3 = {
  name: "CommonForm",
  props: ["boxData"],
  watch: {
    selected_unit(n, o) {
      this.convertFormValues(o, n);
    },
    selected_page_size(v) {
      if (v != "Auto") {
        let paper = this.paper_sizes.filter((i) => i.id == v)[0];
        this.form["PAGEWIDTH"] = paper.width;
        this.form["PAGEHEIGHT"] = paper.height;
      }
    },
    reg_mark_chkbox(v) {
      if (v) {
        this.form["REGISTRATION"] = this.selected_reg_mark;
      } else {
        this.form["REGISTRATION"] = "none";
      }
    },
    form(v) {
    },
    boxData(v) {
      this.extractFormElements();
      this.generatePreviewImage();
    }
  },
  data() {
    return {
      form_elements: [],
      // segregated form
      form_elements_inline: [],
      // inline form
      box_preview: "Sample",
      box_preview_options: ["Box outline", "Sample"],
      selected_unit: "mm",
      reg_mark_chkbox: false,
      selected_reg_mark: "page",
      selected_page_size: "Auto",
      pro_setting_form: [],
      box_outline_preview: "",
      info_toggle: false,
      registration_marks: [
        // {id:1,description:"No registrations marks"},
        { id: "page", description: "In the corners of the page" },
        { id: "model", description: "Around each model" }
      ],
      units: [
        { name: "mm", mm: 1, cm: 0.1, inch: 0.0393700787 },
        { name: "cm", mm: 10, cm: 1, inch: 0.3937007874 },
        { name: "inch", mm: 25.4, cm: 2.54, inch: 1 }
      ],
      form: {},
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
        { id: "A3PLUSL", name: "A3 Plus (Landscape)", width: 19.02, height: 12.95 }
        //"1020x710" => array("1020 x 710 mm",1020,710),
        //"710x1020" => array("710 x 2020 mm",2020,710),
        //"915x540" => array("915 x 540 mm",915,540),
        //"540x915" => array("540 x 915 mm",540,915)
        //"FLUTE" => array("Flute Board, 1200 x 2400 mm",1200,2400),
        //"FLUTEL" => array("Flute Board Landscape, 2400x1200 mm",2400,1200),
      ]
    };
  },
  methods: {
    generatePreviewImage(el) {
      let temp = this.form, url = "", akeys = Object.keys(temp);
      akeys.forEach((v) => {
        switch (v) {
          case "REGISTRATION":
          case "MARK":
            if (this.reg_mark_chkbox) {
              url = url + `&${v}=${temp[v]}`;
            }
            break;
          case "PAGEWIDTH":
          case "PAGEHEIGHT":
            if (this.selected_page_size != "Auto") {
              url = url + `&${v}=${temp[v]}`;
            }
            break;
          default:
            if (temp[v] != 0) {
              if (this.reg_mark_chkbox == false)
                ;
              url = url + `&${v}=${temp[v]}`;
            }
            break;
        }
      });
      this.box_outline_preview = `https://templatemaker-dev.signcut.com?REQUEST=DIELINESPREVIEW&MODEL=${this.boxData.id}&CUSTOMER=whisqu` + url;
    },
    slug(name) {
      return name.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, "").toLowerCase();
    },
    extractFormElements() {
      let tmp = this.boxData, parameter_class = Object.keys(this.boxData.parameters), form_elements = [], form_elements_inline = [];
      parameter_class.forEach((v) => {
        let temp = [...Object.values(tmp["parameters"][v])];
        if (v == "professional") {
          temp = [...Object.values(tmp["parameters"][v]).filter((i) => ["REGISTRATION", "MARK", "BLEED", "OVERCUT", "DASH", "GAP", "FILMIN"].includes(i.symbol))];
          this.pro_setting_form = [...Object.values(tmp["parameters"][v]).filter((i) => ["BLEED", "OVERCUT", "DASH", "GAP", "FILMIN"].includes(i.symbol))];
        } else if (v == "standard") {
          temp = [...Object.values(tmp["parameters"][v]).filter((i) => ["PAGEPRESET", "PAGEHEIGHT", "PAGEWIDTH"].includes(i.symbol))];
        }
        form_elements[v] = [...form_elements, ...temp];
        form_elements_inline = [...form_elements_inline, ...temp];
      });
      this.form_elements = form_elements;
      this.form_elements_inline = form_elements_inline;
      this.initializeFormData();
    },
    initializeFormData() {
      Object.keys(this.form_elements).forEach((v) => {
        this.form_elements[v].forEach((v1) => {
          this.form[v1.symbol] = v1.value;
        });
      });
    },
    resetFormValues() {
      this.initializeFormData();
    },
    convertFormValues(from, to) {
      let tmp = this.form, operation = this.units.filter((i) => i.name == from)[0];
      Object.entries(tmp).filter((i) => !["PAGEWIDTH", "PAGEHEIGHT"].includes(i[0])).forEach((v) => {
        let el = this.form_elements_inline.filter((i) => i.symbol == v[0])[0];
        if (el["type"] == "measure") {
          this.form[v[0]] = to == "mm" ? Math.round(v[1] * operation[to]) : Math.round(v[1] * operation[to] * 100) / 100;
        }
      });
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "CommonFormComponent",
    style: { "display": "flex" }
  }, _attrs))}><div class="preview-display" style="${ssrRenderStyle({ "border-right": "1px solid lightgray", "width": "50%", "position": "fixed", "background-color": "white" })}"><div style="${ssrRenderStyle({ "display": "flex" })}"><!--[-->`);
  ssrRenderList($data.box_preview_options, (datum) => {
    _push(`<div class="box-preview-button" style="${ssrRenderStyle($data.box_preview == datum ? "background-color:rgb(18,121,198) !important;color:white" : "")}">${ssrInterpolate(datum)}</div>`);
  });
  _push(`<!--]--></div><div style="${ssrRenderStyle({ "height": "calc(100vh - 113px)", "position": "relative" })}"><div style="${ssrRenderStyle($data.box_preview == "Sample" ? null : { display: "none" })}"><img${ssrRenderAttr("src", $props.boxData ? `https://templatemaker-dev.signcut.com/?MODEL=${$props.boxData.id}&CUSTOMER=whisqu&REQUEST=EXPLANATION` : "")} width="500px" height="500px"></div><div style="${ssrRenderStyle($data.box_preview == "Box outline" ? null : { display: "none" })}"><img${ssrRenderAttr("src", $props.boxData ? $data.box_outline_preview : "")} alt="" width="500px" height="500px"></div><div class="box-description ui text" style="${ssrRenderStyle({ "position": "absolute", "bottom": "0", "padding": "10px 20px" })}"><div style="${ssrRenderStyle({ "position": "relative" })}"><div class="ui icon button circular grey"><i class="question icon"></i></div></div><div class="${ssrRenderClass([$data.info_toggle ? "transition visible" : "invisible", "ui custom popup top left inverted"])}" style="${ssrRenderStyle({ "inset": "auto auto 60px 20px", "display": "block !important", "width": "400px !important" })}">${ssrInterpolate($props.boxData ? $props.boxData.description : "")}</div></div></div></div><div class="form-display" style="${ssrRenderStyle({ "width": "50%", "margin-left": "50%", "padding": "20px" })}"><div class="ui form"><div class="header" style="${ssrRenderStyle({ "margin-bottom": "10px" })}"><h5 class="ui header text darkgray"><b>DIMENSIONS</b></h5></div><div class="content"><div class="custom-form-card"><div class="field"><label for="unit"><small>UNIT</small></label><div class="ui buttons blue fluid"><!--[-->`);
  ssrRenderList($data.units, (datum) => {
    _push(`<button class="${ssrRenderClass([$data.selected_unit == datum.name ? "active" : "", "ui button"])}">${ssrInterpolate(datum.name)}</button>`);
  });
  _push(`<!--]--></div></div>`);
  if ($props.boxData) {
    _push(`<!--[-->`);
    ssrRenderList($data.form_elements.parameters, (datum) => {
      _push(`<div class="field"><label${ssrRenderAttr("for", $options.slug(datum.name))}><small>${ssrInterpolate(datum.name)}</small></label><div class="ui right labeled input"><input${ssrRenderAttr("id", $options.slug(datum.name))} step="1" type="number"${ssrRenderAttr("min", datum.minval)}${ssrRenderAttr("max", datum.maxval)}${ssrRenderAttr("value", $data.form[`${datum.symbol}`])}><div class="ui basic label blue input-unit">${ssrInterpolate(datum.type == "measure" ? $data.selected_unit : datum.type == "number" ? "" : "\xB0")}</div></div></div>`);
    });
    _push(`<!--]-->`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="ui horizontal divider"><small>Other Specifications</small></div><div class="custom-form-card">`);
  if ($props.boxData) {
    _push(`<!--[-->`);
    ssrRenderList($data.form_elements.options, (datum) => {
      _push(`<div class="field"><label${ssrRenderAttr("for", $options.slug(datum.name))}><small>${ssrInterpolate(datum.name)}</small></label><div class="ui right labeled input"><input${ssrRenderAttr("id", $options.slug(datum.name))} type="number"${ssrRenderAttr("min", datum.minval)}${ssrRenderAttr("max", datum.maxval)}${ssrRenderAttr("value", $data.form[`${datum.symbol}`])}><div class="ui basic label blue input-unit">${ssrInterpolate(datum.type == "measure" ? $data.selected_unit : datum.type == "number" ? "" : "\xB0")}</div></div></div>`);
    });
    _push(`<!--]-->`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div><div class="header" style="${ssrRenderStyle({ "margin": "30px 0px 10px 0px" })}"><h5 class="ui header text darkgray"><b>PAGE SETTINGS</b></h5></div><div class="content"><div class="custom-form-card"><div class="ui field"><label for="unit"><small>Page size</small></label><select class="ui dropdown selection"><!--[-->`);
  ssrRenderList($data.paper_sizes, (datum) => {
    _push(`<option${ssrRenderAttr("value", datum.id)}>${ssrInterpolate(datum.name)}</option>`);
  });
  _push(`<!--]--></select></div><div class="two fields"><div class="field"><label for="pagewidth"><small>Page width</small><div class="${ssrRenderClass([$data.selected_page_size == "Custom" ? "" : "invisible", "left pointing basic ui label red"])}">Custom</div></label><div class="${ssrRenderClass([$data.selected_page_size != "Custom" ? "disabled" : "", "ui right labeled input"])}"><input step="1" type="number" min="0"${ssrRenderAttr("value", $data.form["PAGEWIDTH"])}><div class="ui basic label blue input-unit">${ssrInterpolate("in")}</div></div></div><div class="field"><label for="pageheight"><small>Page height</small><div class="${ssrRenderClass([$data.selected_page_size == "Custom" ? "" : "invisible", "left pointing basic ui label red"])}">Custom</div></label><div class="${ssrRenderClass([$data.selected_page_size != "Custom" ? "disabled" : "", "ui right labeled input"])}"><input step="1" type="number" min="0"${ssrRenderAttr("value", $data.form["PAGEHEIGHT"])}><div class="ui basic label blue input-unit">${ssrInterpolate("in")}</div></div></div></div></div></div><div class="header" style="${ssrRenderStyle({ "margin": "30px 0px 10px 0px", "display": "flex" })}"><div class="ui checkbox"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray($data.reg_mark_chkbox) ? ssrLooseContain($data.reg_mark_chkbox, null) : $data.reg_mark_chkbox) ? " checked" : ""}><label for=""><h5 class="ui header text darkgray"><b>REGISTRATION MARKS</b></h5></label></div></div><div class="content"><div class="custom-form-card"><div class="field"><label for="registration_mark_diameter"><small>Diameter</small></label><div class="${ssrRenderClass([$data.reg_mark_chkbox == false ? "disabled" : "", "ui right labeled input"])}"><input type="number" min="0" max="1000"${ssrRenderAttr("value", $data.form["MARK"])}><div class="ui basic label blue input-unit">${ssrInterpolate($data.selected_unit)}</div></div></div><div class="field"><div class="grouped fields"><div class="two fields"><!--[-->`);
  ssrRenderList($data.registration_marks, (datum) => {
    _push(`<div class="field"><div class="${ssrRenderClass([$data.reg_mark_chkbox == false ? "disabled" : "", "ui radio checkbox"])}"><input type="radio" name="regmark"${ssrRenderAttr("value", datum.id)}${ssrIncludeBooleanAttr(ssrLooseEqual($data.selected_reg_mark, datum.id)) ? " checked" : ""}><label>${ssrInterpolate(datum.description)}</label></div></div>`);
  });
  _push(`<!--]--></div></div></div></div></div><div class="ui horizontal divider"><small>Other Specifications</small></div><div class="custom-form-card" style="${ssrRenderStyle({ "margin-top": "10px" })}"><!--[-->`);
  ssrRenderList($data.pro_setting_form, (datum) => {
    _push(`<div class="field"><label for="segments_per_arc"><small>${ssrInterpolate(datum.name)}</small></label><div class="ui right labeled input"><input type="text"${ssrRenderAttr("min", _ctx.minval)}${ssrRenderAttr("max", _ctx.maxval)}${ssrRenderAttr("value", $data.form[`${datum.symbol}`])}><div class="ui basic label blue input-unit">${ssrInterpolate($data.selected_unit)}</div></div></div>`);
  });
  _push(`<!--]--></div></div></div></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ComForm/index.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$2 = {
  props: ["isOpen", "boxData", "boxImg"],
  data() {
    return {
      flyout: false
    };
  },
  methods: {
    closeFlyout() {
      this.flyout = false;
      this.$emit("isClosed", true);
    }
  },
  watch: {
    isOpen(value) {
      if (value) {
        this.flyout = value;
      }
    },
    flyout(value) {
      if (value) {
        document.querySelector("body").style.overflow = "hidden";
      } else {
        document.querySelector("body").style.overflow = "visible";
      }
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ComForm = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "flyout-element" }, _attrs))}><div class="${ssrRenderClass([$data.flyout ? "overlay visible" : "", "ui flyout left"])}" tab-index="-1"><div class="ui header" style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-self": "center" })}"><div style="${ssrRenderStyle({ "background-color": "lightgrey", "cursor": "pointer", "padding": "5px 10px", "border-radius": "4px" })}"><i class="arrow left icon"></i></div><div style="${ssrRenderStyle({ "align-self": "center", "width": "25px", "margin-left": "15px" })}"><img${ssrRenderAttr("src", `_nuxt/assets/images/box_icons/${$props.boxImg}`)} class="ui image"></div><div class="content" style="${ssrRenderStyle({ "align-self": "center", "margin-left": "10px" })}"><div class="box_name">${ssrInterpolate($props.boxData ? $props.boxData.name : "")}</div></div></div><div style="${ssrRenderStyle({ "align-self": "center" })}"><button class="ui button green">PROCEED</button></div></div><div class="content">`);
  _push(ssrRenderComponent(_component_ComForm, { boxData: $props.boxData }, null, _parent));
  _push(`</div></div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/El/Flyout.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$1 = {
  name: "MultiSelect",
  props: { placeholder: String, options: Array },
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
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.option_tray_width = 220;
      this.input_el_width = 220;
      this.input_el_height = 38;
      this.option_tray_top = 35;
      this.max_wrap_width = 220;
    });
  },
  methods: {
    clearSelection() {
      this.selected_items = [];
      this.$emit("selected_items", this.selected_items);
      this.adjustELWidth(false, "");
    },
    clickED() {
      this.option_tray_width = this.$refs.multiSelect.offsetWidth;
      this.count++;
    },
    optionClicked(value) {
      this.selected_items = [...this.selected_items, value];
      this.$emit("selected_items", this.selected_items);
      this.adjustELWidth(true, value);
    },
    unselect(v) {
      this.selected_items = this.selected_items.filter((i) => i != v);
      this.$emit("selected_items", this.selected_items);
      this.adjustELWidth(false, v);
    },
    adjustELWidth(increase, val) {
      let w = this.$refs.selectTray.offsetWidth, mw = this.$refs.mainWrap.offsetWidth;
      this.$nextTick(() => {
        let tmp = increase ? this.$refs[`dynamicEl${val}`][0].offsetWidth : 0;
        let h = this.$refs.selectTray.offsetHeight, DW_DElW = w + tmp;
        let select_tray_max_stretch = mw - 60, element_stretch = DW_DElW + 64;
        if (DW_DElW > mw - 60) {
          this.max_wrap_width = select_tray_max_stretch;
          this.option_tray_width = mw;
          this.input_el_width = mw;
          this.input_el_height = this.FwrapOn ? h + 8 : h + 38;
          this.option_tray_top = this.input_el_height - 2;
          this.FwrapOn = true;
        } else {
          if (increase) {
            this.option_tray_width = DW_DElW + 4 < 220 - 60 ? 220 : element_stretch;
            this.input_el_width = DW_DElW + 4 < 220 - 60 ? 220 : element_stretch;
          } else {
            if (this.selected_items.length == 0) {
              this.FwrapOn = false;
              this.option_tray_width = 220;
              this.input_el_width = 220;
              this.input_el_height = 38;
              this.option_tray_top = 35;
              this.max_wrap_width = 220;
            } else {
              this.input_el_height = this.selected_items.length == 0 ? 38 : h + 8;
              this.option_tray_top = this.input_el_height - 2;
            }
          }
        }
      });
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "MultiSelec",
    ref: "mainWrap"
  }, _attrs))}><div class="wrap"><div class="ui icon input"><input class="${ssrRenderClass($data.count % 2 == 0 ? "" : "focused")}" type="button" style="${ssrRenderStyle(`caret-color:transparent;cursor:pointer;width:${$data.input_el_width}px !important;height:${$data.input_el_height}px !important;`)}"${ssrRenderAttr("value", $data.selected_items.length == 0 ? "Please select..." : "")}><div style="${ssrRenderStyle({ "position": "absolute", "right": "8px", "top": "9px", "color": "darkgray", "pointer-events": "none" })}"><span style="${ssrRenderStyle($data.selected_items.length == 0 ? "display:none" : "display:auto")}"><i class="close icon" style="${ssrRenderStyle({ "pointer-events": "auto" })}"></i></span><span><i class="filter icon"></i></span></div><div style="${ssrRenderStyle({ "position": "absolute", "top": "4px", "left": "3px", "pointer-events": "none" })}"><div style="${ssrRenderStyle([{ "display": "flex" }, $data.FwrapOn ? "flex-wrap:wrap;width:" + $data.max_wrap_width + "px !important;min-width:" + $data.max_wrap_width + "px !important;" : "flex-wrap:nowrap;" + ($data.selected_items.length == 0 ? "width:0px;" : "")])}"><!--[-->`);
  ssrRenderList($data.selected_items, (datum) => {
    _push(`<div style="${ssrRenderStyle({ "pointer-events": "auto", "white-space": "nowrap", "display": "inline-block", "width": "auto", "position": "relative", "margin": "2px", "height": "26px", "padding": "1px 30px 1px 7px", "background": "lightgray", "border": "1px solid darkgray", "border-radius": "3px" })}"><p><b><small>${ssrInterpolate($props.options.filter((i) => i.id == datum)[0].name)}</small></b></p><i class="close icon" style="${ssrRenderStyle({ "cursor": "pointer", "position": "absolute", "right": "4px", "top": "6px" })}"></i></div>`);
  });
  _push(`<!--]--></div></div></div><div class="${ssrRenderClass([$data.count % 2 == 0 ? "invisible" : "visible", "option-tray"])}" style="${ssrRenderStyle(`width:${$data.option_tray_width}px;top:${$data.option_tray_top}px !important;`)}"><!--[-->`);
  ssrRenderList($props.options.filter((i) => !$data.selected_items.includes(i.id)), (datum) => {
    _push(`<div class="options"${ssrRenderAttr("data-value", datum.id)}>${ssrInterpolate(datum.name)}</div>`);
  });
  _push(`<!--]--><div class="options disabled" style="${ssrRenderStyle(`${$data.selected_items.length != $props.options.length ? "display:none" : ""}`)}"><i>No items left...</i></div></div></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MultiSelect/index.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  // components:{SuiButton},
  data() {
    return {
      isLoaded: false,
      selected_box: "bag",
      flyout: false,
      box_types: [],
      new_data: [],
      box_names: [],
      filter_tags: ["all"],
      filtered_tags: [],
      tags: ["Glueless", "Telescopic", "Fancy", "Inserts", "Decorative"],
      r_data: {
        "arced": {
          "id": "arced",
          "name": "Arced Top Box",
          "description": "Box with decorative, arced top and snap-lock-bottom.",
          "tags": [
            "proffesional",
            "box",
            "packaging",
            "flatpack",
            "premium",
            "glueless"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "arced",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "0be8c90d"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "64257b84"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "1f1b09df"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9c003460"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a88bfef9"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "6f30fc15"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "924f5b02"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "f86dbac9"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "e6afacd2"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 100,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a00970c4"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 70,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a41d41ab"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 50,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "12bea1fd"
              }
            },
            "options": {
              "T": {
                "name": "Material thickness",
                "symbol": "T",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "62035653"
              },
              "N": {
                "name": "Segments per arc",
                "symbol": "N",
                "value": 8,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "fb1e9ec5"
              },
              "SLOT": {
                "name": "Slot Width",
                "symbol": "SLOT",
                "value": 2,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e43c94a2"
              },
              "FLAP": {
                "name": "Closing Flap Size",
                "symbol": "FLAP",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b1551576"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 80,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "fecaf3e8"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6df1052f"
              },
              "R": {
                "name": "Crash Lock Corner Radius",
                "symbol": "R",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c049fd9e"
              },
              "OS": {
                "name": "Crash lock flap size",
                "symbol": "OS",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "34a21e4b"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "32a0fcb3"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d4b23bf9"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ee4f06f5"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "dc58e152"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c99847f2"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fc55c8b0"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "384b930e"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "00e0e5f9"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "1a7eea06"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "fb381ae6"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "121c183d"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "84eaaf04"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e4e0b250"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "603b4c6d"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "388d5b34"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "bag": {
          "id": "bag",
          "name": "Bag",
          "description": "A typical paper bag that can be stored completely flat. This template can be used to create goodie bags, grocery bags and wrappings for wine bottles. (Among others) or a large grocery bag. The top of the bag is folded for reinforcement.",
          "tags": [
            "Proffesional",
            "Box",
            "Packaging",
            "Gift Wrapping"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "bag",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "16dc0e5d"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "28f55148"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "cf4670eb"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "33cb871b"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "53b084c4"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "83c36ca5"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0485cd4c"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "0eb5770f"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "21220fdd"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 80,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c287f255"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 50,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "10ec5e58"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 150,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "705d6740"
              },
              "F": {
                "name": "Fold",
                "symbol": "F",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "23693b69"
              }
            },
            "options": {
              "g": {
                "name": "Glue Flap Size",
                "symbol": "g",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ce335e1b"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "8bc8f9cd"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5dc7984c"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a08b5310"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "66f4cf2b"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b8b9c2e5"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "dd885d5f"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fef2808e"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f32171ff"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "104d3ebe"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "b6496a58"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "98d8f7c4"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "73ef85bc"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0199e261"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "d0d325d7"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "14d8b793"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "boxlid": {
          "id": "boxlid",
          "name": "Box with lid",
          "description": "Print template for box with lid, for example a shoe box or a board game box. Length, Width and Height are all inner dimensions of the base. The size for the glue flap is an indication only: the program might make it smaller to make more economic use of the material. The Clearance is added twice to both the Length and the Width",
          "tags": [],
          "metrics": [],
          "validations": [],
          "MODEL": "boxlid",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "fa56561f"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9fcaa614"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "7d5fcfd0"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fb5fb1f0"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a0252e18"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "67edb210"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "46f834e2"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "fbe29ded"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "5626ef34"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 100,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1d8aa86d"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 60,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e1d1637d"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7fd8dc59"
              },
              "LID": {
                "name": "Lid Height",
                "symbol": "LID",
                "value": 25,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "26c11e89"
              },
              "CLEAR": {
                "name": "Clearance (percentage)",
                "symbol": "CLEAR",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c8f62fc4"
              }
            },
            "options": {
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e5d6e206"
              },
              "ALPHA": {
                "name": "Glue Flap Angle",
                "symbol": "ALPHA",
                "value": 80,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "bfad2d6e"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "cfb393e0"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5e30acfd"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a3787fb4"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e00b1a1b"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "dbe5334e"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b0704859"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b59dd46c"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "11e313cf"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "c4ca93a6"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "3335298e"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "978b26d8"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d896d8e0"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b62df888"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "82306ade"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d5edb815"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "cakeslicebox": {
          "id": "cakeslicebox",
          "name": "Cake Slice Box",
          "description": "A triangle-shaped or wedge-shaped box. The length is measured along the center of the box. The edges of the box will be slightly larger.",
          "tags": [
            "Paper craft",
            "Box",
            "Packaging",
            "Professional"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "cakeslicebox",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "a2522068"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "000997a9"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "95461aed"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8b16c7e7"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5216b0fc"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "a1be799d"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c9e11fab"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "c57defd5"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "02088222"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 140,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9b65968a"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a619e02d"
              },
              "ANGLE": {
                "name": "Angle",
                "symbol": "ANGLE",
                "value": 30,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "e14166bb"
              }
            },
            "options": {
              "T": {
                "name": "Paper thickness",
                "symbol": "T",
                "value": 1,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "13704408"
              },
              "LOCK": {
                "name": "Lock Flap Width",
                "symbol": "LOCK",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "93536ee1"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "6c01b4fb"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9fa1b0b9"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "395160b0"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3663860f"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e0097b29"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b1720b63"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "764b4a02"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9f54c026"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "6f52fa1e"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "dec4edb1"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "a251e771"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b638541f"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "072abe22"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "3db69cfd"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "dbcc9e43"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "cardbox": {
          "id": "cardbox",
          "name": "Card Box",
          "description": "The most common box. A long, thin, box. The default dimensions are fine for a set of standard, European, playing cards (\u201Cbridge size\u201D).",
          "tags": [
            "Proffesional",
            "Box",
            "Packaging",
            "Board Games",
            "Learning Materials"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "cardbox",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "3c10c44f"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "be068d84"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "5ff1c98b"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0ced9924"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "495b6cbe"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "11948c59"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "216e3fe7"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "6281460c"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "baa1e528"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 60,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f5c5902c"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a6378996"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 90,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a32a7a65"
              }
            },
            "options": {
              "THUMB": {
                "name": "Thumb Hole Diameter",
                "symbol": "THUMB",
                "value": 17,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b625cd02"
              },
              "TUCK": {
                "name": "Tuck Flap Size",
                "symbol": "TUCK",
                "value": 21,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "83055701"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4bbf8216"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 80,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "37dadf0b"
              },
              "T": {
                "name": "Material thickness",
                "symbol": "T",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7386fb73"
              },
              "R": {
                "name": "Rounded Corners Radius",
                "symbol": "R",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3db74af8"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "76922cf8"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a8314ed1"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4ed1a00c"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6e3fc7ac"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "58de7e5e"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "aeb905a4"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7806d07c"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fac33e4c"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "2aa82333"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "c79cd2a6"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "f9bfc582"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "adc79ae6"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "52de9d5e"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "a25b72d0"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4f776a83"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "cone": {
          "id": "cone",
          "name": "Cone (truncated)",
          "description": "A cone, optionally with the top cut off. (In that case, it\u2019s called a frustum). Can be used to help create the geometry for a beaker, vase, party-hat or lamp shade. If you'd like a real cone, just use zero for the top-diameter. Tip: do not score or fold the fold line this template to keep seam smooth.",
          "tags": [
            "Math",
            "Education",
            "Shape",
            "Geometric",
            "Engineering",
            "Ceramics",
            "Paper Craft"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "cone",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "a912fdb1"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d8211fc4"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "ecbc5bcb"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "25d5b136"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5f1ce2ab"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "8b382267"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fa4a05f4"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "9e8552fa"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "6ac7f658"
              }
            },
            "parameters": {
              "TOP": {
                "name": "Top Diameter",
                "symbol": "TOP",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1daac803"
              },
              "BOTTOM": {
                "name": "Bottom Diameter",
                "symbol": "BOTTOM",
                "value": 100,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a6bdc953"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 120,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "34169f95"
              }
            },
            "options": {
              "RCL": {
                "name": "Radial Construction Lines",
                "symbol": "RCL",
                "value": 2,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 1e3,
                "uuid": "ca411192"
              },
              "TCL": {
                "name": "Tangential Construction Lines",
                "symbol": "TCL",
                "value": 2,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 1e3,
                "uuid": "cbf8fc9a"
              },
              "ANGLEGLUE": {
                "name": "Overlap Flap Angle",
                "symbol": "ANGLEGLUE",
                "value": 70,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "69414f72"
              },
              "GLUE": {
                "name": "Overlap Flap Size",
                "symbol": "GLUE",
                "value": 7,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c0d81f59"
              },
              "MUSHROOM": {
                "name": "Locking Flap Size",
                "symbol": "MUSHROOM",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cf1ec4c4"
              },
              "STEM": {
                "name": "Locking Flap Stem",
                "symbol": "STEM",
                "value": 2,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fa80994d"
              },
              "N": {
                "name": "Number of Locking Flaps",
                "symbol": "N",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 10,
                "uuid": "33a7f63f"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "794dbe60"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "01b10947"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "60a67614"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cdeef263"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f98e80d2"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "654124f3"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f9ab9835"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "632c2d1a"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "48a105e2"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "0d92aa9e"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "15b13d1a"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "41b58d7f"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d90b01c3"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "c3ee7f3f"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2b019dd3"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "counterdisplay": {
          "id": "counterdisplay",
          "name": "Counter Display",
          "description": "Glue-less, open, cut-away box for storing and displaying items. This design is well suited for storing cards and for sorting small items. Notice that the actual length might be bit smaller due to flaps folding inward.",
          "tags": [
            "Learning Materials",
            "Board Games",
            "Paper Craft",
            "Glueless"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "counterdisplay",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "5a396ecd"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b69c6e95"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "f9b5d7d6"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ff58cdff"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ba9f3f90"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "5f18b181"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b6d5958e"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "d80abc12"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "3d13e8b7"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 150,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5e467dc9"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 70,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "00fdd488"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 50,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "50048874"
              },
              "F": {
                "name": "Front",
                "symbol": "F",
                "value": 25,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "87aca951"
              },
              "T": {
                "name": "Paper Thickness",
                "symbol": "T",
                "value": 1,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "88f1b5d5"
              }
            },
            "options": {},
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "33623e45"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b6ff2366"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "06d873dc"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9c2cd2dc"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4971c696"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8c6cf5b7"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5da6d033"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d8c888d7"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "1779147d"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "9ab20221"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "51658e49"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b9d8033e"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d77f1dd1"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "21a63639"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ef0d1964"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "curved": {
          "id": "curved",
          "name": "Curved Box",
          "description": "Box with curved sides. The value for curve size can be either positive or negative. You can enter any value, but do not make the curve too large, or the box will break or buckle when folded. Be aware that the Length and the Width do not take the curve size into account.",
          "tags": [
            "Proffesional",
            "Box",
            "Packaging",
            "Board Games",
            "Learning Materials"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "curved",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "84d1c350"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0d416ac6"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "e8fdf6d5"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "17c00aaa"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fae48b9a"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "ae9cb13b"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1ba77e59"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "66adf820"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "b635fa29"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 60,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0bfe655a"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "09eea840"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 90,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "89d55503"
              },
              "C": {
                "name": "Curve Size",
                "symbol": "C",
                "value": -5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "May also be negative.",
                "minval": -1e4,
                "maxval": 1e4,
                "uuid": "81855cd3"
              }
            },
            "options": {
              "THUMB": {
                "name": "Thumb Hole Diameter",
                "symbol": "THUMB",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c59cdda1"
              },
              "TUCK": {
                "name": "Tuck Flap Size",
                "symbol": "TUCK",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "31a4af5f"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "eb41e043"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 80,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "3713e148"
              },
              "T": {
                "name": "Material thickness",
                "symbol": "T",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "52df2dfb"
              },
              "R": {
                "name": "Rounded Corners Radius",
                "symbol": "R",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8a202009"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "544436e4"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "699a82c1"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d60e7a7e"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0346cc29"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e10aa568"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a64fb0ae"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ff9da7b1"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "393bc214"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "23c41451"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "dc25d641"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "a4586d38"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f8d5fd8a"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "59912703"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "9120a8d8"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e9fa530d"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "ellipse": {
          "id": "ellipse",
          "name": "Elliptical Box",
          "description": "A elliptical box. The caps consist of two elliptical layers each, one on the inside and one one the outside, with the glue flaps sandwiched between them. The one on the outside is slightly larger than the given diameters in order to neatly cover the base and the lid. The shafts can be closed by sliding the slits at the ends inside each other. Adjust the extra size of the outside lids by changing the Paper Thickness.",
          "tags": [
            "Decoration",
            "Paper Craft",
            "Gift"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "ellipse",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "bffa15ec"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "960657c0"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "bec6a0e5"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9e62e2e0"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3c49f343"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "02f9680c"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "19a350d6"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "f41bfa45"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "c69ac32a"
              }
            },
            "parameters": {
              "A": {
                "name": "Length",
                "symbol": "A",
                "value": 80,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "75e7f548"
              },
              "B": {
                "name": "Width",
                "symbol": "B",
                "value": 60,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "27d465fa"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 70,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ecb6b87f"
              },
              "LID": {
                "name": "Lid Height",
                "symbol": "LID",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6ded8491"
              }
            },
            "options": {
              "C": {
                "name": "Clearance (percentage)",
                "symbol": "C",
                "value": 3,
                "expression": "",
                "type": "percentage",
                "dirty": false,
                "tooltip": null,
                "minval": -1e3,
                "maxval": 1e3,
                "uuid": "c9b797a0"
              },
              "N": {
                "name": "Number of Glue tabs",
                "symbol": "N",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c64c5185"
              },
              "ANGLEGLUE": {
                "name": "Glue Flap Angle",
                "symbol": "ANGLEGLUE",
                "value": 70,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "396c2b71"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "eba8a969"
              },
              "T": {
                "name": "Paper Thickness",
                "symbol": "T",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "03604aa1"
              },
              "SEGMENTS": {
                "name": "Segments per ellipse",
                "symbol": "SEGMENTS",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": 8,
                "maxval": 72,
                "uuid": "01320715"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "f72044ad"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6e73a411"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "39f4eddb"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "df9c0c19"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "bcf826f9"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "da5e8662"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "eb515cbc"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7d53ae2b"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "14bc19b9"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "9a4c7e91"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "ed58ba8f"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3ab194b0"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2bac2c93"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "aa56af73"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ac763b3f"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "envelope": {
          "id": "envelope",
          "name": "Envelope",
          "description": "Classical letter envelope, most often used for personal letters.",
          "tags": [
            "Proffesional",
            "Paper Craft",
            "Packaging",
            "Gift"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "envelope",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "494ede59"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "aef9ab93"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "38eba9b8"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "df4a2348"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f048a223"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "31937765"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "df62becb"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "f5793b47"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "1afbc13a"
              }
            },
            "parameters": {
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 150,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2497fcf2"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 100,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b5310b4f"
              }
            },
            "options": {
              "OVERLAP": {
                "name": "Overlap",
                "symbol": "OVERLAP",
                "value": 12.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2bd43f56"
              },
              "R": {
                "name": "Rounded Corners Radius",
                "symbol": "R",
                "value": 7,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d0ab03b1"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "035d7fdf"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6c50198c"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e80c4cb0"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e0438c68"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c4541394"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2b9f192e"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "91a338c7"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c56db192"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "68efa827"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "2237a627"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "176d9143"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5695c384"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b6e985ea"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "9737d4e6"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "886e1e6f"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "exploding-box": {
          "id": "exploding-box",
          "name": "Exploding Box",
          "description": "A box consisting of a tray and a lid. The sides of the tray are not glued, but kept together by the lid. Once the lid is removed, the box \u2018explodes\u2019 as the sides fall outward.",
          "tags": [
            "Paper Craft",
            "Gift"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "exploding-box",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "ae0b80f5"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "22f9146b"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "da64c66f"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "340461b1"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6a28e593"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "e8657e56"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "80f1866e"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "b6d0c3b5"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "e293c60f"
              }
            },
            "parameters": {
              "D": {
                "name": "Inner Diameter",
                "symbol": "D",
                "value": 80,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "bd485dbb"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 60,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d99aea29"
              },
              "LID": {
                "name": "Lid Height",
                "symbol": "LID",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "dc7a3f41"
              },
              "N": {
                "name": "Number of sides",
                "symbol": "N",
                "value": 5,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "86432c53"
              }
            },
            "options": {
              "CLEAR": {
                "name": "Clearance (percentage)",
                "symbol": "CLEAR",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a269a2c7"
              },
              "ANGLEGLUE": {
                "name": "Glue Flap Angle",
                "symbol": "ANGLEGLUE",
                "value": 85,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "21a90c25"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "afb21142"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "56c8b64e"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6f652c3f"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "144580b2"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "de0aac18"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e70e3e40"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d0bd4c49"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "47ff1e14"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cf1f7cd1"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "1cfac0f8"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "ea67710c"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "f979b4e8"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "08d28f62"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "372a5344"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "ef30847c"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "32cffe31"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "gemstone": {
          "id": "gemstone",
          "name": "Gem Stone Box",
          "description": "Gem stone shaped box, consisting of two identical polygonal pyramids, glued together bottom to bottom. It can be stored (and shipped)completely flat, but when you pull the two apices apart, the box will get it\u2018s full shape. Glue the two pieces together when both halves are flat. Just fold the glue tabs all the way in an glue the top to the bottom. Just remember not to glue the rouded dust flaps.",
          "tags": [
            "Professional",
            "Paper Craft",
            "Gift",
            "Decoration"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "gemstone",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "8502cef5"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "065ca667"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "5f3bbcfc"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3785373f"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f359c7fe"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "bcab4a77"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "bec47f13"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "741fa643"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "0840b8ae"
              }
            },
            "parameters": {
              "N": {
                "name": "Number of sides",
                "symbol": "N",
                "value": 6,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "e9ee4b58"
              },
              "D": {
                "name": "Diameter",
                "symbol": "D",
                "value": 100,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fbf2fbcb"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 150,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f42199ef"
              }
            },
            "options": {
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "edb057aa"
              },
              "DUST": {
                "name": "Dust Flap Size",
                "symbol": "DUST",
                "value": 7,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3dcabb48"
              },
              "FILLET": {
                "name": "Rounded Corners Radius",
                "symbol": "FILLET",
                "value": 7,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "77e83cbb"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "5d5bcb88"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f82e8a1c"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a4ca2750"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5edf75fa"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "57db372d"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ca1fd722"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1f1f490a"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "caf7967d"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "27084020"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "9e02f22f"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "01ca1fc5"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6987cb0f"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f316496a"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "861fb4f6"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3687f302"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "giftbox": {
          "id": "giftbox",
          "name": "Gift Box",
          "description": "A typical, straight-forward gift box. This box is very similar to the Card Box, but the layout is different. This template makes most efficient use of your sheet of paper if the dimensions are close to eachother. Templatemaker will try to correct impossible values automatically. Be aware of this if, for example, the thumbhole is smaller then you expect.",
          "tags": [
            "Proffesional",
            "Box",
            "Packaging"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "giftbox",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "2c9a0013"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b4695872"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "fe275a09"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c2d57197"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c0ca3e5d"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "304e0f30"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1ba43350"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "caa6ba8f"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "b6ac02e4"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 50,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a4784565"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c7f0f31a"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 60,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c30c66c1"
              }
            },
            "options": {
              "THUMB": {
                "name": "Thumb Hole Diameter",
                "symbol": "THUMB",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7c3a21a8"
              },
              "TUCK": {
                "name": "Tuck Flap Size",
                "symbol": "TUCK",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "723462d5"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "59ab4f80"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 80,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "4a84a47d"
              },
              "T": {
                "name": "Material thickness Allowance",
                "symbol": "T",
                "value": 1,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "db86f934"
              },
              "R": {
                "name": "Rounded Corners Radius",
                "symbol": "R",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0704ea68"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8eecfbf5"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "3d38df27"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8eecfbf5"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fbfa129b"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a91e2148"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "efaa001f"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "496b9f3d"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e52d1347"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5ece98e8"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "2a1e9647"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "d56c95f8"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "b9426fb7"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d11a3714"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "298244df"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "20047373"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a1011aa1"
              }
            }
          },
          "gallery": [
            "example.jpeg",
            "example2.jpg"
          ],
          "snippets": [],
          "model": true
        },
        "heart": {
          "id": "heart",
          "name": "Heart Shaped Box",
          "description": "The measurements are different to standard boxes because of the way the heart is modelled. It is made from an ellipse, which is rotated, cut in half vertically and then mirrored.<br/><br/> The \u201CLength\u201D measures between the two sharp corners of the heart. The width is calculated by the program to match the rotation (tilt) and shape of the ellipse. (Think of the shape as the \u201DBody Mass Index\u201D of the heart). <br/><br/> The box consists of a base and a lid. Each part has two heart shaped \u201Ccaps\u201C: the smallest one goes on the inside, the larger one goes on the outside to conceal the ugly-looking glue flaps. It\u2018s easiest to glue the heart-shaped caps instead of the glue flaps. The \u201DPaper Thickness\u201D parameter is only used for making the outside hearts larger then the inside.",
          "tags": [
            "Paper Craft",
            "Box",
            "Packaging"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "heart",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "34ed3d7c"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ca6293da"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "62ba996b"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "96fcc123"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f3275ded"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "5667567d"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f836034c"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "a36ff29f"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "fe24ea43"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 100,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the heart, measured vertically exactly in the middle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "541fe054"
              },
              "CP": {
                "name": "Shape",
                "symbol": "CP",
                "value": 55,
                "expression": "",
                "type": "percentage",
                "dirty": false,
                "tooltip": null,
                "minval": 25,
                "maxval": 100,
                "uuid": "bedbc745"
              },
              "PHI": {
                "name": "Tilt",
                "symbol": "PHI",
                "value": 45,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": "",
                "minval": -360,
                "maxval": 360,
                "uuid": "001ae0e1"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Height of the base of the box",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7b711f67"
              },
              "LID": {
                "name": "Lid Height",
                "symbol": "LID",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Height of the lid of the box",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4783c371"
              },
              "T": {
                "name": "Extra Offset for Caps",
                "symbol": "T",
                "value": 1,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Draw the outside caps a bit bigger",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "bc5d3170"
              }
            },
            "options": {
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d332f6a9"
              },
              "ANGLEGLUE": {
                "name": "Glue Flap Angle",
                "symbol": "ANGLEGLUE",
                "value": 60,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "cf0bf08a"
              },
              "N": {
                "name": "Number of Glue Tabs",
                "symbol": "N",
                "value": 26,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": 1,
                "maxval": 40,
                "uuid": "81dbfd17"
              },
              "CLEAR": {
                "name": "Clearance",
                "symbol": "CLEAR",
                "value": 3,
                "expression": "",
                "type": "percentage",
                "dirty": false,
                "tooltip": null,
                "minval": -1e3,
                "maxval": 1e3,
                "uuid": "6bc90937"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "9a408418"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fbdd0f10"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "438baa3d"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f7faffd3"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "665da1b4"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d8d7b89a"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "61bdefb3"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0186e899"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "8794db66"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "8c6e1cdf"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "4d873ff4"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a94b5511"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f5fce136"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "c6bd697f"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c3e65a42"
              }
            }
          },
          "gallery": [
            "IMG_9666.jpg",
            "IMG_9687.jpg",
            "heart_geometry.jpg",
            "instructions.gif"
          ],
          "snippets": [],
          "model": true
        },
        "mailer": {
          "id": "mailer",
          "name": "Mailer",
          "description": "The mailer is an extra thick envelop that can be used to pack items that\n are flat, but thicker then just a sheet of paper. It can hold, for example,\n a pile of cards of a bag of flower seeds. Use a piece of sticky tape\n to keep the cover in place.",
          "tags": [
            "Proffesional",
            "Box",
            "Packaging",
            "Paper Craft"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "mailer",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "e4c06540"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "dcaef4cf"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "e63ba6b1"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "29018faa"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ad86cf71"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "c1880136"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f84d3f44"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "9a7de9bf"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "379acda6"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 154,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3f704a68"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 110,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "003a39de"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "be46bf6a"
              }
            },
            "options": {
              "T": {
                "name": "Paper Thickness",
                "symbol": "T",
                "value": 2,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b2704e20"
              },
              "O": {
                "name": "Overlap",
                "symbol": "O",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ad79c8dc"
              },
              "R": {
                "name": "Rounded Corners Radius",
                "symbol": "R",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "60284e91"
              },
              "DUST": {
                "name": "Dust Flap Size",
                "symbol": "DUST",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7a8ea7d4"
              },
              "ANGLE": {
                "name": "Dust Flap Angle",
                "symbol": "ANGLE",
                "value": 80,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "3ad80293"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "72cdef32"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "119ccb10"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a13d5e16"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7cc6137b"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "af4ee1e6"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "af7a16e9"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1eec663b"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e3552eac"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "b7254070"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "3de284fe"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "a7b97f05"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0da85c99"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b0f01104"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "9831284e"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3b2251f9"
              }
            }
          },
          "gallery": [
            "example1.jpg",
            "example2.jpg"
          ],
          "snippets": [],
          "model": true
        },
        "matchbox": {
          "id": "matchbox",
          "name": "Match Box",
          "description": "A simple Tray and Sleeve Box. The dimensions are inner dimensions. The clearance is added twice and to both the height and  width. The tray can be assembled without glue, although a little glue won\u2018t hurt, of course.",
          "tags": [
            "Packaging",
            "Box",
            "Hobby"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "matchbox",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "065cdcd5"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "07157da3"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "f49ab011"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "83dde098"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c82c0af6"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "6ae9fe7a"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "67b03dcb"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "aa0296bb"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "699b81fb"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 70,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "69098816"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "bdd4d2e4"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a53a6819"
              },
              "T": {
                "name": "Material Thickness",
                "symbol": "T",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d0401427"
              },
              "C": {
                "name": "Clearance",
                "symbol": "C",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d617ccfd"
              }
            },
            "options": {
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b6838505"
              },
              "ANGLEGLUE": {
                "name": "Glue Flap Angle",
                "symbol": "ANGLEGLUE",
                "value": 85,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "d876398d"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "2dc461fa"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fa581ab2"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a6031af0"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b35d3221"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "45e5d3d2"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d4a8e8bd"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "daca8edc"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b8f45da4"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "270451ef"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "b307a26c"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "c07ab0fb"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "864cfcd2"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0e6ba1b6"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "fab17bda"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4d328abf"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "milkcarton": {
          "id": "milkcarton",
          "name": "Milk Carton",
          "description": "Tube-shaped box with a gusseted opening. This model will not be water tight if you make it at home, though!",
          "tags": [
            "Professional",
            "Packaging",
            "Paper Craft",
            "Gifts"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "milkcarton",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "5abc358e"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ad04633b"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "8ffca21b"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2bdaeb9b"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4afb5104"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "3b70ac82"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "18968027"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "b3f80c1c"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "685527c0"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 100,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f140424b"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 80,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "25ff175d"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 140,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "57be3e2f"
              },
              "ROOF": {
                "name": "Roof Height",
                "symbol": "ROOF",
                "value": 25,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8c476b2c"
              },
              "FLAP": {
                "name": "Top Flap",
                "symbol": "FLAP",
                "value": 18,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f18014fa"
              },
              "R": {
                "name": "Rounded Corners Radius",
                "symbol": "R",
                "value": 8,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9822ef5e"
              }
            },
            "options": {
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "daa1c046"
              },
              "OVERLAP": {
                "name": "Overlap",
                "symbol": "OVERLAP",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a69b7873"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "175bb895"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9f4da9ca"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8f238a3e"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ba4ddf6d"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7ea6dd87"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ef2ab1d9"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d79809cb"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "beea16c3"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "db96a615"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "3a2b99d8"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "316384bd"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "bb2bfb7c"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5cb0ba1a"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "ada3b30e"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d83fe6a6"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "miter": {
          "id": "miter",
          "name": "Cylinder with mitered ends",
          "description": "Tube, pipe, cylinder, toilet roll core, optionally \u2018mitered\u2019 or truncated at an angle. With default settings, this template gives a standard toilet roll. (At least, the default size here in the Netherlands) You can also choose to have a \u2018mitered\u2019 cylinder, with different miter-angles for the top and the bottom and with a twist between these two. Use these settings if you need to create tubes that are welded (or glued) together at an angle.",
          "tags": [
            "Math",
            "Education",
            "Shape",
            "Geometric",
            "Engineering",
            "Ceramics",
            "Paper Craft"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "miter",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "5bc8e4b1"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1fdae54c"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "f8cc31f9"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "56e2e4e3"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "46505fdf"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "53adccb2"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cd35bff0"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "2e58aa73"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "5dba666b"
              }
            },
            "parameters": {
              "D": {
                "name": "Diameter",
                "symbol": "D",
                "value": 45,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cda3fdcf"
              },
              "ALPHA_TOP": {
                "name": "Top miter angle",
                "symbol": "ALPHA_TOP",
                "value": 45,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "245bf5d9"
              },
              "ALPHA_BOT": {
                "name": "Bottom miter angle",
                "symbol": "ALPHA_BOT",
                "value": 20,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "7c5edd87"
              },
              "BETA": {
                "name": "Twist",
                "symbol": "BETA",
                "value": 60,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "16e27981"
              },
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 90,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f8c0aa90"
              }
            },
            "options": {
              "N": {
                "name": "Segments (how precise?)",
                "symbol": "N",
                "value": 36,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2a39513e"
              },
              "G": {
                "name": "Number of Glue tabs",
                "symbol": "G",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "af528dd2"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 7,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5bf1f0ae"
              },
              "ANGLEGLUE": {
                "name": "Glue Flap Angle",
                "symbol": "ANGLEGLUE",
                "value": 45,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "020eff38"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "78b6157b"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3ae3efa6"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a17916f7"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4f12443c"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "21d0ded3"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "395d9190"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "632ba572"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b646fa70"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "1d03e3d7"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "ab00d022"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "e06ea4be"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cb49cef0"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4f80f4eb"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "50d19007"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d1b68b35"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "multisheetbox": {
          "id": "multisheetbox",
          "name": "Multi Sheet Box",
          "description": "How annoying that a sheet the size of an A4 or a Letter is so small, isn\u2018t it? This template allows you to construct much larger boxes by using 6 separate sheets. It takes a bit more glue but you can make a much more impressive box! Use some sturdy material. You might use scavange some old cereals boxes or pizza boxes. Be aware that your desktop printer might need some \u201Dconvincing\u201D to accept these.",
          "tags": [
            "Paper Craft",
            "Box",
            "Packaging"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "multisheetbox",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "06739667"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b4e24275"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "c655d10c"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "848f8260"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e31cf07b"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "a3069326"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "200acb3d"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "3aea6cfc"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "6b05997f"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 150,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "627be86e"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 100,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1ac6acb2"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9ea8756d"
              },
              "T": {
                "name": "Paper Thickness",
                "symbol": "T",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4e69fde2"
              }
            },
            "options": {
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 12,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "83e14036"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 45,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "b68ae01f"
              },
              "TUCK": {
                "name": "Tuck Flap Size",
                "symbol": "TUCK",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b78331b6"
              },
              "DUST": {
                "name": "Dust Flap Size",
                "symbol": "DUST",
                "value": 25,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2100a783"
              },
              "DIAMETER": {
                "name": "Thumb Hole Diameter",
                "symbol": "DIAMETER",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d6cc6e06"
              },
              "R": {
                "name": "Rounded Corners Radius",
                "symbol": "R",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "815c58e2"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "5c485953"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "436b1602"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "559d6c6e"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "04cb21fa"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cee68e9d"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1839aa7b"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "deab04e6"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "25ac6556"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "66fe1b27"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "75a21f69"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "60dd43db"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b13367bc"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "aad9cf8a"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "e4042487"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fb510684"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "nestable-tray": {
          "id": "nestable-tray",
          "name": "Nestable Tray",
          "description": "A basic tray with glued sides and a draft angle. Use 0\xBA if you want a straight sides, but use a larger value if you want trays that can be stacked into eachother. <br/><br/> The length and width are measured at the top, so when you use a non-zero draft angle, the dimensions at the bottom will be smaller. <br/><br/> Because of the draft angle, the trays can be nested. This makes this model ideal as an organizer for storing small items. LEGO\xAE, for example.<br/><br/> If you choose a too large value for the draft angle or a too small value for the height, the draft angle will be adjusted.",
          "tags": [
            "Proffesional",
            "Box",
            "Packaging",
            "Paper Craft",
            "Geometric"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "nestable-tray",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "7162e15a"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "68565478"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "c29a343b"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a1707e9c"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "99685e24"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "6522fef8"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d249820d"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "b6163124"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "7750e5e1"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 148,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "01d648fc"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 105,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6e8d9605"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 74,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "12d72410"
              },
              "DRAFT": {
                "name": "Draft Angle",
                "symbol": "DRAFT",
                "value": 5,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 30,
                "uuid": "0bfc3aeb"
              }
            },
            "options": {
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 8,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "974a8f4f"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 80,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "708501d3"
              },
              "T": {
                "name": "Material Thickness",
                "symbol": "T",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "dfbfdda6"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "58214bea"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4f6ee813"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "64cc74dc"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7913af80"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "08f6ea0c"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9e289f50"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6dfac64e"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3b04f8b7"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "f51ebde6"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "10c8989c"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "4aa29b1d"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "527e900b"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a463d6b2"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "e6368874"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "72762e60"
              }
            }
          },
          "gallery": [
            "IMG_0004.jpeg",
            "IMG_0005.jpeg",
            "IMG_0006.jpeg"
          ],
          "snippets": [],
          "model": true
        },
        "parallelepiped": {
          "id": "parallelepiped",
          "name": "Parallelepiped",
          "description": "A three-dimensional figure formed by six parallelograms. This model can also be used to create a simple brick shape or a dice (cube). In that case, keep the angles at 90\xBA.",
          "tags": [
            "Educational",
            "Shape",
            "Paper Craft",
            "Geometry"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "parallelepiped",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "1be0989d"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ffdb476b"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "128fe32c"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "735aabf0"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c76b813f"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "d6294481"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e9889ec4"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "c8915e52"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "64727196"
              }
            },
            "parameters": {
              "A": {
                "name": "Length",
                "symbol": "A",
                "value": 60,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3ea62f6a"
              },
              "B": {
                "name": "Width",
                "symbol": "B",
                "value": 75,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "01071434"
              },
              "C": {
                "name": "Height",
                "symbol": "C",
                "value": 120,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "949a5590"
              },
              "An_A": {
                "name": "\u03B1 \u2014 Angle Alpha",
                "symbol": "An_A",
                "value": 80,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "7ef4988f"
              },
              "An_B": {
                "name": "\u03B2 \u2014 Angle Beta",
                "symbol": "An_B",
                "value": 70,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "0a797d6f"
              },
              "An_C": {
                "name": "\u03B3 \u2014 Angle Gamma",
                "symbol": "An_C",
                "value": 60,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "0c8b1c9c"
              }
            },
            "options": {
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "bee3e211"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 45,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "b8c10524"
              },
              "DUST": {
                "name": "Dust Flap Size",
                "symbol": "DUST",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f802c4bc"
              },
              "TUCK": {
                "name": "Tuck Flap Size",
                "symbol": "TUCK",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8eab15d0"
              },
              "T": {
                "name": "Material Thickness",
                "symbol": "T",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8a4276d8"
              },
              "THUMB": {
                "name": "Thumbhole Diameter",
                "symbol": "THUMB",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ccce0219"
              },
              "R": {
                "name": "Rounded Corner Radius",
                "symbol": "R",
                "value": 7,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9f65e2e6"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "63402558"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ca99dafb"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "dff8cae8"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a13d5795"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f07c3942"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8b132aeb"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5fbb1a29"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e6671076"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "f8e12fe3"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "a754436d"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "9ba42a00"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "31bcd415"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "59fd7f5d"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "0239dc75"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5fa0d613"
              }
            }
          },
          "gallery": [
            "example2.jpg"
          ],
          "snippets": [],
          "model": true
        },
        "passepartout": {
          "id": "passepartout",
          "name": "Passepartout",
          "description": "Passepartout, Photo Frame or Shadow Box. Glue-less, hollow, double-walled tray. Create a photo frame for your photo\u2018s with a posh, wide and deep frame. Enter the dimension of the \u201Cinner space\u201C (the size of the picture or object to display), together with how thick and wide you\u2018d like the border of the frame to be. The eventual model will be larger, because of the width of border of the frame. The model can be constructed without using glue, although a bit of glue won\u2018t hurt.",
          "tags": [
            "Paper Craft",
            "Decoration"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "passepartout",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "3cbb5671"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "15bb28d7"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "810143d9"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6807b17e"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c2bd671a"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "6b6edc90"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a2344240"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "75159aaa"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "66394af2"
              }
            },
            "parameters": {
              "LENGTH": {
                "name": "Picture Length",
                "symbol": "LENGTH",
                "value": 150,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "83b633a4"
              },
              "WIDTH": {
                "name": "Picture Width",
                "symbol": "WIDTH",
                "value": 100,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7af11fc1"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e6303296"
              },
              "F": {
                "name": "Frame Width",
                "symbol": "F",
                "value": 25,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ff37f04a"
              },
              "D": {
                "name": "Frame Depth",
                "symbol": "D",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fa5e6ea3"
              }
            },
            "options": {
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a080ff9d"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 80,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "5a540a40"
              },
              "T": {
                "name": "Material thickness",
                "symbol": "T",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "10c4b895"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "4bcdfaa2"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9a5f7cea"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0bbe9ef7"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "086de20e"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "02ff2db0"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8fb41fd4"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4fb5a4df"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e665fbac"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "65e0cb69"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "7252d56f"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "2c71528a"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "79d21cb4"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "660d3ee9"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "5e7c4854"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d58acced"
              }
            }
          },
          "gallery": [
            "IMG_6109.jpg",
            "IMG_6123.jpg",
            "example1.jpg"
          ],
          "snippets": [],
          "model": true
        },
        "pillowpack": {
          "id": "pillowpack",
          "name": "Pillow Pack",
          "description": "A simple, economic yet charming shape for packing items like vouchers, jewelry or clothing. Do not make the pillow pack too thick, or the paper will tear when you fold the ends\uFE55 keep the width at least twice as long as the height. Once folded, the width and length will be slightly smaller then the values you entered because of the curvature of the cardboard.",
          "tags": [
            "Proffesional",
            "Box",
            "Packaging",
            "Gift"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "pillowpack",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "ddc8a478"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cc71cf9f"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "4042fe0a"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c6923039"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1e78f49f"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "26f33c3a"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8b3a7ccc"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "536a14c8"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "e3e0a05d"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 80,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fd20b588"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 70,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7e086bf3"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0f3ea8db"
              }
            },
            "options": {
              "THUMB": {
                "name": "Thumb Hole Diameter",
                "symbol": "THUMB",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2e6a27fc"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "07c40840"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "12862542"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "69609645"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "377a5233"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "604ce1f8"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b17bfc19"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4cfdf184"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4c758c17"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a8a2e657"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "700ecaf8"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "17db6447"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "138dc4a5"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "65d77959"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f39059d7"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "93852271"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d237abdd"
              }
            }
          },
          "gallery": [
            "example1.jpg",
            "example2.jpg",
            "example3.jpg"
          ],
          "snippets": [],
          "model": true
        },
        "polygon": {
          "id": "polygon",
          "name": "Polygonal Box",
          "description": "Tube-shaped (or prismatic), polygonal box with gusseted, integrated lid. The lid uses both mountain and valleys folds. The glue tabs on the bottom fit together precisely. The lid will fold easier if you remove some material from the place where the five fold lines meet. (The model does not work for 3 or less sides)",
          "tags": [
            "Paper Craft",
            "Box",
            "Packaging",
            "Geometric"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "polygon",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "b78f1c0e"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "750a8c6f"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "cecc0dc2"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c5ece76b"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fa4a3f3d"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "2bf55502"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d26f84c4"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "37e3cf74"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "d4d75b28"
              }
            },
            "parameters": {
              "D": {
                "name": "Inner Diameter",
                "symbol": "D",
                "value": 60,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "544bd77e"
              },
              "N": {
                "name": "Number of sides",
                "symbol": "N",
                "value": 6,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "be064e19"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 90,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4e8bb221"
              }
            },
            "options": {
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 8,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f7f1dd94"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 80,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "861da900"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "ec83613c"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c8b1507d"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a83dcc37"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "596a4c0d"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f25ff719"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0160c16c"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8d7bb63f"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "01408913"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "13cc4f67"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "87bf81ae"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "4666edc7"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "dab8a7f9"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1e8812f9"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "37790339"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d8aec6ab"
              }
            }
          },
          "gallery": [
            "example190.jpg",
            "example213.jpg"
          ],
          "snippets": [],
          "model": true
        },
        "polygon-lid": {
          "id": "polygon-lid",
          "name": "Polygonal Shaped Box with Lid",
          "description": "This is a prismatic box with a regular polygon as a base. The dimensions determine the geometry of the base. The clearance determines how much the lid is scaled.",
          "tags": [
            "Paper Craft",
            "Box",
            "Packaging",
            "Geometric"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "polygon-lid",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "b4cd0313"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "dcf64a62"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "abf15ffd"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "354ad378"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c194e845"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "dfcfbdb9"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fb54914c"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "8b8180ad"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "4567ac9c"
              }
            },
            "parameters": {
              "D": {
                "name": "Inner Diameter",
                "symbol": "D",
                "value": 60,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9154dd97"
              },
              "N": {
                "name": "Number of sides",
                "symbol": "N",
                "value": 6,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "cf19324e"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 90,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cf48a093"
              },
              "LID": {
                "name": "Lid Height",
                "symbol": "LID",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "82def207"
              },
              "CLEAR": {
                "name": "Clearance (percentage)",
                "symbol": "CLEAR",
                "value": 5,
                "expression": "",
                "type": "percentage",
                "dirty": false,
                "tooltip": null,
                "minval": -1e3,
                "maxval": 1e3,
                "uuid": "0c9531db"
              }
            },
            "options": {
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 8,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "509693d3"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 80,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "9f42e150"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "0160a90d"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ef9471ea"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8a5b826d"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "95746efc"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "009818d6"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "809040e5"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "dac092fe"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "44241393"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "8f138ae1"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "f0cdf86c"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "e688f065"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9f1a09bf"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "398c0454"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "f801252d"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "398ea361"
              }
            }
          },
          "gallery": [
            "example_1126.jpg"
          ],
          "snippets": [],
          "model": true
        },
        "polygonal-pyramid": {
          "id": "polygonal-pyramid",
          "name": "Polygonal Pyramid",
          "description": "A pyramid shape with custom height and a regular polygon as base.",
          "tags": [
            "Math",
            "Education",
            "Shape",
            "Geometric",
            "Engineering"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "polygonal-pyramid",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "a294d9de"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2a392c0d"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "762c73dd"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c8b1db42"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "541669de"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "977e9d0b"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "94ddbac3"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "394b02fc"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "87a2a1dd"
              }
            },
            "parameters": {
              "D": {
                "name": "Outer Diameter",
                "symbol": "D",
                "value": 100,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "10cb3b8a"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 60,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e3f943b8"
              },
              "N": {
                "name": "Number of sides",
                "symbol": "N",
                "value": 7,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": 3,
                "maxval": 20,
                "uuid": "c3b08342"
              }
            },
            "options": {
              "ANGLEGLUE": {
                "name": "Glue Flap Angle",
                "symbol": "ANGLEGLUE",
                "value": 45,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "a327d4ab"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 7,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6e807a22"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "17d73092"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8007dcfd"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5b993ef9"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "15ba668b"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c34a2579"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5245cb33"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8a3e845d"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9742595e"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "74eba402"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "6a9de5d0"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "2071204b"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "de383a97"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "96d2517b"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "c892684f"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "feea3cbb"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "pyramid": {
          "id": "pyramid",
          "name": "Pyramid-shaped box",
          "description": "A box in the shape of a pyramid. The base of the shapes functions as the lid, so to open it, you would hold it downside up. (The default values yield a pyramid in the same ratio as the Cheops pyramid)",
          "tags": [
            "Educational",
            "Shape",
            "Paper Craft",
            "Geometry"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "pyramid",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "d29850f1"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "86b1a6b6"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "dd37dae8"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a4a5ee32"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f0c1720e"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "89ceba39"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "965e534b"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "504cd06a"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "307f8d8b"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 115,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "726eff36"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 115,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "73c40c4e"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 73.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d9db6d15"
              }
            },
            "options": {
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "082f1f4c"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 45,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "7e7ba720"
              },
              "TUCK": {
                "name": "Tuck Flap Size",
                "symbol": "TUCK",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6537d765"
              },
              "R": {
                "name": "Rounded Corners Radius",
                "symbol": "R",
                "value": 7,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f55a5324"
              },
              "THUMB": {
                "name": "Thum Hole",
                "symbol": "THUMB",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ab4a33eb"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "a73f617d"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "00b25c53"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "97abc1cb"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9328339a"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "106b6895"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0f445953"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c8bb0fcb"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a3d9e8ff"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "4c52a10c"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "d07d2210"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "d7ff0821"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "56639eb4"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "077b7a02"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "bbf6a510"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "35ad08a2"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "rhombus": {
          "id": "rhombus",
          "name": "Rhombus Shaped Box with Lid",
          "description": "Rhombus (lozenge, or lop sided), prismatic box with lid. The box consist of a base and a lid. The dimensions are given for the base. The lid will be scaled with the given percentage (clearance).",
          "tags": [
            "Proffesional",
            "Box",
            "Packaging",
            "DIY",
            "Paper Craft",
            "Geometric"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "rhombus",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "6ee66aa5"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "af174ffd"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "f944d46c"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "61ed6981"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ba781a93"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "786b6c13"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ac86d6e9"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "a2f28fb6"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "14a88187"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 80,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8684d1e8"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 60,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f7e9e83f"
              },
              "A": {
                "name": "Angle",
                "symbol": "A",
                "value": 45,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "231c0eb2"
              },
              "LID": {
                "name": "Lid Height",
                "symbol": "LID",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1e2efc1d"
              }
            },
            "options": {
              "C": {
                "name": "Clearance (percentage)",
                "symbol": "C",
                "value": 7,
                "expression": "",
                "type": "percentage",
                "dirty": false,
                "tooltip": null,
                "minval": -1e3,
                "maxval": 1e3,
                "uuid": "a1a831af"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 15,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "39f42db3"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 85,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": 1,
                "maxval": 90,
                "uuid": "a8cb5410"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "08d054f1"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "14cf774a"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9afad5fe"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ffb0a9b7"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ab2dbff9"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "87500f30"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f65c06de"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "58552fd0"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "585e6137"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "44808431"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "883bc39c"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e1f65f97"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e25430ec"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "927c112b"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "bbd5340b"
              }
            }
          },
          "gallery": [
            "example.jpg"
          ],
          "snippets": [],
          "model": true
        },
        "round": {
          "id": "round",
          "name": "Round box",
          "description": "A round, cylindrical box. The caps consist of two circular layers each, one on the inside and one one the outside, with the glue flaps sandwiched between them. The one on the outside is slightly larger than the given diameter in order to neatly cover the base and the lid. The shafts can be closed by sliding the slits at the ends inside each other. Adjust the extra size of the outside lids by changing the Paper Thickness.",
          "tags": [
            "Decoration",
            "Paper Craft",
            "Gift"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "round",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "bf32ef0b"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b841369d"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "1974e88f"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ca973292"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0c0ea698"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "de5de4bf"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e9a5f6c9"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "ff0774a2"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "c915e0e1"
              }
            },
            "parameters": {
              "D": {
                "name": "Diameter",
                "symbol": "D",
                "value": 80,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "45c03cc6"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 60,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d370c227"
              },
              "LID": {
                "name": "Lid Height",
                "symbol": "LID",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b37bb947"
              }
            },
            "options": {
              "C": {
                "name": "Clearance (percentage)",
                "symbol": "C",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "df487c17"
              },
              "N": {
                "name": "Number of Glue tabs",
                "symbol": "N",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "92ebac5b"
              },
              "ANGLEGLUE": {
                "name": "Glue Flap Angle",
                "symbol": "ANGLEGLUE",
                "value": 85,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "dcc237a4"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cb81b0da"
              },
              "T": {
                "name": "Paper Thickness",
                "symbol": "T",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6f80e304"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "70593109"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9a313d61"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ec3df71c"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e4c4ab4b"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8f158791"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "23a40321"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "883edefd"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d672d087"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "25ccf2ff"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "cf7466fb"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "9a01f724"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7932881b"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "11ca32e0"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "fa3429f0"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6727f4c0"
              }
            }
          },
          "gallery": [
            "_MG_2790.jpg",
            "_MG_2792.jpg"
          ],
          "snippets": [],
          "model": true
        },
        "shallowbox": {
          "id": "shallowbox",
          "name": "Shallow Box",
          "description": "A simple box like the Card Box and the Gift Box. This template is very economical for boxes that have small height compared to both the width and the height, for example a box for a tart or a pizza. Templatemaker.nl will try adjust \u201Cimpossible\u201D values, be aware of this when, for example, the thumb hole or glue flaps have dimensions that you don't expect.",
          "tags": [
            "Proffesional",
            "Box",
            "Packaging"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "shallowbox",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "7cc45f39"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "49228ff6"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "36285805"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5f15beb6"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2037f8e2"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "f7eeb9c6"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d8c3d776"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "ec38c070"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "bd9d8563"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 150,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9c4f081f"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 100,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "82449965"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b81a4cef"
              }
            },
            "options": {
              "DUST": {
                "name": "Dust flap size",
                "symbol": "DUST",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "88d204d3"
              },
              "THUMB": {
                "name": "Thumb Hole Diameter",
                "symbol": "THUMB",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9ee2c76f"
              },
              "TUCK": {
                "name": "Tuck Flap Size",
                "symbol": "TUCK",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4e1190fd"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0f8e4573"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 85,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "17b81d2f"
              },
              "T": {
                "name": "Material Thickness ",
                "symbol": "T",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f8197a72"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "cdd04e70"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "df0e1bd1"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "67a4dd33"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9c271cf4"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "a933a85a"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "17e4ff55"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2f4ef215"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "57aed601"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "a3ab9d5e"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "974824ad"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "681ad5ca"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7783f8af"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "30bf600a"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "4e0e6e59"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "540d5fc6"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "starbox": {
          "id": "starbox",
          "name": "Star Shaped Box",
          "description": "Have you ever dreamed of just sprinkling stars? \u2728Now you can, and you can even hide a present in them! The folds are a bit origami-like, score them well and make sure the star is reasonably thick. \u201C5\u201C Is the ideal number of points, but fewer or more is certainly possible. Shine!",
          "tags": [
            "Decorative",
            "Box",
            "Packaging",
            "Professional",
            "Paper Craft"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "starbox",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "6fc95a13"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "21fa59f9"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "eb40711f"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f1cb9d3a"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "65eeb9c5"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "ca11ee0d"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b40c60cc"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "89842e13"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "81a83bb3"
              }
            },
            "parameters": {
              "D2": {
                "name": "Outer Diameter",
                "symbol": "D2",
                "value": 140,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "02374178"
              },
              "THICKNESS": {
                "name": "Height",
                "symbol": "THICKNESS",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fcd162e8"
              },
              "N": {
                "name": "Number of points",
                "symbol": "N",
                "value": 5,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "135e67cc"
              },
              "H": {
                "name": "Cord Hole Diameter",
                "symbol": "H",
                "value": 7,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4ed2d9ab"
              }
            },
            "options": {},
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "8ed3cd7f"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7d5d3207"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4837570b"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "aba40429"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3c2cd211"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "02dec383"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c0740247"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c5681d8a"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "560e38a8"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "57521d29"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "20de91fe"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7d8a646e"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6685b150"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "5015cc0f"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "04c81a22"
              }
            }
          },
          "gallery": [
            "IMG_6141.jpg"
          ],
          "snippets": [],
          "model": true
        },
        "trapezoid": {
          "id": "trapezoid",
          "name": "Trapezoid Box",
          "description": "The Trapezoid Box is a typical chocolate box. It also possible to have the top smaller then the base, or two have the top smaller then the base in one direction, but larger in the other.",
          "tags": [
            "Proffesional",
            "Box",
            "Packaging",
            "Paper Craft",
            "Geometric"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "trapezoid",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "d74d98bd"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "bd109cc9"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "45e6cab4"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fac75f9a"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6a9a950b"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "a80d4213"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "3d9a7590"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "be83da8c"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "2c2b6a80"
              }
            },
            "parameters": {
              "L_t": {
                "name": "Top Length",
                "symbol": "L_t",
                "value": 70,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0f9b48e0"
              },
              "L_b": {
                "name": "Bottom Length",
                "symbol": "L_b",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d083eb80"
              },
              "W_t": {
                "name": "Top Width",
                "symbol": "W_t",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9d3bc74c"
              },
              "W_b": {
                "name": "Bottom Width",
                "symbol": "W_b",
                "value": 30,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c74109c6"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "16b58a3a"
              }
            },
            "options": {
              "TH": {
                "name": "Thumb Hole Diameter",
                "symbol": "TH",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b0d7f08d"
              },
              "TUCK": {
                "name": "Tuck Flap Size",
                "symbol": "TUCK",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4e2bc1f5"
              },
              "GLUE": {
                "name": "Glue Flap Size",
                "symbol": "GLUE",
                "value": 8,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "5f431e03"
              },
              "GLUEANGLE": {
                "name": "Glue Flap Angle",
                "symbol": "GLUEANGLE",
                "value": 80,
                "expression": "",
                "type": "angle",
                "dirty": false,
                "tooltip": null,
                "minval": -360,
                "maxval": 360,
                "uuid": "34d9a737"
              },
              "DUST": {
                "name": "Dust Flap Size",
                "symbol": "DUST",
                "value": 15,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1cefa1d8"
              },
              "RAD": {
                "name": "Rounded Corners Radius",
                "symbol": "RAD",
                "value": 7,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cbd7cf08"
              },
              "T": {
                "name": "Material Thickness",
                "symbol": "T",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b100ec28"
              }
            },
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "98b98830"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7e9d4ad4"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "281bbc3d"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "823f44ab"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0fdcbdc1"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "adaa3686"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "86f60013"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "76e6d528"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "d56ed006"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "82acd314"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "8476f629"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ddaf1f7b"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "866d7d9f"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "da95a905"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "8f9139d5"
              }
            }
          },
          "gallery": [
            "IMG_6039.jpg"
          ],
          "snippets": [],
          "model": true
        },
        "tray-insert-rectangle": {
          "id": "tray-insert-rectangle",
          "name": "Tray Insert",
          "description": "Box insert for thin items. Use this template to create a box insert that locks an item safely in the center of a box. It leaves some extra space for a thumb hole, so it\u2019s easy to retrieve it.",
          "tags": [],
          "metrics": [],
          "validations": [],
          "MODEL": "tray-insert-rectangle",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "53cab4d5"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ef24faf6"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "5b688254"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "1781cf53"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fce0e62d"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "d37664bb"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d6967e37"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "252bd784"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "fcc20504"
              }
            },
            "parameters": {
              "L": {
                "name": "Length",
                "symbol": "L",
                "value": 210,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ee830150"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 160,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9618db76"
              },
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 50,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "043faaf3"
              },
              "ITEMLENGTH": {
                "name": "Item Length",
                "symbol": "ITEMLENGTH",
                "value": 150,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "00535ce9"
              },
              "ITEMWIDTH": {
                "name": "Item Width",
                "symbol": "ITEMWIDTH",
                "value": 90,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "060f1d78"
              },
              "ITEMHEIGHT": {
                "name": "Item Height",
                "symbol": "ITEMHEIGHT",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0f7404ec"
              },
              "T": {
                "name": "Material Thickness",
                "symbol": "T",
                "value": 2,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "b3d0382c"
              },
              "THUMBWIDTH": {
                "name": "Thumb Hole Width",
                "symbol": "THUMBWIDTH",
                "value": 20,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2dbfe569"
              },
              "THUMBLENGTH": {
                "name": "Thumb Hole Length",
                "symbol": "THUMBLENGTH",
                "value": 50,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "926aad9b"
              }
            },
            "options": {},
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "e8309ad2"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0b5eccad"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "2fbb24ed"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e0942a56"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "906e2d38"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "75c9de1e"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6a9128c7"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c5df894c"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "c0b1f27c"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "5ff8d9f6"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "161bcb18"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cd05d264"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "c32a4240"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "e8a6b3cc"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "ec00050c"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        },
        "wrapper": {
          "id": "wrapper",
          "name": "Wrapper",
          "description": "Warpper around a brochure.",
          "tags": [
            "proffesional",
            "stationary",
            "flat"
          ],
          "metrics": [],
          "validations": [],
          "MODEL": "wrapper",
          "CUSTOMER": "whisqu",
          "action": "//templatemaker-dev.signcut.com/",
          "parameters": {
            "standard": {
              "UNITS": {
                "name": "Units",
                "symbol": "UNITS",
                "value": "mm",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "mm": "mm",
                  "cm": "cm",
                  "inch": "inch"
                },
                "uuid": "87de01ae"
              },
              "MARGIN": {
                "name": "Margin",
                "symbol": "MARGIN",
                "value": 10,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "99808430"
              },
              "PAGEPRESET": {
                "name": "Page Size",
                "symbol": "PAGEPRESET",
                "value": "Auto",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "Auto": "Fit page to drawing",
                  "Custom": "Custom: you decide.",
                  "A4": "A4 Portrait (210 x 297 mm )",
                  "A4L": "A4 Landscape (297 x 210 mm )",
                  "Letter": "US Letter Portrait (8.5 x 11 inch)",
                  "LetterL": "US Letter Landscape (11 x 8.5 inch)",
                  "A3": "A3 Portrait ( 297 x 420 mm)",
                  "A3L": "A3 Landscape (410 x 297 mm)",
                  "12x12": "12 x 12 inch for desktop cutting plotters",
                  "12x24": "12 x 24 inch for desktop cutting plotters",
                  "24x12": "24 x 12 inch for desktop cutting plotters",
                  "A3PLUS": "A3 Plus (Portrait)",
                  "A3PLUSL": "A3 Plus (Landscape)",
                  "1020x710": "1020 x 710 mm",
                  "710x1020": "710 x 2020 mm",
                  "915x540": "915 x 540 mm",
                  "540x915": "540 x 915 mm",
                  "FLUTE": "Flute Board, 1200 x 2400 mm",
                  "FLUTEL": "Flute Board Landscape, 2400x1200 mm",
                  "GLOWFORGE": "Glowforge (Portrait",
                  "GLOWFORGEL": "Glowforge (Landscape)"
                },
                "uuid": "e7083bee"
              },
              "PAGEWIDTH": {
                "name": "Page Width",
                "symbol": "PAGEWIDTH",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fd263bca"
              },
              "PAGEHEIGHT": {
                "name": "Page Height",
                "symbol": "PAGEHEIGHT",
                "value": 200,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e720e4c1"
              },
              "RESOLUTION": {
                "name": "Resolution",
                "symbol": "RESOLUTION",
                "value": 72,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 500,
                "uuid": "4a3da442"
              },
              "PERFORATION": {
                "name": "Perforation Length",
                "symbol": "PERFORATION",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Length of the perforation",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "0138ce1c"
              },
              "LAYOUT": {
                "name": "Page Arrangement",
                "symbol": "LAYOUT",
                "value": "VERTICAL",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": "For SVG-pages and Preview, how should the pages be stacked?",
                "options": {
                  "VER": "Vertically",
                  "HOR": "Horizontally"
                },
                "uuid": "6ab9d16d"
              },
              "REQUEST": {
                "name": "Request",
                "symbol": "REQUEST",
                "value": "JSONALL",
                "expression": "",
                "type": "radio",
                "dirty": true,
                "tooltip": null,
                "options": {
                  "PDF": "PDF",
                  "SVG": "SVG",
                  "CRICUT": "Cricut",
                  "PERFSVG": "Perforated SVG",
                  "DXF": "DXF",
                  "PNG": "PNG",
                  "PS": "PS",
                  "TILES": "Tiles (PDF)",
                  "SIGNCUT": "SIGNCUT",
                  "SINGLESTYLEDXF": "Perforated DXF"
                },
                "uuid": "cbf0224b"
              }
            },
            "parameters": {
              "H": {
                "name": "Height",
                "symbol": "H",
                "value": 150,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "48f3b7ab"
              },
              "W": {
                "name": "Width",
                "symbol": "W",
                "value": 100,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "91a9dfaa"
              },
              "R": {
                "name": "Rounded Corner Radius",
                "symbol": "R",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "4daa1c43"
              }
            },
            "options": {},
            "professional": {
              "REGISTRATION": {
                "name": "Registration marks",
                "symbol": "REGISTRATION",
                "value": "page",
                "expression": "",
                "type": "select",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "none": "No Registration Marks",
                  "page": "In the corners of the page",
                  "model": "Around each model"
                },
                "uuid": "9acd63f4"
              },
              "MARK": {
                "name": "Registration Mark Diameter",
                "symbol": "MARK",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "9d7889eb"
              },
              "MARKCLEAR": {
                "name": "Registration mark clearance",
                "symbol": "MARKCLEAR",
                "value": 6,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Space between registration mark and model",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "d25ea57d"
              },
              "BLEED": {
                "name": "Bleed tolerance",
                "symbol": "BLEED",
                "value": 3,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Size of bleed area outside models.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "cb15c90a"
              },
              "OVERCUT": {
                "name": "Overcut",
                "symbol": "OVERCUT",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "For models that use this, the length that one line segment extends beyond another one when these meet at a sharp angle",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7d093aee"
              },
              "DASH": {
                "name": "Push-out Cut length",
                "symbol": "DASH",
                "value": 40,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Maximum length of a line segment. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6ab4b675"
              },
              "GAP": {
                "name": "Push-out Bridge Length",
                "symbol": "GAP",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Gap length between line segments. (Use this for chopping up continuous strokes into smaller segments).",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "6a03434e"
              },
              "FILMIN": {
                "name": "Sharp corner radius",
                "symbol": "FILMIN",
                "value": 0,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Minimal radius of sharp corners.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "7dc9a121"
              },
              "NESTING": {
                "name": "Nesting",
                "symbol": "NESTING",
                "value": "manual",
                "expression": "",
                "type": "radio",
                "dirty": false,
                "tooltip": null,
                "options": {
                  "auto": "Auto",
                  "manual": "Manual",
                  "none": "No nesting"
                },
                "uuid": "d00f57c8"
              },
              "COLS": {
                "name": "Columns",
                "symbol": "COLS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "80e0b554"
              },
              "ROWS": {
                "name": "Rows",
                "symbol": "ROWS",
                "value": 1,
                "expression": "",
                "type": "number",
                "dirty": false,
                "tooltip": null,
                "minval": -500,
                "maxval": 50,
                "uuid": "503ae9dd"
              },
              "COLSPACE": {
                "name": "Space between columns",
                "symbol": "COLSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "fdc56171"
              },
              "ROWSPACE": {
                "name": "Space between rows",
                "symbol": "ROWSPACE",
                "value": 5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": null,
                "minval": 0,
                "maxval": 1e3,
                "uuid": "f796ed50"
              },
              "OUTLINETEXT": {
                "name": "Outline text",
                "symbol": "OUTLINETEXT",
                "value": 1,
                "expression": "",
                "type": "boolean",
                "dirty": false,
                "tooltip": "Outlines all text as paths",
                "uuid": "5a7dd8ae"
              },
              "APPROX": {
                "name": "Maximum Arc Segment Length",
                "symbol": "APPROX",
                "value": 0.5,
                "expression": "",
                "type": "measure",
                "dirty": false,
                "tooltip": "Only used in JSONIMAGE: approximate length of a segment when dividing an arc up into straight segments.",
                "minval": 0,
                "maxval": 1e3,
                "uuid": "e8629813"
              }
            }
          },
          "gallery": [],
          "snippets": [],
          "model": true
        }
      }
    };
  },
  mounted() {
    this.reconstructData();
  },
  methods: {
    openFlyout(box) {
      this.flyout = true;
      this.selected_box = box;
    },
    closeFlyout(v) {
      this.flyout = false;
    },
    filterTagIncludes(tag) {
      return this.filter_tags.includes(tag);
    },
    reconstructData() {
      this.box_types = Object.keys(this.r_data);
      let tags = [];
      this.box_types.forEach((v) => {
        let i = this.r_data[v];
        this.new_data.push(i);
        tags = tags.concat(i.tags);
      });
      tags = tags.map((e) => {
        return e.toLowerCase();
      });
      tags = [...new Set(tags)].sort();
      this.all_boxes = this.new_data.map((e) => {
        return e.name.toLowerCase();
      });
      this.selected_box = this.new_data[0].name;
      this.tags = [...tags].map((i) => {
        return { id: this.slug(i), name: i };
      });
      this.isLoaded = true;
    },
    clickTag(tag) {
      if (tag == "all") {
        this.filter_tags = ["all"];
      } else {
        this.filter_tags = this.filter_tags.filter((e) => {
          return e !== "all";
        });
        if (!this.filter_tags.includes(tag)) {
          let filter_tags = this.filter_tags;
          filter_tags.push(tag);
          this.filter_tags = filter_tags;
        } else {
          this.filter_tags = this.filter_tags.filter((e) => e !== tag);
        }
      }
      this.filterBoxByTags();
    },
    handleSelectedItems(v) {
      console.log("handlesSelectedItems: " + v + ", filter_tags: " + this.filter_tags);
      let filtered_boxes = [], selected_tags = v;
      if (selected_tags.length != 0) {
        selected_tags.forEach((v2) => {
          this.new_data.forEach((v1) => {
            let temp = v1["tags"].map((e) => this.slug(e.toLowerCase()));
            if (temp.includes(v2)) {
              filtered_boxes.push(v1.name);
            }
          });
        });
      }
      this.filtered_tags = [...new Set(filtered_boxes)];
    },
    filterBoxByTags() {
      let filtered_boxes = [];
      if (!this.filter_tags.includes("all")) {
        this.filter_tags.forEach((v) => {
          this.new_data.forEach((v1) => {
            let temp = v1["tags"].map((e) => e.toLowerCase());
            if (temp.includes(v)) {
              filtered_boxes.push(v1.name);
            }
          });
        });
      }
      this.filtered_tags = [...new Set(filtered_boxes)];
    },
    filteredTags(name) {
      return this.filtered_tags.includes(name);
    },
    // alpha chars only, no white spaces and lowercased
    resolveImageName(name) {
      return name.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, "-").toLowerCase() + ".svg";
    },
    slug(name) {
      return name.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, "").toLowerCase();
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ElFlyout = __nuxt_component_0;
  const _component_MultiSelect = __nuxt_component_1;
  const _component_center = resolveComponent("center");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "container ui" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_ElFlyout, {
    isOpen: $data.flyout,
    onIsClosed: $options.closeFlyout,
    boxData: $data.isLoaded ? $data.new_data.filter((i) => i.name.toLowerCase() == $data.selected_box.toLowerCase())[0] : null,
    boxImg: $data.isLoaded ? `${$options.resolveImageName($data.selected_box)}` : "bag.svg"
  }, null, _parent));
  _push(`<div class="ui segment"><div style="${ssrRenderStyle({ "margin-top": "20px" })}"><p><span class="ui large text">Tags </span></p><div class="ui divider"></div>`);
  _push(ssrRenderComponent(_component_MultiSelect, {
    placeholder: "Filter by tags...",
    options: $data.tags,
    onSelected_items: $options.handleSelectedItems
  }, null, _parent));
  _push(`</div><div style="${ssrRenderStyle({ "margin-top": "60px" })}"><p><span class="ui large text">Free</span></p><div class="ui divider"></div><div class="ui segment secondary"><div class="ui" style="${ssrRenderStyle({ "display": "flex", "flex-wrap": "wrap" })}"><!--[-->`);
  ssrRenderList($data.filtered_tags.length == 0 ? _ctx.all_boxes : $data.filtered_tags, (datum, index2) => {
    _push(`<!--[-->`);
    if (index2 < 5) {
      _push(`<div class="image-item-container"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "center", "height": "130px" })}"><div style="${ssrRenderStyle({ "margin-top": "15px", "justify-content": "center", "text-align": "center" })}">`);
      _push(ssrRenderComponent(_component_center, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img style="${ssrRenderStyle({ "width": "60px", "color": "rgb(0,78,97)" })}" class="ui image"${ssrRenderAttr("src", `_nuxt/assets/images/box_icons/${$options.resolveImageName(datum)}`)}${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                style: { "width": "60px", "color": "rgb(0,78,97)" },
                class: "ui image",
                src: `_nuxt/assets/images/box_icons/${$options.resolveImageName(datum)}`
              }, null, 8, ["src"])
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`<div class="label" style="${ssrRenderStyle({ "color": "rgb(0,78,97)", "padding": "3px", "margin-top": "7px", "font-size": ".85em", "text-align": "center" })}">${ssrInterpolate(datum)}</div></div></div></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<!--]-->`);
  });
  _push(`<!--]--></div></div></div><div style="${ssrRenderStyle({ "margin-top": "60px" })}"><p><span class="ui large text"> Premium </span></p><div class="ui divider"></div><div class="ui" style="${ssrRenderStyle({ "display": "flex", "flex-wrap": "wrap" })}"><!--[-->`);
  ssrRenderList($data.filtered_tags.length == 0 ? _ctx.all_boxes : $data.filtered_tags, (datum, index2) => {
    _push(`<div class="image-item-container"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "center", "height": "130px" })}"><div style="${ssrRenderStyle({ "margin-top": "15px", "justify-content": "center", "text-align": "center" })}">`);
    _push(ssrRenderComponent(_component_center, null, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<img style="${ssrRenderStyle({ "width": "60px", "color": "rgb(0,78,97)" })}" class="ui image"${ssrRenderAttr("src", `_nuxt/assets/images/box_icons/${$options.resolveImageName(datum)}`)}${_scopeId}>`);
        } else {
          return [
            createVNode("img", {
              style: { "width": "60px", "color": "rgb(0,78,97)" },
              class: "ui image",
              src: `_nuxt/assets/images/box_icons/${$options.resolveImageName(datum)}`
            }, null, 8, ["src"])
          ];
        }
      }),
      _: 2
    }, _parent));
    _push(`<div class="label" style="${ssrRenderStyle({ "color": "rgb(0,78,97)", "padding": "3px", "margin-top": "7px", "font-size": ".85em", "text-align": "center" })}">${ssrInterpolate(datum)}</div></div></div></div>`);
  });
  _push(`<!--]--></div></div></div><div class="${ssrRenderClass([$data.flyout ? "active" : "", "ui dimmer fluid"])}"></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-013cd17d.mjs.map
