<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-12 col-sm-7 col-md-8">
        <subjects-table/>
      </div>
      <div class="col-12 col-sm-5 col-md-4" :class="{'mt-4': isMobile}">
        <add-subject-form action="add"/>
      </div>
    </div>
  </div>
</template>

<script>
import SubjectsTable from "../components/Subjects/SubjectsTable";
import AddSubjectForm from "../components/Subjects/AddSubjectForm";

export default {
  name: "Subjects",
  components: { AddSubjectForm, SubjectsTable },
  data() {
    return {
      windowWidth: window.innerWidth,
    }
  },
  computed: {
    isMobile() {
      return this.windowWidth <= 767
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }
  }
}
</script>

<style scoped>

</style>
