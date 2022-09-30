<template>
  <div
      class="collapse navbar-collapse w-auto h-auto h-100"
      id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
            url="/users"
            :class="getRoute() === 'users' ? 'active' : ''"
            :navText="$t('users.users')"
        >
          <template v-slot:icon>
            <i
                class="fa fa-users text-warning text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
            url="/subjects"
            :class="getRoute() === 'subjects' ? 'active' : ''"
            :navText="$t('subjects.subjects')"
        >
          <template v-slot:icon>
            <i
                class="fa fa-book text-warning text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>
<script>
import SidenavItem from "./SidenavItem.vue";

export default {
  name: "SidenavList",
  props: {
    cardBg: String
  },
  data() {
    return {
      title: "Argon Dashboard 2",
      controls: "dashboardsExamples",
      isActive: "active"
    };
  },
  components: {
    SidenavItem,

  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    }
  }
};
</script>
