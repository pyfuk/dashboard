<template>
  <div class="mt-4">
    <div class="row">
      <div :class="[isTeacher(user) ? 'col-8': 'col-12' ]">
        <add-user-form action="edit"></add-user-form>
      </div>
      <div class="col-4" v-if="isTeacher(user)">
        <add-subject-form></add-subject-form>
      </div>
    </div>
  </div>
</template>

<script>

import AddSubjectForm from "../components/User/AddSubjectForm";
import usersRoleMixin from "../../mixins/usersRoleMixin";
import AddUserForm from "../components/User/AddUserForm";

export default {
  name: "UserProfile",
  components: { AddSubjectForm, AddUserForm },
  mixins: [usersRoleMixin],
  props: {
    user: {
      type: Object
    }
  },
  updated() {
    console.log(this.user)
  },
  methods: {}
}
</script>

<style scoped>

</style>