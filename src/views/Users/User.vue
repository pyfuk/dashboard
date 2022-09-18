<template>
  <div class="container-fluid mt-4" :class="`${$store.state.currentUser.role == 'admin' ? '' : 'col col-xl-10'}`">

    <div class="card shadow-lg">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="row">
              <div class="col-4 col-md-3 col-lg-2 col-xl-2">
                <div class="avatar avatar-xl position-relative">
                  <img
                      src="../../assets/img/team-1.jpg"
                      alt="profile_image"
                      class="shadow-sm w-100 border-radius-lg"
                  />
                </div>
              </div>
              <div class="col-8 col-md-9 col-lg-10 col-xl-10" :class="{'d-flex align-items-center': !isMobile}">
                <div class="my-auto mx-3">
                  <div class="h-100">
                    <h5 class="mb-1">{{ user.lastname }} {{ user.firstname }}</h5>
                    <p class="mb-0 font-weight-bold text-sm">{{ getTranslatedRole(user.role) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6" :class="{'d-flex align-items-center  justify-content-end': !isMobile}">
            <div :class="{'row': isMobile}">

              <argon-button color="success" :variant="page === 'edit' ? 'gradient' : 'outline'"
                            @click="changeRoute('edit')"
                            :class="`${ isMobile ? 'mt-1' : 'mx-1'}`"
                            v-if="isAdmin($store.state.currentUser)"

              >
                Профиль
              </argon-button>

              <argon-button color="success" :variant="page === 'calendar' ? 'gradient' : 'outline'"
                            @click="changeRoute('calendar')"
                            :class="`${ isMobile ? 'mt-1' : 'mx-1'}`"
                            v-if="!isAdmin(user)"
              >Календарь
              </argon-button>
              <argon-button color="success" :variant="page === 'lessons' ? 'gradient' : 'outline'"
                            @click="changeRoute('lessons')"
                            :class="`${ isMobile ? 'mt-1' : 'mx-1'}`"
                            v-if="!isAdmin(user)"
              >Курсы
              </argon-button>
            </div>
          </div>
        </div>


      </div>
    </div>

    <div :class="{'container-fluid': !isMobile}">
      <router-view v-if="user" :user="user" :isMobile="isMobile"></router-view>
    </div>
  </div>
</template>

<script>

import ArgonButton from "../../components/ArgonButton";
import axios from "axios";
import { server } from "../../config";
import usersRoleMixin from "../../mixins/usersRoleMixin";

export default {
  name: "User",
  components: { ArgonButton },
  mixins: [usersRoleMixin],
  data() {
    return {
      page: '',
      user_id: '',
      user: '',
      windowWidth: window.innerWidth,
    }
  },
  computed: {
    isMobile() {
      return this.windowWidth <= 767
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }
    this.user_id = this.$route.params.id;
    this.parseRoute();
    this.getUser();
  },
  methods: {
    parseRoute() {
      const lastRoute = this.$route.path.split('/').at(-1);
      if (lastRoute === 'lessons') {
        this.page = 'lessons'
        return
      }
      if (lastRoute === 'calendar') {
        this.page = 'calendar'
        return
      }

      if (!this.isAdmin(this.$store.state.currentUser)) {
        this.page = 'calendar'
      } else {
        this.page = 'edit'
      }
    },
    changeRoute(route) {
      this.$router.push(`/users/${this.user_id}/${route}`)
      this.page = route;
    },
    async getUser() {
      const res = await axios.post(server.URL + '/api/users/get', { user_id: this.user_id });
      this.user = res.user;
    }
  }
}
</script>

<style scoped>

</style>
