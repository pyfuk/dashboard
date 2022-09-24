<template>
  <div class="mt-4">
    <div class="row">
      <div :class="[isTeacher(user) ? 'col-8': 'col-12' ]">
        <add-user-form action="edit"></add-user-form>
      </div>
      <div class="col-4" v-if="isTeacher(user)">
        <add-subject-form></add-subject-form>
      </div>
    </div>

    <div class="row" v-if="isTeacher(user)">
      <div class="col">
        <div class="card my-4">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center justify-content-between">
              <h6 class="mb-0">Нерабочие часы</h6>
              <argon-button v-if="dates.length" color="success" @click="addTeacherInactiveTime">Добавить</argon-button>
            </div>
          </div>
          <div class="card-body pt-0">
            <FullCalendar ref="fullCalendar" :options="calendarOptions"/>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import AddSubjectForm from "../components/User/AddSubjectForm";
import usersRoleMixin from "../../mixins/usersRoleMixin";
import AddUserForm from "../components/User/AddUserForm";
import store from '../../store/index'
import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ArgonButton from "@/components/ArgonButton";
import axios from "axios";
import { server } from "@/config";

export default {
  name: "UserProfile",
  components: { AddSubjectForm, AddUserForm, FullCalendar, ArgonButton },
  mixins: [usersRoleMixin],
  beforeRouteEnter(to, from, next) {
    if (usersRoleMixin.methods.isStudent(store.state.currentUser)) {
      next(`/users/${store.state.currentUser.id}/calendar`);
    }
    next()
  },
  props: {
    user: {
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
      eventCounter: 0,
      dates: []
    }
  },
  updated() {
    console.log(this.user)
  },
  methods: {
    selectedEvent(event) {
      const id = this.eventCounter++;
      this.calendarOptions.events = [...this.calendarOptions.events,
        {
          id,
          start: event.start,
          end: event.end,
          overlap: false,
          color: '#BFBFBF'
        }]

      const startTime = this.addZero(event.start.getHours()) + ":" + this.addZero(event.start.getMinutes());
      const endTime = this.addZero(event.end.getHours()) + ":" + this.addZero(event.end.getMinutes());

      this.dates = [...this.dates, {
        weekDay: event.start.getDay(),
        startTime,
        endTime,
        millis: event.start.getTime()
      }]

    },
    async addTeacherInactiveTime() {
      const data = {
        teacher_id: this.user.id,
        dates: this.dates
      }

      await axios.post(server.URL + '/api/users/add_teacher_inactive_time', data)
    },
    async getTeacherInactiveTime() {
      const data = {
        teacher_id: this.user.id,
      }
      const res = await axios.post(server.URL + '/api/users/get_teacher_inactive_time', data)

      console.log(res)

      this.calendarOptions.events = res.inactive_time.map(res => {
        return {
          groupId: 'inactive',
          start: res.start,
          end: res.end,
          color: '#BFBFBF',
          display: 'background',
          overlap: false,
        }
      })
    },

    addZero(i) {
      if (i < 10) {
        i = "0" + i
      }
      return i;
    },
  },
  mounted() {
    this.getTeacherInactiveTime()
  }
}
</script>

<style>
.fc .fc-timegrid-col.fc-day-today {
  background-color: inherit !important;
}
</style>
