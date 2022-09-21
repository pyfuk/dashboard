<template>

  <div class="mt-4">
    <div class="row">
      <div class="col-md-3">
        <add-lesson-form :dates="dates" @form="getFormData"></add-lesson-form>
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
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddLessonForm from "../components/Lessons/AddLessonForm";
import moment from "moment";

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
          center: 'title',
          right: 'prev,next'
        },
        footerToolbar: {
          left: false,
          center: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        buttonText: {
          today: 'Сегодня',
          month: 'Месяц',
          week: 'Неделя',
          day: 'День',
        },
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        locale: 'ru',
        timeZone: 'local',
        contentHeight: this.isMobile ? 415 : 650,
        defaultView: 'dayGridMonth',
        navLinks: true, //Переход по датам
        events: [],
        dateClick: this.handleDateClick,
        viewDidMount: this.viewDidMount,
        validRange: {
          start: moment().startOf('month').format('YYYY-MM-DD'),
          end: moment().add(1, "month").endOf('month').format('YYYY-MM-DD')
        },

        // Timeline настройка
        allDaySlot: false,
        slotMinTime: '09:00:00',
        slotMaxTime: '22:00:00',
        slotDuration: '00:30:00',
        slotLabelInterval: '00:30:00',
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          omitZeroMinute: false,
        },

        // Event Drag and Resize

        editable: true,
        eventDrop: this.eventDropped,


        //select

        selectable: true,
        select: this.selectedEvent,


        eventClick: this.eventClicked,
      },
      dates: [],
      overlay: true
    }
  },
  methods: {
    selectedEvent(event) {
      this.calendarOptions.events = [...this.calendarOptions.events,
        {
          id: this.calendarOptions.events.length + 1,
          start: event.start,
          end: event.end
        }]

      this.dates = [...this.dates, {
        id: this.calendarOptions.events.length + 1,
        start: event.start,
        end: event.end
      }]

    },
    eventClicked(eventClickInfo) {
      console.log(eventClickInfo.event.id)
    },
    getFormData(value) {
      if (value.teacher && value.subject) {
        this.overlay = false;
      } else {
        this.overlay = true;
      }
    }
  },

  mounted() {}
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
  z-index: 2;
}
</style>
