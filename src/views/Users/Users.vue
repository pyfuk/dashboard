<template>
  <div class="mt-4 container-fluid">
    <div class=" row">
      <div class="col-12 col-md-7 col-xl-8">
        <users-table/>
      </div>
      <div class="col-12 col-md-5 col-xl-4" :class="{'pt-4': isMobile}">
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
  data() {
    return {
      windowWidth: window.innerWidth,
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }
  },
  computed: {
    isMobile() {
      return this.windowWidth <= 767
    }
  },
};
</script>
