/* eslint-disable global-require, no-underscore-dangle */
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { Icon } from 'leaflet';
import App from './App.vue';
import 'leaflet/dist/leaflet.css';

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('./assets/mark.svg'),
  iconUrl: require('./assets/mark.svg'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

Vue.filter('mask', value => (value ? `${value}個` : '已售完'));

new Vue({
  render: h => h(App),
}).$mount('#app');
