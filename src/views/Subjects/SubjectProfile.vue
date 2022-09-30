<template>
  <div class="row">
    <div class="col-12 col-md-6">
      <add-subject-form action="edit" :subject="subject" @subjectEdited="subjectEdited" class="mt-4"/>
    </div>
    <div class="col-12 col-md-6">
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
  methods: {
    subjectEdited(subject) {
      this.$emit('subjectEdited', subject)
    }
  }
}
</script>

<style scoped>

</style>
