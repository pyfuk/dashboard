import { createStore } from "vuex";
import { usersModule } from "@/store/usersModule";
import { subjectsModule } from "@/store/subjectsModule";
import router from "../router";


export default createStore({
    state: {
        hideConfigButton: false,
        isPinned: true,
        showConfig: false,
        sidebarType: "bg-white",
        isRTL: false,
        mcolor: "",
        darkMode: false,
        isNavFixed: false,
        isAbsolute: false,
        showNavs: true,
        showSidenav: true,
        showNavbar: true,
        showFooter: true,
        showMain: true,
        layout: "default",

        //Auth
        isAuth: false,
        currentUser: ""

    },
    mutations: {
        toggleConfigurator(state) {
            state.showConfig = !state.showConfig;
        },
        navbarMinimize(state) {
            const sidenav_show = document.querySelector(".g-sidenav-show");

            if (sidenav_show.classList.contains("g-sidenav-hidden")) {
                sidenav_show.classList.remove("g-sidenav-hidden");
                sidenav_show.classList.add("g-sidenav-pinned");
                state.isPinned = true;
            } else {
                sidenav_show.classList.add("g-sidenav-hidden");
                sidenav_show.classList.remove("g-sidenav-pinned");
                state.isPinned = false;
            }
        },
        sidebarType(state, payload) {
            state.sidebarType = payload;
        },
        navbarFixed(state) {
            if (state.isNavFixed === false) {
                state.isNavFixed = true;
            } else {
                state.isNavFixed = false;
            }
        },
        setIsAuth(state, bool) {
            state.isAuth = bool
        },
        setCurrentUser(state, user) {
            state.currentUser = user
        },
    },
    actions: {
        toggleSidebarColor({ commit }, payload) {
            commit("sidebarType", payload);
        },
        logout({ commit }) {
            commit("setIsAuth", false);
            commit("setCurrentUser", null)
            localStorage.removeItem('session')
            localStorage.removeItem('user')
            router.push('/signin')
        }
    },
    getters: {},
    modules: {
        users: usersModule,
        subjects: subjectsModule
    }
});
