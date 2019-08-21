import Vue from 'vue'
import Select from './components/select.vue'
import vuetify from './plugins/vuetify.js'

new Vue({
    el: '#app', 
    vuetify,
    render: h => h(Select)
})