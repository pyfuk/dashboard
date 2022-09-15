<template>
  <div class="card">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>Subjects</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Название</th>
            <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
            >Количество занятий
            </th>
            <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
            >Стоимость
            </th>
            <th class="text-secondary opacity-7"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="subject in subjects" :key="subject._id">
            <td>
              <div class="d-flex px-2 py-1">
                <div class="text-center shadow icon icon-shape bg-gradient-dark icon-md mx-2">
                  <icon-view :img="subject.icon" size="lg" color="rgb(226, 231, 231)"></icon-view>
                </div>
                <div class="d-flex flex-column justify-content-center" @click="$router.push(`/users/${subject._id}`)">
                  <h6 class="mb-0 text-sm">{{ subject.name }}</h6>
                </div>
              </div>
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0">{{ subject.lessons_count }}</p>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ subject.cost }}</span>
            </td>
            <td class="align-middle">
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

import ArgonPagination from "../../../components/ArgonPagination";
import ArgonPaginationItem from "../../../components/ArgonPaginationItem";
import IconView from "../../../components/IconView";

export default {
  name: "SubjectsTable",
  components: {
    ArgonPagination,
    ArgonPaginationItem,
    IconView
  },
  props: {
    subjects: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>