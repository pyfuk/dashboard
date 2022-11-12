<!--
=========================================================
* Vue Argon Dashboard 2 - v3.0.0
=========================================================

* Product Page: https://creative-tim.com/product/vue-argon-dashboard
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
-->
<template>
  <!--  <div-->
  <!--      v-show="this.$store.state.layout === 'landing'"-->
  <!--      class="landing-bg h-100 bg-gradient-primary position-fixed w-100"-->
  <!--  ></div>-->
  <sidenav
      :custom_class="this.$store.state.mcolor"
      :class="[
      this.$store.state.isTransparent,
      this.$store.state.isRTL ? 'fixed-end' : 'fixed-start'
    ]"
      v-if="this.$store.state.showSidenav"
  />
  <main
      class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
  >
    <!-- nav -->
    <navbar
        :class="[navClasses]"
        :textWhite="
        this.$store.state.isAbsolute ? 'text-white opacity-8' : 'text-white'
      "
        :minNav="navbarMinimize"
        v-if="this.$store.state.showNavbar"
    />
    <router-view/>
    <configurator
        :toggle="toggleConfigurator"
        :class="[
        this.$store.state.showConfig ? 'show' : '',
        this.$store.state.hideConfigButton ? 'd-none' : ''
      ]"
    />
  </main>
</template>
<script>
import Sidenav from "./examples/Sidenav";
import Configurator from "@/examples/Configurator.vue";
import Navbar from "@/examples/Navbars/Navbar.vue";
import { mapMutations } from "vuex";
import moment from "moment-timezone";

export default {
  name: "App",
  components: {
    Sidenav,
    Configurator,
    Navbar,
  },
  methods: {
    ...mapMutations(["toggleConfigurator", "navbarMinimize"])
  },
  computed: {
    navClasses() {
      return {
        "position-sticky bg-white left-auto top-2 z-index-sticky":
            this.$store.state.isNavFixed && !this.$store.state.darkMode,
        "position-sticky bg-default left-auto top-2 z-index-sticky":
            this.$store.state.isNavFixed && this.$store.state.darkMode,
        "position-absolute px-4 mx-0 w-100 z-index-2": this.$store.state
            .isAbsolute,
        "px-0 mx-4": !this.$store.state.isAbsolute
      };
    }
  },
  beforeMount() {
    this.$store.state.isTransparent = "bg-transparent";

    const session = localStorage.getItem('session');
    const user = JSON.parse(localStorage.getItem('user'))

    if (session && user) {
      this.$store.commit('setCurrentUser', user);
      this.$store.commit('setIsAuth', true);

      if (user.role == 'admin') {
        this.$store.state.showASidenav = true;
      }
    }
    moment.locale('ru')
  }
};
</script>
<style>
/*Кнопки в календаре*/
.fc-button-primary {
  background-color: #2dce89 !important;
  border-color: #2dce89 !important;
  font-weight: 700 !important;
  line-height: 1.5 !important;
  padding: 0.625rem 1.25rem !important;
}

/*Текст в background events*/
.fc .fc-bg-event .fc-event-title {
  margin: 0.2em !important;
  color: white !important;
  font-weight: 650;
}

/*Текст в background events*/
.fc-v-event .fc-event-main-frame {
  flex-direction: inherit !important;
}



.form-switch .form-check-input:checked {
  border-color: #2dce89 !important;
  background-color: #2dcecc !important;
}
</style>
