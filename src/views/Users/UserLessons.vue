<template>
  <div class="card mt-4">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>Курсы</h6>
      <argon-button color="success" @click="$router.push(`lessons/add`)">Добавить курс</argon-button>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table v-if="courses.length && !isCoursesLoading" class="table align-items-center mb-0">
          <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Название</th>
            <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
            >Учитель
            </th>

            <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
            >Время
            </th>
            <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
            >Статус
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
                <div class="d-flex flex-column justify-content-center"
                     @click="$router.push(`/courses/${course.id}`)">
                  <h6 class="mb-0 text-lg">{{ course.subject.name }}</h6>
                </div>
              </div>
            </td>
            <td>
              <p class="text-md font-weight-bold mb-0">{{ course.teacher.firstname }} {{ course.teacher.lastname }}</p>
            </td>
            <td>
              <div v-for="date in course.date" :key="date.weekName" class="d-flex">
                <p class="text-xs font-weight-bold mb-0 w-25">
                  {{ date.weekName }}:
                </p>
                <p class="text-xs font-weight-bold mb-0">
                  {{ date.startTime }} - {{ date.endTime }}
                </p>
              </div>
            </td>
            <td class="text-sm">
              <span class="badge badge-sm" :class="course.active ? 'bg-gradient-success' : 'bg-gradient-danger'">{{
                  course.active ? 'Активный' : 'Не активный'
                }}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else-if="!isCoursesLoading" class="d-flex justify-content-center my-2">
          <span class="text-secondary text-3xl font-weight-bold">Нет данных</span>
        </div>

        <div class="d-flex justify-content-center my-2" v-if="isCoursesLoading">
          <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer p-3 ms-auto">
      <argon-pagination color="success">
        <argon-pagination-item prev/>
        <argon-pagination-item label="1" active/>
        <argon-pagination-item label="2" disabled/>
        <argon-pagination-item label="3"/>
        <argon-pagination-item next/>
      </argon-pagination>
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

export default {
  components: {
    ArgonButton,
    ArgonPagination,
    ArgonPaginationItem,
    IconView
  },
  name: "user-lessons-table",
  mixins: [utilsMixin],
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      courses: [],
      isCoursesLoading: true,
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

      console.log(this.courses)
      this.isCoursesLoading = false;
    }
  },
  async mounted() {
    await this.sleep(timeout.LIST_SLEEP);
    await this.getCourses();
  }
}
</script>

<style scoped>

</style>