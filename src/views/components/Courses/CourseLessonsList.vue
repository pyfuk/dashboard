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
            <th v-if="isMovedLessonExists">

            </th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
              {{ $t('lessons.actions') }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="lesson in lessons" :key="lesson.id">
            <td class="text-sm" :class="lesson.moved_to ? 'text-decoration-line-through': ''">
              <span class="ms-2">
                              {{ getStartDate(lesson.start, lesson.end) }}
              </span>
            </td>
            <td class="text-sm" :class="lesson.moved_to ? 'text-decoration-line-through': ''">
              <span>{{ lesson.teacher.firstname }} {{ lesson.teacher.lastname }}</span>
            </td>
            <td class="align-middle text-sm">
              <span class="badge badge-sm"
                    :class="`${lesson.paid ? 'bg-gradient-success' : 'bg-gradient-warning'} ${ lesson.moved_to ? 'text-decoration-line-through': ''}`">
                {{ lesson.paid ? $t('lessons.paid') : $t('lessons.un_paid') }}
              </span>
            </td>
            <td class="align-middle text-sm">
              <span @click="changeVisitState(lesson.id)" class="badge badge-sm cursor-pointer"
                    :class="`${lesson.visited ? 'bg-gradient-success' : 'bg-gradient-secondary'}  ${ lesson.moved_to ? 'text-decoration-line-through': ''}`">
                {{ lesson.visited ? $t('lessons.visited') : $t('lessons.absent') }}
              </span>
            </td>

            <td class="align-middle text-sm" v-if="isMovedLessonExists">
              <span class="badge badge-sm bg-gradient-danger">
                {{ lesson.moved_to ? $t('lessons.moved') : '' }}
              </span>
            </td>

            <td class="align-middle text-center text-sm">
              <i class="fa fa-pen cursor-pointer mx-2" @click="editLesson(lesson.id)"></i>
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
import moment from "moment-timezone";
import { useToast } from "vue-toastification";

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
      toast: useToast(),
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
      this.isLessonsLoading = false;
    },
    getStartDate(start, end) {
      const startTime = moment(start);
      const endTime = moment(end);
      return `${startTime.format('DD MMMM')} ${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`
    },
    async editLesson(lesson_id) {
      const lesson = this.lessons.find(lesson => lesson.id === lesson_id);


      const maxEditTime = moment().add(24, 'h');

      if (maxEditTime.isSameOrAfter(lesson.start) || lesson.moved_to) {
        this.toast.warning(this.$t('notifications.can_not_edit_lesson'));
        return;
      }

      await this.$router.push(`/users/${this.course.student.id}/lessons/lesson/edit/${lesson_id}`)
    },
    async changeVisitState(lesson_id) {
      const result = await this.$swal({
        title: '???? ???????????????',
        text: "?????????? ???????????????????????????? ????????????????, ?? ?????? ?????????? ????????.",
        icon: 'warning',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: '????, ????????????????????',
        cancelButtonText: '????????????????'
      });

      if (result.isConfirmed) {
        const data = {
          lesson_id: lesson_id,
        }
        await axios.post(server.URL + '/api/lessons/change_visited_state', data);

        const lessonIndex = this.lessons.findIndex(lesson => lesson.id === lesson_id);
        this.lessons[lessonIndex].visited = !this.lessons[lessonIndex].visited;
      }
    },
  },
  async mounted() {
    moment.locale('ru')
    await this.getLessons();
  },
  watch: {
    'course.active'() {
      this.lessons.forEach(lesson => lesson.paid = !lesson.paid)
    }
  },
  computed: {
    isMovedLessonExists() {
      return !!this.lessons.find(lesson => lesson.moved_to);
    }
  }
}
</script>

<style scoped>
.noHover {
  pointer-events: none;
}
</style>
