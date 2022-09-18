<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-12 col-sm-7 col-md-8">
        <subjects-table :subjects="subjects"/>
      </div>
      <div class="col-12 col-sm-5 col-md-4">
        <add-subject-form/>
      </div>
    </div>
  </div>
</template>

<script>
import SubjectsTable from "../components/Subjects/SubjectsTable";
import AddSubjectForm from "../components/Subjects/AddSubjectForm";
import { mapActions, mapState } from "vuex";

export default {
  name: "Subjects",
  components: { AddSubjectForm, SubjectsTable },
  computed: {
    ...mapState({
      subjects: state => state.subjects.subjects,
    })
  },
  methods: {
    ...mapActions({
      getSubjects: 'subjects/getSubjects'
    })
  },
  mounted() {
    this.getSubjects();
  },
}
</script>

<style scoped>

</style>
