<template>
  <li
      class="mb-2 border-0 list-group-item d-flex justify-content-between border-radius-lg ps-0">
    <div class="d-flex align-items-center">
      <div class="text-center shadow icon icon-shape bg-gradient-dark icon-md mx-2">
        <icon-view :img="subject.icon" size="lg" color="rgb(226, 231, 231)"></icon-view>
      </div>
      <div class="d-flex flex-column">
        <router-link v-if="isAdmin($store.state.currentUser)"
                     :to="{ path: `/subjects/${subject.id}` }"
        >
          <h6 class="mb-1 text-sm text-dark">{{ subject.name }}</h6>
        </router-link>
        <h6 v-if="!isAdmin($store.state.currentUser)" class="mb-1 text-sm text-dark cursor-pointer">{{
            subject.name
          }}</h6>
      </div>
    </div>
    <div class="d-flex">

      <button
          class="my-auto btn btn-link btn-icon-only btn-rounded btn-sm text-dark icon-move-right">
        <router-link
            v-if="isAdmin($store.state.currentUser)"
            :to="{ path: `/subjects/${subject.id}` }">
          <i class="ni ni-bold-right" aria-hidden="true"></i>
        </router-link>
        <i v-if="!isAdmin($store.state.currentUser)" class="ni ni-bold-right" aria-hidden="true"></i>
      </button>

    </div>
  </li>
</template>

<script>
import IconView from "../../../components/IconView";
import usersRoleMixin from "@/mixins/usersRoleMixin";

export default {
  name: "category-card",
  components: {
    IconView
  },
  mixins: [usersRoleMixin],
  props: {
    subject: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
