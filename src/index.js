import customRangeController from "./components/customRangeController.vue"

export default {
    install: (app, options) => {
        app.component("customRangeController", customRangeController)
    },
}