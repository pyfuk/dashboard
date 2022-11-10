<template>
  <div class="card">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>{{ $t('lessons.lessons') }}</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table v-if="lessons.length && !isLessonsLoading" class="table align-items-center mb-0">
          <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
              {{ $t('lessons.date') }}
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
              {{ $t('lessons.teacher') }}
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
              {{ $t('lessons.payment') }}
            </th>
            <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
              {{ $t('lessons.attendance') }}
            </th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
              {{ $t('lessons.actions') }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="lesson in lessons" :key="lesson.id">
            <td class="text-sm">
              <span class="ms-2">
                              {{ getStartDate(lesson.start, lesson.end) }}
              </span>
            </td>
            <td class="text-sm">
              <span>{{ lesson.teacher.firstname }} {{ lesson.teacher.lastname }}</span>
            </td>
            <td class="align-middle text-sm">
              <span class="badge badge-sm" :class="`${lesson.paid ? 'bg-gradient-success' : 'bg-gradient-warning'}`">
                {{ lesson.paid ? $t('lessons.paid') : $t('lessons.un_paid') }}
              </span>
            </td>
            <td class="align-middle text-sm">
              <span class="badge badge-sm" :class="`${false ? 'bg-gradient-success' : 'bg-gradient-secondary'}`">
                {{ false ? $t('lessons.visited') : $t('lessons.absent') }}
              </span>
            </td>
            <td class="align-middle text-center text-sm">
              <i class="fa fa-pen cursor-pointer mx-2" @click="showAlert"></i>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else-if="!isLessonsLoading" class="d-flex justify-content-center my-2">
          <span class="text-secondary text-3xl font-weight-bold">{{ $t('common.no_data') }}</span>
        </div>

        <div class="d-flex justify-content-center my-2" v-if="isLessonsLoading">
          <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>


import ArgonButton from "@/components/ArgonButton";
import utilsMixin from "@/mixins/utilsMixin";
import usersRoleMixin from "@/mixins/usersRoleMixin";
import { server, timeout } from "@/config";
import axios from "axios";
import moment from "moment";

export default {
  components: {
    ArgonButton,
  },
  props: {
    course: {
      type: Object
    }
  },
  name: "course-lessons-list",
  mixins: [
    utilsMixin,
    usersRoleMixin
  ],
  data() {
    return {
      lessons: [],
      isLessonsLoading: true,
    }
  },
  methods: {
    async getLessons() {
      this.isLessonsLoading = true;
      await this.sleep(timeout.LIST_SLEEP);

      const data = {
        type: 'student',
        user_id: this.course.student.id,
        course_id: this.course.id
      }

      const response = await axios.post(server.URL + '/api/lessons/get_lessons', data);
      this.lessons = response.lessons;
      console.log(this.lessons)
      this.isLessonsLoading = false;
    },
    getStartDate(start, end) {
      const startTime = moment(start);
      const endTime = moment(end);
      return `${startTime.format('DD MMMM')} ${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`
    },
    showAlert() {
      this.$swal({
        title: 'Вы уверены?',
        text: "После редактирования предмета, у вас будет член.",
        icon: 'warning',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Да, продолжить',
        cancelButtonText: 'Отменить'
      }).then((result) => {
        if (result.isConfirmed) {

        }
      })
    },
  },
  async mounted() {
    moment.locale('ru')
    await this.getLessons();
  }
}
</script>

<style scoped>
.noHover {
  pointer-events: none;
}
</style>
