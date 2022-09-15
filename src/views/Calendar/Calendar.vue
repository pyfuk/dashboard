<template>
  <div class="container-fluid">
    <div class=" row">
      <div class="col-3">
        <div class="card">
          <div class="card-body"></div>
        </div>
      </div>
      <div class="col-9">
        <div class="card">
          <div class="card-body p-4">
            <FullCalendar ref="fullCalendar" :options="calendarOptions"/>
          </div>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from "@fullcalendar/daygrid";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  components: {
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
        timeZone: 'UTC',
        contentHeight: 720,
        defaultView: 'dayGridMonth',
        navLinks: true, //Переход по датам
        events: [{
          title: 'aHAHHAH',
          date: '2022-06-23'
        },
          {
            title: 'BRFR',
            date: '2022-06-22'
          }],
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
      }
    }
  }
  ,
  methods: {
    handleDateClick: function (arg) {
      // let calendarApi = this.$refs.fullCalendar.getApi();
      console.log(arg)
      // calendarApi.gotoDate('2022-05-13');
    },
    viewDidMount: function (arg) {
      if (arg.view.type === 'dayGridMonth') {
        this.calendarOptions.events = []
        return;
      }

      this.calendarOptions.events = [
        {
          id: 'SHAXBOZ',
          title: 'aHAHHAH',
          start: '2022-06-25T10:00:00',
          end: '2022-06-25T12:00:00',
          color: '#03fcec'
        },
        {
          start: '2022-06-22T15:00:00',
          end: '2022-06-22T17:00:00'
        }]
    },
    eventDropped: function (info) {

      console.log(info.event.id)
    }

  },
  eventDropped: function (eventDropInfo) {
    console.log(eventDropInfo)
  }
}
</script>

<style scoped>

</style>