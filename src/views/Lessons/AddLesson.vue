<template>

  <div class="mt-4">
    <div class="row">
      <div class="col-md-3">
        <add-lesson-form :dates="dates" :edit="edit" @form="getFormData" @removeEvent="removeEvent"
                         @changedPassForm="changedPassForm"
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
        selectOverlap: false,
        select: this.selectedEvent,
        selectAllow: this.isSelectAllow,


        eventClick: this.eventClicked,
      },
      dates: [],
      overlay: true,
      pass: '4',
      eventCounter: 0,
      course: '',
      editCourseLessons: [],
      isOneTime: false,
      oneTimeLessons: [],
      inactiveCalendarDays: [],
      excludedEvents: [],
      oneTimeLessonsForCourse: [],
      lesson: '',
    }
  },
  methods: {
    isSelectAllow(event) {
      if (this.isOneTime && moment().add('24', 'h').isAfter(event.start)) {
        return false
      }

      const diff = moment(event.end).diff(event.start, 'minutes');
      return diff === 45;
    },
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
    async getTeacherLessons(teacher_id, isGroup, schedule) {
      const data = {
        teacher_id: teacher_id,
      }
      const res = await axios.post(server.URL + '/api/courses/get_teacher_reserved_time', data)

      const one_time_data = {
        user_id: teacher_id,
        type: 'teacher',
        for_calendar: true
      }

      const one_time_res = await axios.post(server.URL + '/api/lessons/get_one_time_lessons', one_time_data)

      this.oneTimeLessons = one_time_res.lessons;

      this.calendarOptions.events = res.reserved.map(res => {
        return {
          groupId: 'reserved',
          start: res.start,
          end: res.end,
          color: 'red',
          display: 'background',
          overlap: false,
          title: 'Антонов'
        }
      })

      const inactive_time = res.inactive_time.map(res => {
        return {
          groupId: 'inactive',
          start: res.start,
          end: res.end,
          color: '#333333',
          display: 'background',
          overlap: false,
        }
      })

      this.calendarOptions.events = this.calendarOptions.events.concat(inactive_time);

      this.oneTimeLessonsForCourse = res.one_time;
      const one_time_for_course = res.one_time.map(res => {
        return {
          groupId: 'one_time_for_course',
          start: res.start,
          end: res.end,
          color: 'red',
          display: 'background',
          overlap: false,
        }
      })

      this.calendarOptions.events = this.calendarOptions.events.concat(one_time_for_course);

      const group_time = res.group_time.map(res => {
        return {
          groupId: 'group',
          start: res.start,
          end: res.end,
          color: 'red',
          display: 'background',
          overlap: false,
          title: 'Группа'
        }
      })
      this.calendarOptions.events = this.calendarOptions.events.concat(group_time);

      if (this.isOneTime) {
        const one_time = this.oneTimeLessons.map(lesson => {
          return {
            groupId: 'one_time',
            start: lesson.start,
            end: lesson.end,
            color: 'red',
            display: 'background',
            overlap: false,
          }
        });

        this.calendarOptions.events = this.calendarOptions.events.concat(one_time);

        this.calendarOptions.events = this.calendarOptions.events.filter(e => e.groupId != 'one_time_for_course');
      }

      if (isGroup) {
        this.calendarOptions.selectable = false;
        this.calendarOptions.editable = false;
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

      if (this.edit === 'course') {
        this.calendarOptions.events = this.calendarOptions.events.concat(this.editCourseLessons)
      }

      if (this.edit === 'lesson') {
        this.calendarOptions.events = this.calendarOptions.events.concat([this.lesson])
      }
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
    async getFormData(value) {
      if (value.isGroup && !value.group) {
        this.overlay = true;
        return
      }

      if (value.teacher && value.subject) {
        this.overlay = false;
        this.calendarOptions.selectable = true;
        this.calendarOptions.editable = true;

        if (this.edit === 'course' && !value.isGroup) {
          await this.getCourse(this.$route.params.course);
          this.editCourseLessons = this.course.dates.map(d => {
            return {
              id: this.eventCounter++,
              start: d.startDate,
              end: d.endDate,
            }
          })

          this.dates = this.editCourseLessons;
        } else if (this.edit === 'lesson') {
          await this.getLesson(this.$route.params.lesson);
          this.lesson = {
            id: this.eventCounter++,
            start: this.lesson.start,
            end: this.lesson.end
          }

          this.dates = [this.lesson];
          let calendarApi = this.$refs.fullCalendar.getApi();
          calendarApi.gotoDate(this.lesson.start);
        } else {
          this.dates = [];
        }
        await this.getTeacherLessons(value.teacher, value.isGroup, value.schedule)
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
    async getCourse(course_id) {
      const data = {
        course_id: course_id
      }
      const res = await axios.post(server.URL + '/api/courses/get', data);
      this.course = res.course;
    },
    async getLesson(lesson_id) {
      const data = {
        lesson_id: lesson_id
      }
      const res = await axios.post(server.URL + '/api/lessons/get', data);
      this.lesson = res.lesson;
    },

    changedOneTime(onetime) {
      this.isOneTime = onetime;

      const validDate = {
        start: moment().startOf('week'),
        end: moment().add(4, 'w').endOf('week').add('1', 'd')
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
            start: validDate.start.format('YYYY-MM-DD'),
            end: validDate.end.format('YYYY-MM-DD')
          }
        }

        const one_time = this.oneTimeLessons.map(lesson => {
          return {
            groupId: 'one_time',
            start: lesson.start,
            end: lesson.end,
            color: 'red',
            display: 'background',
            overlap: false,
          }
        });

        this.calendarOptions.events = this.calendarOptions.events.concat(one_time);

        this.calendarOptions.events = this.calendarOptions.events.filter(e => e.groupId != 'one_time_for_course');

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

      let calendarApi = this.$refs.fullCalendar.getApi()
      calendarApi.today();

      this.calendarOptions.events = this.calendarOptions.events.filter(e => e.groupId != 'one_time' && e.groupId != 'inactive_dates');

      this.calendarOptions.events = this.calendarOptions.events.concat(this.excludedEvents)

      const one_time_for_course = this.oneTimeLessonsForCourse.map(lesson => {
        return {
          groupId: 'one_time_for_course',
          start: lesson.start,
          end: lesson.end,
          color: 'red',
          display: 'background',
          overlap: false,
        }
      });

      this.calendarOptions.events = this.calendarOptions.events.concat(one_time_for_course);

    }
  },
  async mounted() {
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
  background-color: rgba(189, 243, 189, 0.3);
  /*background-color: inherit !important;*/
}

#AddLessonCalendar .fc .fc-timegrid-col.fc-day-today {
  background-color: rgba(189, 243, 189, 0.3) !important;
}

</style>
