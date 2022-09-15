<template>
  <div class="container-fluid mt-4">
    <div class="card shadow-lg">
      <div class="card-body p-3 d-flex justify-content-between">
        <div class="d-flex">
          <div class="avatar avatar-xl position-relative">
            <img
                src="../../assets/img/team-1.jpg"
                alt="profile_image"
                class="shadow-sm w-100 border-radius-lg"
            />
          </div>
          <div class="my-auto mx-3">
            <div class="h-100">
              <h5 class="mb-1">{{ user.lastname }} {{ user.firstname }}</h5>
              <p class="mb-0 font-weight-bold text-sm">{{ getTranslatedRole(user.role) }}</p>
            </div>
          </div>
        </div>
        <div class="my-auto">
          <argon-button color="success" :variant="page === 'edit' ? 'gradient' : 'outline'" @click="changeRoute('edit')"
                        class="mx-1">
            Профиль
          </argon-button>
          <argon-button color="success" :variant="page === 'calendar' ? 'gradient' : 'outline'"
                        @click="changeRoute('calendar')"
                        class="mx-1">Календарь
          </argon-button>
          <argon-button color="success" :variant="page === 'lessons' ? 'gradient' : 'outline'"
                        @click="changeRoute('lessons')"
                        class="mx-1">Курсы
          </argon-button>
        </div>
      </div>
    </div>
    <router-view v-if="user" :user="user"></router-view>
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
    }
  },
  mounted() {
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
      this.page = 'edit'
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
