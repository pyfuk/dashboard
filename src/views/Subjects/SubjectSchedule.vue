<template>
  <div class="my-4">
    <group-subjects-schedule-table :subject="subject"/>
  </div>
</template>

<script>
import GroupSubjectsScheduleTable from "@/views/components/Subjects/GroupSubjectsScheduleTable";

export default {
  name: "SubjectSchedule",
  components: { GroupSubjectsScheduleTable, },
  props: {
    subject: {
      type: Object
    }
  },
}
</script>

<style scoped>

</style>
