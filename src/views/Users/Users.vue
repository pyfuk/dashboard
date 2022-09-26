<template>
  <div class="mt-4 container-fluid">
    <div class=" row">
      <div class="col-8">
        <users-table/>
      </div>
      <div class="col-4">
        <add-user-form action="add"></add-user-form>
      </div>
    </div>
  </div>
</template>

<script>
import UsersTable from "../components/UsersTable";
import Card from "../../examples/Cards/Card";
import AddUserForm from "@/views/components/User/AddUserForm";

export default {
  name: "users",
  components: {
    AddUserForm,
    UsersTable,
    Card,
  },
};
</script>
