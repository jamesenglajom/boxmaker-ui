import { defineStore } from "pinia";

// export const gallery = Object.values(import.meta.glob('/assets/images/box_icons/*', { eager: true, as: 'url' }))
export const useBoxMakerStore = defineStore("boxmaker", {
  state: () => ({
    fetching: false,
    status: "idle",
    api: null,
    search: "",
    flyoutv2: false,
    box_id: null,
    tags: [],
    formChange: false,
    cw_width: null,
    cw_height: null,
    die_line_image: null,
    memory: false,
    discard:false
  }),
  getters: {
    openFlyout(state) {
      return state.api ? (state.box_id ? true : false) : false;
    },
    getFlyoutV2(state) {
      return state.flyoutv2;
    },
    getFetchStatus(state) {
      let status = "idle";
      // initiate
      if (state.fetching == true && state.api == null) {
        status = "fetching";
      } else if (state.fetching == false && state.api != null) {
        status = "loaded";
      } else if (state.fetching == true && state.api != null) {
        status = "refetching";
      }
      this.status = status;
      return status;
    },
    isLoaded(state) {
      return state.api ? true : false;
    },
    getBoxCountPerTag: (state) => {
      return (tag) => {
        let result = 0;
        if (state.api) {
          result = Object.values(state.api).filter((i) =>
            i.tags.map((i1) => slug(i1)).includes(slug(tag))
          ).length;
        }
        return result;
      };
    },
    getFetching(state) {
      return state.fetching;
    },
    getAllBoxCount(state) {
      return state.api ? Object.values(state.api).length : 0;
    },
    getBoxes: (state) => {
      let boxes = [];
      if (state.api != null) {
        boxes = Object.values(state.api);
        if (state.tags.length != 0) {
          let t = boxes.filter((i) =>
            i.tags.some((s) => state.tags.includes(slug(s)))
          );
          boxes = t;
        }
      }
      boxes = boxes.map((i) => {
        return { ...i, img: imgName(i.id) };
      });

      if (state.search != "") {
        boxes = boxes.filter((i) =>
          i.name.toLowerCase().includes(state.search)
        );
      }

      // const currentUrl = window.location.href;
      // if(!currentUrl.includes('v1')){
      //   state.box_id = boxes.length > 0 ? boxes[0].id : null;
      // }

      return boxes;
    },
    getTags(state) {
      return state.api
        ? [
            ...new Set(
              Object.values(state.api)
                .reduce((o, c) => [...o, ...c.tags], [])
                .map((i) => i.toLowerCase())
            ),
          ].map((i) => ({
            id: slug(i),
            name: i.charAt(0).toUpperCase() + i.slice(1),
            no_of_boxes: this.getBoxCountPerTag(i.toLowerCase()),
          }))
        : [];
    },
    getStoredBox: (state) => {
      return (id) =>{
      let temp_id =  id ?? state.box_id;
      let box = state.api !== null && temp_id !== null
      ? Object.values(state.api)
          .filter((i) => i.id == temp_id)
          .map((i) => {
            return { ...i, img: imgName(i.id) };
          })[0]
      : null;
      return box;
      // return {id, box_id:state.box_id};
      };
    },
    getBoxName(state) {
      return state.box_id ? this.getStoredBox().name : "";
    },
    getBoxDescription(state) {
      return state.box_id ? this.getStoredBox().description : "";
    },
    getBoxForm: (state) => {
      return (category,id) => {
        let result = [];
        id = id ?? state.box_id;
        if (id != null && state.api != null) {
          const b = Object.values(state.api).filter(
            (i) => i.id === id
          )[0];
          let categories = {
            standard: "STANDARD",
            options: "OTHER SPECIFICATIONS",
            parameters: "DIMENSION",
            professional: "PROFESSIONAL",
          };
          let fields = b.parameters;
          let form_field = [];

          Object.keys(categories).forEach((v) => {
            let datum = Object.values(fields[v]).map((i) => ({
              ...i,
              category: categories[v],
            }));
            if (v == "standard") {
              datum = datum.filter((i) =>
                ["UNITS", "PAGEPRESET", "PAGEWIDTH", "PAGEHEIGHT"].includes(
                  i.symbol
                )
              );
            } else if (v == "professional") {
              datum = datum.filter((i) =>
                [
                  "REGISTRATION",
                  "MARK",
                  "BLEED",
                  "OVERCUT",
                  "DASH",
                  "GAP",
                  "FILMIN",
                ].includes(i.symbol)
              );
            }
            form_field = [...form_field, ...datum];
          });
          result = form_field;
        }
        if (category !== undefined) {
          result = result.filter((i) => i.category.toLowerCase() === category.toLowerCase());
        }
        return result;
      };
    },
    getBoxFormValue() {
      // if(state.api !== null && state.box_id !== null){
      return (category) => {
        return this.getBoxForm(category).reduce(
          (obj, item) => Object.assign(obj, { [item.symbol]: item.value }),
          {}
        );
      };
    },
    getCustomer(state) {
      return state.box_id ? this.getStoredBox().CUSTOMER : "";
    },
    getBoxImg(state) {
      return state.api ? (state.box_id ? this.getStoredBox().img : null) : null;
    },
    getBoxSampleImage(state) {
      return state.box_id
        ? `https://templatemaker-dev.signcut.com/?CUSTOMER=${this.getCustomer}&REQUEST=EXPLANATION&MODEL=${state.box_id}`
        : "";
    },
    getBoxPagePresetField(state) {
      return state.box_id
        ? this.getBoxForm("standard").filter((i) => i.symbol == "PAGEPRESET")[0]
        : null;
    },
    getBoxPageWidthHeightField(state) {
      return state.box_id
        ? this.getBoxForm("standard").filter((i) =>
            ["PAGEWIDTH", "PAGEHEIGHT"].includes(i.symbol)
          )
        : null;
    },
  },
  actions: {
    async fetchApi() {
      this.$patch({
        fetching: true,
      });
      try {
        this.api = await $fetch("https://templatemaker-dev.signcut.com/");
      } catch (error) {
        // let the form component display the error
        this.$patch({
          fetching: false,
        });
        
        return error;
      }
    },
    setBoxDieLinePreviewImage(form) {
        const url = new URLSearchParams(form);
        this.$patch({
          die_line_image:  `https://templatemaker-dev.signcut.com?REQUEST=DIELINESPREVIEW&MODEL=${this.box_id}&CUSTOMER=${this.getCustomer}&${url}`,
        })
    },
    createMemoryBox(cookie){
      // img, name, date, dimension details
      let box = [], details = this.getStoredBox(cookie.data.MODEL), val = "",label="";
      box["name"] = details.name;
      box["img"] = details.img;
      box["date"] = new Date(cookie.date).toDateString();
      this.getBoxForm('DIMENSION', cookie.data.MODEL).forEach((v)=>{
        val = val + " x " +cookie.data[v.symbol] + cookie.data.UNITS;
        label = label + " x " +v.symbol;
      });
      box["dimension_value"] = val;
      box["dimension_label"] = label;
      return box;
      // return this.getBoxForm('DIMENSION', cookie.data.MODEL);
    }
  },
});

// helpers
function slug(str) {
  return str
    .replace(/[^a-zA-Z ]/g, "")
    .replace(/\s/g, "")
    .toLowerCase();
}

function imgName(id) {
  const img = new URL(`/assets/images/box_icons/${id}.svg`, import.meta.url)
    .href;
  return img;
}
