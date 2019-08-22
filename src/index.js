import Vue from 'vue'
import View from './components/view.vue'
import router from './components/router'
import vuetify from './plugins/vuetify.js'
import VueFusionCharts from 'vue-fusioncharts'
import FusionCharts from 'fusioncharts'
import Gantt from 'fusioncharts/fusioncharts.gantt'
import Bubble from 'fusioncharts/fusioncharts.charts'
import Fusion from 'fusioncharts/themes/fusioncharts.theme.fusion'

Vue.use(VueFusionCharts, FusionCharts, Gantt, Bubble, Fusion);

new Vue({
    el: '#app', 
    router,
    vuetify,
    render: h => h(View)
})