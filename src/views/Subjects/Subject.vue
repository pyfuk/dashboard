<template>
  <div class="container-fluid mt-4" :class="`${$store.state.currentUser.role == 'admin' ? '' : 'col col-xl-10'}`">

    <div class="card shadow-lg">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="row">
              <div class="col-4 col-md-3 col-lg-2 col-xl-2">
                <div class="text-center shadow icon icon-shape bg-gradient-dark icon-lg mx-2">
                  <icon-view :img="subject.icon" size="lg" color="rgb(226, 231, 231)"></icon-view>
                </div>
              </div>
              <div class="col-8 col-md-9 col-lg-10 col-xl-10 d-flex align-items-center">
                <h5 class="mx-4">{{ subject.name }}</h5>
              </div>
            </div>
          </div>

          <div class="col-md-6" :class="{'d-flex align-items-center  justify-content-end': !isMobile}">
            <div :class="{'row': isMobile}">

              <argon-button color="success" :variant="page === 'edit' ? 'gradient' : 'outline'"
                            @click="changeRoute('edit')"
                            :class="`${ isMobile ? 'mt-1' : 'mx-1'}`"

              >
                Профиль
              </argon-button>

              <argon-button v-if="subject.group" color="success" :variant="page === 'schedule' ? 'gradient' : 'outline'"
                            @click="changeRoute('schedule')"
                            :class="`${ isMobile ? 'mt-1' : 'mx-1'}`"
              >Расписание
              </argon-button>
            </div>
          </div>
        </div>


      </div>
    </div>

    <div :class="{'container-fluid': !isMobile}">
      <router-view v-if="subject" :subject="subject"></router-view>
    </div>
  </div>


</template>

<script>
import ArgonButton from "@/components/ArgonButton";
import axios from "axios";
import { server } from "@/config";
import IconView from "@/components/IconView";
import usersRoleMixin from "@/mixins/usersRoleMixin";

export default {
  name: "Subject",
  mixins: [usersRoleMixin],
  components: { ArgonButton, IconView },
  data() {
    return {
      subject_id: '',
      subject: '',
      windowWidth: window.innerWidth,
      page: ''
    }
  },
  computed: {
    isMobile() {
      return this.windowWidth <= 767
    }
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
      this.$router.push(`/subjects/${this.subject_id}/${route}`)
      this.page = route;
    },
    async getSubject() {
      const data = {
        subject_id: this.subject_id
      }
      const res = await axios.post(server.URL + '/api/subjects/get', data)
      this.subject = res.subject;
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }
    this.subject_id = this.$route.params.id;
    this.parseRoute();
    this.getSubject()
  }
}
</script>

<style scoped>

</style>
