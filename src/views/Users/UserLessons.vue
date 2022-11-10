<template>
  <div class="card mt-4">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>{{ $t('courses.courses') }}</h6>
      <argon-button v-if="isStudent(user)" color="success" @click="$router.push(`lessons/add`)">{{
          $t('common.add')
        }}
      </argon-button>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table v-if="courses.length && !isCoursesLoading" class="table align-items-center mb-0">
          <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('courses.name') }}
            </th>
            <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
            >{{ $t('courses.teacher') }}
            </th>
            <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
            >{{ $t('courses.status') }}
            </th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
              {{ $t('lessons.actions') }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td>
              <div class="d-flex px-2 py-1">
                <div class="text-center shadow icon icon-shape bg-gradient-dark icon-md mx-2">
                  <icon-view :img="course.subject.icon" size="lg" color="rgb(226, 231, 231)"></icon-view>
                </div>
                <div class="d-flex flex-column justify-content-center cursor-pointer"
                     @click="$router.push(`/courses/${course.id}`)">
                  <h6 class="mb-0 text-lg">{{ course.subject.name }}</h6>
                </div>
              </div>
            </td>
            <td>
              <p class="text-md font-weight-bold mb-0">{{ course.teacher.firstname }} {{ course.teacher.lastname }}</p>
            </td>

            <td class="text-sm">
              <span @click="changeCoursePayStatus(course.id)" class="badge badge-sm cursor-pointer"
                    :class="course.active ? 'bg-gradient-success' : 'bg-gradient-danger'">{{
                  course.active ? $t('courses.paid') : $t('courses.unpaid')
                }}</span>
            </td>
            <td class="align-middle text-center text-sm">
              <i class="fa fa-pen cursor-pointer" @click="editCourse(course.id)"></i>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else-if="!isCoursesLoading" class="d-flex justify-content-center my-2">
          <span class="text-secondary text-3xl font-weight-bold">{{ $t('common.no_data') }}</span>
        </div>

        <div class="d-flex justify-content-center my-2" v-if="isCoursesLoading">
          <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card mt-4">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>{{ $t('courses.one_time') }}</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table v-if="one_time_lessons.length && !isOneTimeLessonsLoading" class="table align-items-center mb-0">
          <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('courses.name') }}
            </th>
            <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
            >{{ $t('courses.teacher') }}
            </th>
            <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
            >{{ $t('courses.date') }}
            </th>
            <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
            >{{ $t('courses.status') }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="lesson in one_time_lessons" :key="lesson.id">
            <td>
              <div class="d-flex px-2 py-1">
                <div class="text-center shadow icon icon-shape bg-gradient-dark icon-md mx-2">
                  <icon-view :img="lesson.subject.icon" size="lg" color="rgb(226, 231, 231)"></icon-view>
                </div>
                <div class="d-flex flex-column justify-content-center"
                     @click="$router.push(`/lessons/${lesson.id}`)">
                  <h6 class="mb-0 text-lg">{{ lesson.subject.name }}</h6>
                </div>
              </div>
            </td>
            <td>
              <p class="text-md font-weight-bold mb-0">{{ lesson.teacher.firstname }} {{ lesson.teacher.lastname }}</p>
            </td>
            <td>
              {{ lesson.start }}
            </td>
            <td class="text-sm">
              <span class="badge badge-sm cursor-pointer"
                    :class="lesson.paid ? 'bg-gradient-success' : 'bg-gradient-danger'">{{
                  lesson.paid ? $t('courses.paid') : $t('courses.unpaid')
                }}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else-if="!isOneTimeLessonsLoading" class="d-flex justify-content-center my-2">
          <span class="text-secondary text-3xl font-weight-bold">{{ $t('common.no_data') }}</span>
        </div>

        <div class="d-flex justify-content-center my-2" v-if="isOneTimeLessonsLoading">
          <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
import ArgonPagination from "@/components/ArgonPagination";
import ArgonPaginationItem from "@/components/ArgonPaginationItem";
import ArgonButton from "../../components/ArgonButton";
import { server, timeout } from "../../config";
import axios from "axios";
import utilsMixin from "../../mixins/utilsMixin";
import IconView from "../../components/IconView";
import usersRoleMixin from "@/mixins/usersRoleMixin";
import moment from "moment";

export default {
  components: {
    ArgonButton,
    ArgonPagination,
    ArgonPaginationItem,
    IconView
  },
  name: "user-lessons-table",
  mixins: [utilsMixin, usersRoleMixin],
  emits: ['userEdited'],
  props: {
    user: {
      type: Object,
      required: true
    },
    isMobile: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      courses: [],
      one_time_lessons: [],
      isCoursesLoading: true,
      isOneTimeLessonsLoading: true,
    }
  },
  computed: {},
  methods: {
    async getCourses() {
      this.isCoursesLoading = true;
      const data = {
        user_id: this.user.id,
        type: this.user.role
      }
      const response = await axios.post(server.URL + '/api/courses/get_courses', data);
      this.courses = response.courses;

      this.isCoursesLoading = false;
    },

    async getOneTimeLessons() {
      this.isOneTimeLessonsLoading = true;
      const data = {
        user_id: this.user.id,
        type: this.user.role
      }
      const response = await axios.post(server.URL + '/api/lessons/get_one_time_lessons', data);
      this.one_time_lessons = response.lessons.map(lesson => {
        return {
          ...lesson,
          start: moment(lesson.start).locale('ru').format('LL')
        }
      });

      this.isOneTimeLessonsLoading = false;
    },

    async editCourse(course_id) {
      await this.$router.push(`/users/${this.user.id}/lessons/course/edit/${course_id}`)
    },
    async changeCoursePayStatus(course_id) {
      const result = await this.$swal({
        title: 'Вы уверены?',
        text: "После редактирования предмета, у вас будет член.",
        icon: 'warning',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Да, продолжить',
        cancelButtonText: 'Отменить'
      });

      if (result.isConfirmed) {
        const data = {
          course_id: course_id,
        }
        await axios.post(server.URL + '/api/courses/change_activate_state', data);

        const courseIndex = this.courses.findIndex(course => course.id === course_id);
        this.courses[courseIndex].active = !this.courses[courseIndex].active;
      }
    },
  },
  async mounted() {
    await this.sleep(timeout.LIST_SLEEP);
    await this.getCourses();
    await this.getOneTimeLessons();
  }
}
</script>

<style scoped>

</style>
