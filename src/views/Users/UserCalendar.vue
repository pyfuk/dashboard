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
import listPlugin from '@fullcalendar/list';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios";
import { server } from "../../config";

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    isMobile: {
      type: Boolean,
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
          left: false,
          center: 'title',
          right: 'prev,next'
        },
        footerToolbar: {
          left: false,
          center: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        },
        buttonText: {
          today: 'Сегодня',
          month: 'Месяц',
          week: 'Неделя',
          day: 'День',
          list: 'Лист'
        },
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        locale: 'ru',
        timeZone: 'local',
        contentHeight: this.isMobile ? 415 : 460,
        navLinks: true, //Переход по датам
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
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit'
        },
        displayEventEnd: true,
      },
      lessons: [],
      background: [],
      view: 'dayGridMonth'
    }
  },
  methods: {
    async getLessons() {
      const data = {
        user_id: this.user.id,
        type: this.user.role
      }
      const response = await axios.post(server.URL + '/api/lessons/get_lessons', data);

      this.lessons = response.lessons.map(lesson => {
        return {
          ...lesson,
          title: lesson.subject.name,
          color: lesson.paid ? 'blue' : 'red'
        }
      })

      this.background = response.background.map(date => {
        return {
          date: date.date,
          display: 'background',
          color: date.paid ? 'blue' : 'red'
        }
      })

      if (this.view == 'dayGridMonth') {
        this.calendarOptions.events = this.background;
      } else {
        this.calendarOptions.events = this.lessons;
      }
    },
    viewDidMount(params) {
      this.view = params.view.type;

      if (this.view == 'dayGridMonth' && this.background.length && this.lessons.length) {
        this.calendarOptions.events = this.background;
      } else {
        this.calendarOptions.events = this.lessons;
      }
    }

  },
  mounted() {
    this.getLessons();
  },
}
</script>

<style scoped>

</style>
