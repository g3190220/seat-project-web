import Vue from 'vue';
import root from '@/views/root';
import router from '@/router';
import vuetify from '@/plugins/vuetify';

// 阻止啟動生產消息，常用作指令。
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(root),
}).$mount('#app');