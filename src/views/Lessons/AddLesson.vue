<template>

  <div class="mt-4">
    <div class="row">
      <div class="col-md-3">
        <add-lesson-form :dates="dates" :edit="edit" @form="getFormData" @removeEvent="removeEvent"
                         @onetime="changedOneTime"></add-lesson-form>
      </div>
      <div class="col-md-9" :class="{'mt-4': isMobile}">
        <div class="card">
          <div class="card-body">
            <div :class="{'overlay': overlay}"></div>
            <FullCalendar ref="fullCalendar" :options="calendarOptions" id="AddLessonCalendar"/>
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
import ruLocale from '@fullcalendar/core/locales/ru';
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import axios from "axios";
import { server } from "@/config";
import moment from "moment-timezone";

export default {

  name: "AddLesson",
  components: {
    AddLessonForm,
    FullCalendar,
  },
  props: {
    isMobile: {
      type: Boolean,
      required: true
    },
    edit: {
      type: String,
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
        footerToolbar: false,
        plugins: [timeGridPlugin, interactionPlugin, momentTimezonePlugin],
        locales: [ruLocale],
        locale: 'ru',
        timeZone: 'Asia/Tashkent',
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

        editable: true,
        eventDurationEditable: false,
        eventDrop: this.eventDropped,

        //select

        selectable: true,
        selectOverlap: this.isAllowOverlap,
        select: this.selectedEvent,
        selectAllow: this.isSelectAllow,


        // eventClick: this.eventClicked,
      },
      dates: [],
      overlay: true,
      eventCounter: 0,
      course: '',
      editCourseLessons: [],
      editLesson: '',
      isOneTime: false,
      oneTimeLessons: [],
      inactiveCalendarTime: [],
      oneTimeLessonsForCourse: [],
      lesson: '',
      teacher_id: '',
      calendarApi: '',
      formInputs: {
        isGroupSubject: false,
        groupScheduleDates: [],
        teacher: ''
      }
    }
  },
  methods: {
    isAllowOverlap(event) {
      return event.overlap;
    },

    isSelectAllow(event) {
      if (this.isOneTime && moment().add('24', 'h').isAfter(event.start)) {
        return false
      }

      const diff = moment(event.end).diff(event.start, 'minutes');
      return diff === 45;
    },
    selectedEvent(event) {
      const id = this.eventCounter++;
      this.calendarOptions.events = [...this.calendarOptions.events,
        {
          id,
          start: event.start,
          end: event.end,
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

    async getCalendarActivity() {
      if (this.isOneTime) {
        await this.getCalendarActivityForOneTime();
      } else {
        await this.getCalendarActivityForCourse();
      }

      if (this.edit === 'course') {
        this.calendarOptions.events = this.calendarOptions.events.concat(this.editCourseLessons)
      }

      if (this.edit === 'lesson') {
        this.calendarOptions.events = this.calendarOptions.events.concat(this.editLesson)
      }
    },

    async getCalendarActivityForCourse() {
      const calendar_activity = await axios.post(server.URL + '/api/calendar/get_calendar_activity_for_course', {
        teacher_id: this.formInputs.teacher,
      });

      this.calendarOptions.events = calendar_activity.coursesTime;
      this.calendarOptions.events = this.calendarOptions.events.concat(calendar_activity.inactiveTime);
      this.calendarOptions.events = this.calendarOptions.events.concat(calendar_activity.groupTime);
      this.calendarOptions.events = this.calendarOptions.events.concat(calendar_activity.oneTime);

      if (this.formInputs.isGroupSubject) {
        this.calendarOptions.selectable = false;
        this.calendarOptions.editable = false;
        this.calendarOptions.events = this.calendarOptions.events.filter(e => e.id != 'groupSchedule');

        const scheduleEvents = this.getEditEvents(this.formInputs.groupScheduleDates, 'groupSchedule');
        this.dates = scheduleEvents;
        this.calendarOptions.events = this.calendarOptions.events.concat(scheduleEvents);
      }
    },

    async getCalendarActivityForOneTime() {
      const calendar_activity = await axios.post(server.URL + '/api/calendar/get_calendar_activity_for_one_time', {
        teacher_id: this.formInputs.teacher,
      });

      this.calendarOptions.events = calendar_activity.coursesTime;
      this.calendarOptions.events = this.calendarOptions.events.concat(calendar_activity.inactiveTime);
      this.calendarOptions.events = this.calendarOptions.events.concat(calendar_activity.groupTime);
      this.calendarOptions.events = this.calendarOptions.events.concat(calendar_activity.oneTime);
      this.calendarOptions.events = this.calendarOptions.events.concat(calendar_activity.inactiveCalendarTime)
      this.calendarOptions.events = this.calendarOptions.events.concat(calendar_activity.activeCalendarTime)
    },

    eventDropped(params) {
      const datesIndex = this.dates.findIndex(event => event.id == params.event.id);
      const calendarIndex = this.calendarOptions.events.findIndex(event => event.id == params.event.id);

      this.dates[datesIndex] = params.event;
      this.calendarOptions.events[calendarIndex] = {
        id: params.event.id,
        start: params.event.start,
        end: params.event.end,
      };
    },

    async getFormData(value) {
      this.formInputs.isGroupSubject = value.isGroupSubject;
      this.formInputs.groupScheduleDates = value.schedule;
      this.formInputs.teacher = value.teacher;

      if (value.isGroupSubject && !value.group) {
        this.overlay = true;
        return
      }

      if (value.teacher && value.subject) {
        this.overlay = false;
        this.calendarOptions.selectable = true;
        this.calendarOptions.editable = true;

        if (this.edit === 'course' && !value.isGroupSubject) {
          await this.getCourse(this.$route.params.course);
          this.editCourseLessons = this.getEditEvents(this.course.dates);
          this.dates = this.editCourseLessons;

        } else if (this.edit === 'lesson') {
          await this.getLesson(this.$route.params.lesson);
          this.editLesson = this.getEditEvents([this.lesson])
          this.dates = this.editLesson;
          this.calendarApi.gotoDate(this.editLesson[0].start);

        } else {
          this.dates = [];
        }
        await this.getCalendarActivity(value.teacher);
      } else {
        this.overlay = true;
      }
    },

    removeEvent(eventId) {
      this.dates = this.dates.filter(d => d.id != eventId);
      this.calendarOptions.events = this.calendarOptions.events.filter(e => e.id != eventId);
    },

    async changedOneTime(onetime) {
      this.isOneTime = onetime;

      if (this.formInputs.teacher) {
        await this.getCalendarActivity();
      }

      if (this.isOneTime) {
        this.calendarOptions = {
          ...this.calendarOptions,
          headerToolbar: {
            left: false,
            center: 'title',
            right: 'prev,next'
          },
          dayHeaderFormat: false,
          validRange: {
            start: moment().startOf('week').format('YYYY-MM-DD'),
            end: moment().add(4, 'w').endOf('week').add('1', 'd').format('YYYY-MM-DD')
          }
        }
        return;
      }

      this.calendarOptions = {
        ...this.calendarOptions,
        headerToolbar: {
          left: false,
          center: false,
          right: false
        },
        dayHeaderFormat: { weekday: 'short' },
        validRange: false
      }

      this.calendarApi.today();
    },

    getEditEvents(dates, new_id) {
      return dates.map(d => {
        return {
          id: new_id ?? this.eventCounter++,
          start: d.start,
          end: d.end,
        }
      })
    },

    async getCourse(course_id) {
      const courseResult = await axios.post(server.URL + '/api/courses/get', {
        course_id: course_id
      });
      this.course = courseResult.course;
    },
    async getLesson(lesson_id) {
      const lessonResult = await axios.post(server.URL + '/api/lessons/get', {
        lesson_id: lesson_id
      });
      this.lesson = lessonResult.lesson;
    },
  },
  async mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi();
  }
}
</script>

<style>
.overlay {
  position: absolute;
  left: 15px;
  top: 15px;
  right: 15px;
  bottom: 15px;
  backdrop-filter: blur(6px);
  z-index: 3;
}

#AddLessonCalendar td.fc-timegrid-col.fc-day {
  /*background-color: rgba(189, 243, 189, 0.3);*/
  background-color: inherit !important;
}

/*#AddLessonCalendar .fc .fc-timegrid-col.fc-day-today {*/
/*  background-color: rgba(189, 243, 189, 0.3) !important;*/
/*}*/

</style>
