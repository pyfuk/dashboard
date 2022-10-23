<template>
  <div class="container-fluid mt-4" :class="`${$store.state.currentUser.role == 'admin' ? '' : 'col col-xl-10'}`">

    <div class="card shadow-lg" v-if="course">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="row">
              <div class="col-4 col-md-3 col-lg-2 col-xl-2">
                <div class="text-center shadow icon icon-shape bg-gradient-dark icon-lg mx-2">
                  <icon-view :img="course.subject.icon" size="lg" color="rgb(226, 231, 231)"></icon-view>
                </div>
              </div>
              <div class="col-8 col-md-9 col-lg-10 col-xl-10 d-flex align-items-center">
                <h5 class="mx-4">{{ course.subject.name }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-8">
        <course-lessons-list v-if="course" :course="course"></course-lessons-list>
      </div>
      <div class="col">
        <profile-card v-if="course" :course="course"></profile-card>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import { server } from "@/config";
import IconView from "@/components/IconView";
import CourseLessonsList from "@/views/components/Courses/CourseLessonsList";
import ProfileCard from "@/views/components/ProfileCard";

export default {
  name: "Courses",
  components: { ProfileCard, CourseLessonsList, IconView },
  data() {
    return {
      course_id: '',
      course: ''
    }
  },
  methods: {
    async getCourse() {

      const data = {
        course_id: this.course_id
      }

      const res = await axios.post(server.URL + '/api/courses/get', data);
      this.course = res.course;
      console.log(this.course.subject.icon)
    }
  },
  mounted() {
    this.course_id = this.$route.params.id;
    this.getCourse();
  }
}
</script>

<style scoped>

</style>
