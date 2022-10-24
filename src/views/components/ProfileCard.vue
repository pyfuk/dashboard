<template>
  <div class="card card-profile">
    <img src="../../assets/img/bg-4.png" alt="Image placeholder" class="card-img-top"/>
    <div class="row justify-content-center">
      <div class="col-4 col-lg-4 order-lg-2">
        <div class="mt-n4 mt-lg-n6 mb-4 mb-lg-0">
          <a href="javascript:;">
            <img
                src="../../assets/img/team-2.jpg"
                class="rounded-circle img-fluid border border-2 border-white"
            />
          </a>
        </div>
      </div>
    </div>
    <div class="card-header text-center border-0 pt-0 pt-lg-2 pb-4 pb-lg-3">
      <div class="d-flex justify-content-between">
        <a href="javascript:;" class="btn btn-sm btn-info mb-0 d-lg-block">{{ user.phone }}</a>
        <a href="javascript:;" class="btn btn-sm btn-dark float-right mb-0 d-lg-block">{{ user.email }}</a>
      </div>
    </div>
    <div class="card-body pt-0">
      <div class="text-center">
        <h5>
          {{ user.firstname }} {{ user.lastname }}
        </h5>
      </div>
    </div>
  </div>
</template>

<script>
import usersRoleMixin from "@/mixins/usersRoleMixin";
import axios from "axios";
import { server } from "@/config";

export default {
  name: "profile-card",
  props: {
    course: {
      type: Object
    }
  },
  data() {
    return {
      user: ''
    }
  },
  mixins: [
    usersRoleMixin
  ],
  methods: {
    async getUser() {

      let data;

      if (this.isStudent(this.$store.state.currentUser)) {
        data = {
          user_id: this.course.teacher.id
        }
      } else {
        data = {
          user_id: this.course.student.id
        }
      }

      const res = await axios.post(server.URL + '/api/users/get', data);

      this.user = res.user

      console.log(this.user)

    }
  },
  async mounted() {
    await this.getUser();
  }
};
</script>
