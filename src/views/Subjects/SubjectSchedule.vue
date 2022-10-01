<template>
  <div class="my-4">
    <group-subjects-schedule-table :subject="subject"/>
  </div>

  <!--  <div class="row">-->
  <!--    <div class="col">-->
  <!--      <div class="card my-4">-->
  <!--        <div class="card-header pb-0">-->
  <!--          <div class="d-flex align-items-center justify-content-between">-->
  <!--            <h6 class="mb-0">Расписание</h6>-->
  <!--            <argon-select class="mx-2" v-model="form.teacher"-->
  <!--                          :options="teachers"></argon-select>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--        <div class="card-body pt-0">-->
  <!--          <FullCalendar ref="fullCalendar" :options="calendarOptions"/>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
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
      calendarOptions: {
        headerToolbar: {
          left: false,
          center: false,
          right: false
        },
        plugins: [timeGridPlugin, interactionPlugin],
        locale: 'ru',
        timeZone: 'local',
        // contentHeight: this.isMobile ? 415 : 500,

        height: "auto",
        defaultView: 'dayGridWeek',
        dayHeaderFormat: { weekday: 'short' },
        events: [],
        dateClick: this.handleDateClick,
        viewDidMount: this.viewDidMount,


        // Timeline настройка
        allDaySlot: false,
        slotMinTime: '09:00:00',
        slotMaxTime: '21:00:00',
        slotDuration: '00:45:00',
        slotLabelInterval: '00:45:00',
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          omitZeroMinute: false,
        },
        // Event Drag and Resize

        // editable: true,
        // eventDurationEditable: false,
        // eventDrop: this.eventDropped,


        //select

        selectable: true,
        selectOverlap: false,
        select: this.selectedEvent,


        eventClick: this.eventClicked,
      },
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
