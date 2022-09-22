<template>
  <div class="card mt-4">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>Пользователи</h6>
      <argon-button color="success" @click="$router.push('/users/add')">Создать пользователя</argon-button>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table v-if="teachers.length && !isTeachersLoading" class="table align-items-center mb-0">
          <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Name</th>
            <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
            >Role
            </th>
            <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
            >Status
            </th>
            <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
            >Balance
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="teacher in teachers" :key="teacher.id">
            <td>
              <div class="d-flex px-2 py-1">
                <div>
                  <img
                      src="../../../assets/img/team-2.jpg"
                      class="avatar avatar-sm me-3"
                      alt="user1"
                  />
                </div>
                <div class="d-flex flex-column justify-content-center">
                  <router-link
                      :to="{ path: `/users/${teacher.id}` }"
                  >
                    <h6 class="mb-0 text-sm">{{ teacher.firstname }} {{ teacher.lastname }}</h6>
                  </router-link>
                </div>
              </div>
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0">{{ teacher.role }}</p>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="badge badge-sm bg-gradient-success">Online</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ teacher.balance }}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else-if="!isTeachersLoading" class="d-flex justify-content-center my-2">
          <span class="text-secondary text-3xl font-weight-bold">Нет данных</span>
        </div>

        <div class="d-flex justify-content-center my-2" v-if="isTeachersLoading">
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
import ArgonButton from "@/components/ArgonButton";
import ArgonPagination from "@/components/ArgonPagination";
import ArgonPaginationItem from "@/components/ArgonPaginationItem";
import utilsMixin from "@/mixins/utilsMixin";
import { server, timeout } from "@/config";
import axios from "axios";

export default {
  name: "SubjectTeacherTable",
  components: {
    ArgonButton,
    ArgonPagination,
    ArgonPaginationItem,
  },
  mixins: [utilsMixin],
  props: {
    subject: {
      type: Object
    }
  },
  data() {
    return {
      teachers: [],
      isTeachersLoading: true,
    }
  },
  methods: {
    async getUsers() {
      this.isTeachersLoading = true;

      const data = {
        subject_id: this.subject.id
      }
      const response = await axios.post(server.URL + '/api/subjects/get_teachers_by_subject', data);

      console.log(response)
      this.teachers = response.teachers;
      this.isTeachersLoading = false;
    }
  },
  async mounted() {
    await this.sleep(timeout.LIST_SLEEP);
    await this.getUsers();
  },
}
</script>

<style scoped>

</style>
