<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <add-user-form action="add"></add-user-form>
    </div>
  </div>
</template>

<script>
import AddUserForm from "../components/User/AddUserForm";

export default {
  components: { AddUserForm },
  name: "UserAdd"
}
</script>

<style scoped>

</style>