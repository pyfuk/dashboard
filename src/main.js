import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";
import axios from "axios";
import Toast, { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import i18n from './i18n'

const options = {
    // You can set your default options here
};

const toast = useToast()

const appInstance = createApp(App).use(i18n);
appInstance.use(store);
appInstance.use(router);
appInstance.use(ArgonDashboard);
axios.interceptors.request.use(function (config) {
    let session = localStorage.getItem('session');
    if (session) {
        config.headers.common['session'] = session;
    }
    config.headers.common['accept-language'] = 'ru';
    return config
})

axios.interceptors.response.use(function (response) {
    return response.data.result;
}, function (error) {
    if (error.response.status === 401) {
        store.dispatch('logout')
    }
    toast.error(error.response.data.result.error.message);
    return Promise.reject(error);
});
appInstance.use(Toast, options);
appInstance.mount("#app");
