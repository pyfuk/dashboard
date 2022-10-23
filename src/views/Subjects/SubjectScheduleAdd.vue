<template>
  <div class="row mt-4">
    <div class="col-4">
      <group-subject-schedule-add :dates="dates" @teacherChanged="teacherChanged"/>
    </div>
    <div class="col-8">
      <div class="card">
        <div class="card-body">
          <FullCalendar ref="fullCalendar" :options="calendarOptions"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GroupSubjectScheduleAdd from "@/views/components/Subjects/GroupSubjectScheduleAdd";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/vue3";
import axios from "axios";
import { server } from "@/config";

export default {
  name: "SubjectScheduleAdd",
  components: { GroupSubjectScheduleAdd, FullCalendar },
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
      eventCounter: 0,
      dates: []
    }
  },
  methods: {
    selectedEvent(event) {
      if (this.dates.length >= this.pass / 4) {
        return;
      }

      const id = this.eventCounter++;
      this.calendarOptions.events = [...this.calendarOptions.events,
        {
          id,
          start: event.start,
          end: event.end,
          overlap: false,
        }]

      this.dates = [...this.dates, {
        id,
        start: event.start,
        end: event.end
      }]

    },
    async getTeacherLessons(teacher) {
      const data = {
        teacher_id: teacher,
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

      const group_time = res.group_time.map(res => {
        return {
          groupId: 'group',
          start: res.start,
          end: res.end,
          color: 'red',
          display: 'background',
          overlap: false,
        }
      });

      this.calendarOptions.events = this.calendarOptions.events.concat(group_time);
      this.calendarOptions.events = this.calendarOptions.events.concat(inactive_time);
    },
    teacherChanged(teacher) {
      this.getTeacherLessons(teacher);
    }
  },
}
</script>

<style scoped>

</style>
