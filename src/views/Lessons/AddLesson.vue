<template>

  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-4">
        <add-lesson-form :dates="dates"></add-lesson-form>
      </div>
      <div class="col-8">
        <div class="card">
          <div class="card-body">
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

export default {

  name: "AddLesson",
  components: {
    AddLessonForm,
    FullCalendar, // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
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
        contentHeight: 720,
        defaultView: 'dayGridMonth',
        navLinks: true, //Переход по датам
        events: [],
        dateClick: this.handleDateClick,
        viewDidMount: this.viewDidMount,

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
      dates: []
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
    }
  },

  mounted() {
  }
}
</script>

<style scoped>

</style>
