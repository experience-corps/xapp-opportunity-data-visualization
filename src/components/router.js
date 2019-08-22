import Vue from 'vue';
import Router from 'vue-router'; 
import Selection from './select.vue'
import Data from './dataPage.vue'

Vue.use(Router); 

export default new Router({
    routes: [
        {
            path: '/', 
            name: 'Select', 
            component: Selection
        }, 
        {
            path: '/data',
            name: 'Data', 
            component: Data, 
            props: true
        }
    ]
})