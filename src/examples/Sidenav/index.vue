<template>
  <div
      v-show="this.$store.state.layout === 'default'"
      class="min-height-300 position-absolute w-100"
      :class="`${this.$store.state.darkMode ? 'bg-transparent' : 'bg-success'}`"
  />
  <aside
      class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl fixed-start ms-3"
      :class="`
    ${
      this.$store.state.layout === 'landing'
        ? 'bg-transparent shadow-none'
        : ' '
    } ${this.$store.state.sidebarType}`"
      id="sidenav-main"
      v-if="this.$store.state.showASidenav"
  >
    <div class="d-flex flex-column h-100">
      <div class="sidenav-header">
        <i
            class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
            aria-hidden="true"
            id="iconSidenav"
        ></i>
        <router-link class="m-0 navbar-brand d-flex align-items-center justify-content-center" to="/">
          <img
              :src="
            this.$store.state.darkMode ||
            this.$store.state.sidebarType === 'bg-default'
              ? logoWhite
              : logo
          "
              class="navbar-brand-img h-100"
              alt="main_logo"
          />
          <span class="ms-2 font-weight-bold text-lg me-2">Tii School</span>
          <i class="fa fa-xmark d-block position-absolute d-xl-none" style="left: 88%; top:2%"
             @click="toggleSidebar"></i>
        </router-link>
      </div>
      <hr class="mt-0 horizontal dark"/>
      <sidenav-list/>
      <div class="pt-3 mx-3 mt-auto">
        <sidenav-card
            :class="custom_class"
            textPrimary="Need Help?"
            textSecondary="Please check our docs"
        />
      </div>
    </div>
  </aside>
</template>
<script>
import SidenavList from "./SidenavList.vue";
import logo from "@/assets/img/logo-ct-dark.png";
import logoWhite from "@/assets/img/logo-ct.png";
import SidenavCard from "@/examples/Sidenav/SidenavCard";
import { mapActions, mapMutations } from "vuex";

export default {
  name: "index",
  components: {
    SidenavList,
    SidenavCard
  },
  data() {
    return {
      logo,
      logoWhite
    };
  },
  methods: {
    ...mapMutations(["navbarMinimize"]),
    ...mapActions(["toggleSidebarColor", ""]),

    toggleSidebar() {
      this.toggleSidebarColor("bg-white");
      this.navbarMinimize();
    }
  },
  props: ["custom_class", "layout"]
};
</script>
