<template>
  <div class="mt-4">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-7 col-xl-7 col-xxl-8"
           :class="{'col-md-12 col-lg-12 col-xl-12 col-xxl-12': !isCurrentUserEqualToUser && !isTeacher(user)}">
        <add-user-form action="edit" :user="user" @userEdited="userEdited"></add-user-form>
      </div>
      <div class="col-12 col-md-6 col-lg-5 col-xl-5 col-xxl-4" :class="{'my-4': isMobile}">
        <change-password-form v-if="isCurrentUserEqualToUser"></change-password-form>
        <add-subject-form v-if="isTeacher(user)"></add-subject-form>
      </div>
    </div>

    <div class="row" v-if="isTeacher(user)">
      <div class="col">
        <div class="card" :class="isMobile ? 'mb-4' : 'my-4'">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center justify-content-between">
              <h6 class="mb-0">{{ $t('users.inactive_time') }}</h6>
              <argon-button v-if="inactiveEdit" color="success" @click="addTeacherInactiveTime">
                {{ $t('common.save') }}
              </argon-button>
              <argon-button v-if="!inactiveEdit && isAdmin($store.state.currentUser)" color="success"
                            @click="editInactiveTime">
                {{ $t('common.edit') }}
              </argon-button>
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
import FullCalendar from "@fullcalendar/vue3";
import ArgonButton from "@/components/ArgonButton";
import axios from "axios";
import { server } from "@/config";
import ChangePasswordForm from "@/views/components/User/ChangePasswordForm";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import utilsMixin from "@/mixins/utilsMixin";
import { useToast } from "vue-toastification";

export default {
  name: "UserProfile",
  components: { ChangePasswordForm, AddSubjectForm, AddUserForm, FullCalendar, ArgonButton },
  mixins: [usersRoleMixin, utilsMixin],
  // beforeRouteEnter(to, from, next) {
  //   if (usersRoleMixin.methods.isStudent(store.state.currentUser)) {
  //     next(`/users/${store.state.currentUser.id}/calendar`);
  //   }
  //   next()
  // },
  props: {
    user: {
      type: Object
    },
    isMobile: Boolean
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
        height: "auto",
        dayHeaderFormat: { weekday: 'short' }, // Название дней недели
        events: [],
        allDaySlot: false, // Показывать в шапке доп окно полного дня
        slotMinTime: '09:00:00',
        slotMaxTime: '21:00:00',
        slotDuration: '00:45:00',
        slotLabelInterval: '00:45:00',
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          omitZeroMinute: false,
        },
        selectable: false,
        selectOverlap: false,
        select: this.selectedEvent,
        eventClick: this.clickEvent,
      },
      eventCounter: 0,
      dates: [],
      inactive_times: [],
      toast: useToast(),
      inactiveEdit: false,
    }
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

      this.dates = [...this.dates, {
        id,
        weekDay: event.start.getDay(),
        startTime: this.addZero(event.start.getHours()) + ":" + this.addZero(event.start.getMinutes()),
        endTime: this.addZero(event.end.getHours()) + ":" + this.addZero(event.end.getMinutes()),
        millis: event.start.getTime()
      }]

    },
    async addTeacherInactiveTime() {
      const data = {
        teacher_id: this.user.id,
        dates: this.dates
      }

      await axios.post(server.URL + '/api/users/add_teacher_inactive_time', data);
      this.toast.success(this.$t('notifications.add_inactive_time_to_teacher'))
      this.inactiveEdit = false;

      this.calendarOptions.events = this.calendarOptions.events.map(event => {
            const id = this.eventCounter++;
            return {
              id,
              groupId: 'inactive',
              start: event.start,
              end: event.end,
              color: '#BFBFBF',
              display: 'background',
              overlap: false,
            }
          }
      )

    },
    async getTeacherInactiveTime() {
      const data = {
        teacher_id: this.user.id,
      }
      const res = await axios.post(server.URL + '/api/users/get_teacher_inactive_time', data)

      this.inactive_times = res.inactive_time;

      this.calendarOptions.events = res.inactive_time.map(res => {
        const id = this.eventCounter++;
        return {
          id,
          groupId: 'inactive',
          start: res.start,
          end: res.end,
          color: '#BFBFBF',
          display: 'background',
          overlap: false,
        }
      })
    }
    ,
    userEdited(user) {
      this.$emit('userEdited', user)
    },
    editInactiveTime() {
      this.inactiveEdit = true;
      this.calendarOptions.selectable = true;

      this.calendarOptions.events = this.inactive_times.map(event => {

        const id = this.eventCounter++;

        this.dates.push({
          id,
          weekDay: new Date(event.start).getDay(),
          startTime: this.addZero(new Date(event.start).getHours()) + ":" + this.addZero(new Date(event.start).getMinutes()),
          endTime: this.addZero(new Date(event.end).getHours()) + ":" + this.addZero(new Date(event.end).getMinutes()),
          millis: new Date(event.start).getTime()
        })

        return {
          id,
          start: event.start,
          end: event.end,
          color: '#BFBFBF',
          overlap: false,
        }
      })
    },
    clickEvent(event) {
      if (event.event.display === 'background') {
        return
      }
      this.dates = this.dates.filter(d => d.id != event.event.id);
      this.calendarOptions.events = this.calendarOptions.events.filter(e => e.id != event.event.id);
    }
  },
  mounted() {
    if (this.isTeacher(this.user)) {
      this.getTeacherInactiveTime()
    }
  }
  ,
  computed: {
    isCurrentUserEqualToUser() {
      return this.$store.state.currentUser.id === this.user.id;
    }
  }
}
</script>

<style>
.fc .fc-timegrid-col.fc-day-today {
  background-color: inherit !important;
}
</style>
