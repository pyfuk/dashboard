<template>
  <div class="row">
    <div class="col-4">
      <add-subject-form class="mt-4"/>
    </div>
    <div class="col-8">
      <subject-teacher-table :subject="subject"/>
    </div>

  </div>
</template>

<script>
import AddSubjectForm from "@/views/components/Subjects/AddSubjectForm";
import SubjectTeacherTable from "@/views/components/Subjects/SubjectTeacherTable";

export default {
  name: "SubjectProfile",
  components: { SubjectTeacherTable, AddSubjectForm },
  props: {
    subject: {
      type: Object
    }
  },
}
</script>

<style scoped>

</style>
