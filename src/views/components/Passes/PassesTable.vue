<template>
  <div class="card">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>Абонименты</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table v-if="passes.length && !isPassesLoading" class="table align-items-center mb-0">
          <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Name</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Lessons count
            </th>
            <th class="text-secondary opacity-7"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="pass in passes" :key="pass.id">
            <td>
              <div class="px-3">
                <h6 class="mb-0 text-sm">{{ pass.lessons_count }} дней</h6>
              </div>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ pass.lessons_count }}</span>
            </td>
            <td class="text-center">
              <a
                  href="javascript:;"
                  class="text-secondary font-weight-bold text-xs"
                  data-toggle="tooltip"
                  data-original-title="Edit user"
              >Edit</a>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else-if="!isPassesLoading" class="d-flex justify-content-center my-2">
          <span class="text-secondary text-3xl font-weight-bold">Нет данных</span>
        </div>

        <div class="d-flex justify-content-center my-2" v-if="isPassesLoading">
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
import ArgonButton from "@/components/ArgonButton";
import axios from "axios";
import utilsMixin from "../../../mixins/utilsMixin";
import { server, timeout } from "../../../config";

export default {
  components: {
    ArgonButton,
    ArgonPagination,
    ArgonPaginationItem,
  },
  name: "passes-table",
  mixins: [utilsMixin],
  data() {
    return {
      passes: [],
      isPassesLoading: true,
    }
  },
  methods: {
    async getPasses() {
      this.isPassesLoading = true;
      const response = await axios.post(server.URL + '/api/passes/get_all');
      this.passes = response.passes;
      this.isPassesLoading = false;
    }
  },
  async mounted() {
    await this.sleep(timeout.LIST_SLEEP);
    await this.getPasses();
  },
}
</script>

<style scoped>

</style>
