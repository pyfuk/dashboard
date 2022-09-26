<template>
  <div class="card">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>Пользователи</h6>
      <argon-button color="success" @click="$router.push('/users/add')">Создать пользователя</argon-button>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table v-if="users.length && !isUsersLoading" class="table align-items-center mb-0">
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
          <tr v-for="user in users" :key="user.id">
            <td>
              <div class="d-flex px-2 py-1">
                <div>
                  <img
                      src="../../assets/img/team-2.jpg"
                      class="avatar avatar-sm me-3"
                      alt="user1"
                  />
                </div>
                <div class="d-flex flex-column justify-content-center">
                  <router-link
                      :to="{ path: `/users/${user.id}` }"
                  >
                    <h6 class="mb-0 text-sm">{{ user.firstname }} {{ user.lastname }}</h6>
                  </router-link>
                </div>
              </div>
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0">{{ user.role }}</p>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="badge badge-sm" :class="`${user.active ? 'bg-gradient-success' : 'bg-gradient-secondary'}`">{{ user.active ? 'Активирован' : 'Деактивирован' }}</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ user.balance }}</span>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else-if="!isUsersLoading" class="d-flex justify-content-center my-2">
          <span class="text-secondary text-3xl font-weight-bold">Нет данных</span>
        </div>

        <div class="d-flex justify-content-center my-2" v-if="isUsersLoading">
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
import axios from "axios";
import utilsMixin from "../../mixins/utilsMixin";
import { server, timeout } from "../../config";

export default {
  components: {
    ArgonButton,
    ArgonPagination,
    ArgonPaginationItem,
  },
  name: "users-table",
  mixins: [utilsMixin],
  data() {
    return {
      users: [],
      isUsersLoading: true,
    }
  },
  methods: {
    async getUsers() {
      this.isUsersLoading = true;
      const response = await axios.post(server.URL + '/api/users/get_all');
      this.users = response.users;
      this.isUsersLoading = false;
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
