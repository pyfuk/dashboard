<template>
  <div class="card mt-4">
    <div class="card-body p-4">
      <FullCalendar ref="fullCalendar" :options="calendarOptions"/>
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
import axios from "axios";
import { server } from "../../config";

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
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
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit'
        },
        displayEventEnd: true,
      },
      lessons: []
    }
  },
  methods: {
    async getLessons() {
      const data = {
        user_id: this.user.id,
        type: this.user.role
      }
      const response = await axios.post(server.URL + '/api/lessons/get_lessons', data);

      const lessons = response.lessons.map(lesson => {
        return {
          ...lesson,
          title: lesson.subject.name,
          color: lesson.paid ? 'blue' : 'red'
        }
      })

      this.calendarOptions.events = lessons;
    }

  },
  mounted() {
    this.getLessons();
  },
}
</script>

<style scoped>

</style>