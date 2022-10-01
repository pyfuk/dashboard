<template>

  <div class="mt-4">
    <div class="row">
      <div class="col-md-3">
        <add-lesson-form :dates="dates" @form="getFormData" @removeEvent="removeEvent"
                         @changedPassForm="changedPassForm" @groupSchedule="groupSchedule"></add-lesson-form>
      </div>
      <div class="col-md-9" :class="{'mt-4': isMobile}">
        <div class="card">
          <div class="card-body">
            <div :class="{'overlay': overlay}"></div>
            <FullCalendar ref="fullCalendar" :options="calendarOptions"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddLessonForm from "../components/Lessons/AddLessonForm";
import axios from "axios";
import { server } from "@/config";

export default {

  name: "AddLesson",
  components: {
    AddLessonForm,
    FullCalendar, // make the <FullCalendar> tag available
  },
  props: {
    isMobile: {
      type: Boolean,
      required: true
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

        editable: true,
        eventDurationEditable: false,
        eventDrop: this.eventDropped,


        //select

        selectable: true,
        selectOverlap: false,
        select: this.selectedEvent,


        eventClick: this.eventClicked,
      },
      dates: [],
      overlay: true,
      pass: '4',
      eventCounter: 0
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
    eventClicked(eventClickInfo) {
      console.log(eventClickInfo.event.id)
    },
    async getTeacherLessons(teacher_id) {
      const data = {
        teacher_id: teacher_id,
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
    eventDropped(params) {
      const datesIndex = this.dates.findIndex(event => event.id == params.event.id);
      const calendarIndex = this.calendarOptions.events.findIndex(event => event.id == params.event.id);

      this.dates[datesIndex] = params.event;
      this.calendarOptions.events[calendarIndex] = {
        id: params.event.id,
        start: params.event.start,
        end: params.event.end,
        overlap: false
      };
    },
    getFormData(value) {
      if (value.teacher && value.subject) {
        this.overlay = false;

        this.getTeacherLessons(value.teacher)

      } else {
        this.overlay = true;
      }
    },
    removeEvent(eventId) {
      this.dates = this.dates.filter(d => d.id != eventId);
      this.calendarOptions.events = this.calendarOptions.events.filter(e => e.id != eventId);
    },
    changedPassForm(pass) {
      this.pass = pass;

      if (this.dates.length >= this.pass / 4) {
        for (let i = this.dates.length; i > this.pass / 4; i--) {
          const popped = this.dates.pop()
          this.calendarOptions.events = this.calendarOptions.events.filter(e => e.id != popped.id);
        }
      }
    },
    groupSchedule(schedule) {
      this.calendarOptions.events = this.calendarOptions.events.filter(e => e.id != 'groupSchedule');

      const scheduleEvents = schedule.map(sc => {
        return {
          id: 'groupSchedule',
          start: sc.startDate,
          end: sc.endDate,
        }
      })

      this.dates = scheduleEvents;

      this.calendarOptions.events = this.calendarOptions.events.concat(scheduleEvents);
    }
  },

  mounted() {
    console.log(this.calendarOptions.events)
  }
}
</script>

<style scoped>
.overlay {
  position: absolute;
  left: 15px;
  top: 15px;
  right: 15px;
  bottom: 15px;
  backdrop-filter: blur(6px);
  z-index: 3;
}
</style>
