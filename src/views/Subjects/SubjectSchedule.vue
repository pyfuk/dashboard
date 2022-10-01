<template>
  <div class="my-4">
    <group-subjects-schedule-table :subject="subject"/>
  </div>
</template>

<script>
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/vue3";
import ArgonButton from "@/components/ArgonButton";
import axios from "axios";
import { server } from "@/config";
import ArgonSelect from "@/components/ArgonSelect";
import GroupSubjectsScheduleTable from "@/views/components/Subjects/GroupSubjectsScheduleTable";

export default {
  name: "SubjectSchedule",
  components: { GroupSubjectsScheduleTable, FullCalendar, ArgonButton, ArgonSelect },
  props: {
    subject: {
      type: Object
    }
  },
  data() {
    return {

      teachers: [],
      form: {
        teacher: ''
      }
    }
  },
  methods: {
    async getSubjectTeachers() {
      const data = {
        subject_id: this.subject.id
      }
      const response = await axios.post(server.URL + '/api/subjects/get_teachers_by_subject', data);

      this.teachers = response.teachers.map(t => {
        return {
          name: t.firstname + ' ' + t.lastname,
          value: t.id
        }
      });
    },
    async getTeacherLessons() {
      const data = {
        teacher_id: this.form.teacher,
      }
      const res = await axios.post(server.URL + '/api/courses/get_teacher_reserved_time', data)

      this.calendarOptions.events = res.reserved.map(res => {
        return {
          groupId: 'reserved',
          start: res.start,
          end: res.end,
          color: 'red',
          display: 'background',
          overlap: false,
        }
      })

      const inactive_time = res.inactive_time.map(res => {
        return {
          groupId: 'inactive',
          start: res.start,
          end: res.end,
          color: '#BFBFBF',
          display: 'background',
          overlap: false,
        }
      })

      this.calendarOptions.events = this.calendarOptions.events.concat(inactive_time);
    },
  },
  watch: {
    'form.teacher'() {
      this.getTeacherLessons()
    }
  },
  async mounted() {
    await this.getSubjectTeachers();
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 0;
}
</style>
