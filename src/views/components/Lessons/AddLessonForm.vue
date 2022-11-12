<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>{{ $t('courses.add_course') }}</h6>
    </div>
    <div class="card-body">
      <label :for="form.subject" class="form-control-label"
      >{{ $t('courses.subject') }}</label>
      <argon-select v-model="form.subject"
                    :options="getSubjectsForSelect"
                    :disabled="isCourseEdit"></argon-select>

      <label :for="form.teacher" class="form-control-label"
      >{{ $t('courses.teacher') }}</label>
      <argon-select v-model="form.teacher"
                    :options="teachers"></argon-select>

      <label :for="form.group" class="form-control-label"
             v-if="isSelectedSubjectWithGroup"
      >{{ $t('courses.group') }}</label>
      <argon-select v-model="form.group"
                    :options="groupsForSelect"
                    v-if="isSelectedSubjectWithGroup"></argon-select>

      <hr class="horizontal dark" v-if="!isSelectedSubjectWithGroup && !isLessonEdit"/>

      <div class="d-flex justify-content-between mb-2"
           v-if="!isCourseEdit && !isSelectedSubjectWithGroup && !isLessonEdit">
        <span>{{ $t('courses.one_time') }}</span>
        <argon-switch v-model="form.onetime"></argon-switch>
      </div>

      <label v-if="!form.onetime && !isSelectedSubjectWithGroup" :for="form.onetime" class="form-control-label"
      >{{ $t('courses.pass') }}</label>
      <argon-select v-if="!form.onetime && !isSelectedSubjectWithGroup" v-model="form.pass"
                    :options="passes"></argon-select>


      <hr class="horizontal dark"/>
      <label class="form-control-label"
      >{{ $t('courses.time') }}</label>

      <div v-for="date in dates" :key="date.id" class="form-control mb-2 d-flex justify-content-between">
        <span>{{ parseDate(date) }}</span>
        <span @click="removeCalendarEvent(date.id)" v-if="!isSelectedSubjectWithGroup">
          <i class="fa fa-xmark"></i>
        </span>
      </div>

      <div v-if="!dates.length" class="form-control">
        <span>Время проведения уроков не выбрано</span>

      </div>

    </div>
    <div class="card-footer pt-1 ms-auto">
      <argon-button color="success" @click="addLesson">{{ $t('common.add') }}
      </argon-button>
    </div>
  </div>
</template>

<script>
import ArgonSelect from "../../../components/ArgonSelect";
import ArgonButton from "../../../components/ArgonButton";
import axios from "axios";
import { server, timeZone } from "../../../config";
import ArgonSwitch from "@/components/ArgonSwitch";
import usersRoleMixin from "@/mixins/usersRoleMixin";
import { useToast } from "vue-toastification";
import moment from "moment-timezone";

export default {
  name: "AddLessonForm",
  components: {
    ArgonSwitch,
    ArgonSelect,
    ArgonButton
  },
  mixins: [usersRoleMixin],
  data() {
    return {
      form: {
        subject: '',
        teacher: '',
        group: '',
        pass: '4',
        onetime: false,
      },
      teachers: [],
      passes: [],
      user_id: '',
      subjects: [],
      groupsForSelect: [],
      groupsSchedules: [],
      course: '',
      isCourseEdit: false,
      toast: useToast(),
      lesson: '',
      isLessonEdit: false,
    }
  },
  props: {
    dates: {
      type: Array
    },
    edit: {
      type: String
    }
  },
  methods: {
    async addLesson() {
      if (this.dates.length < this.form.pass / 4) {
        this.toast.error(this.$t('notifications.add_time_for_lesson'))
      }

      const dates = this.dates.map(date => {
        const startTime = this.addZero(new Date(date.start).getHours()) + ":" + this.addZero(new Date(date.start).getMinutes());
        const endTime = this.addZero(new Date(date.end).getHours()) + ":" + this.addZero(new Date(date.end).getMinutes());
        return {
          weekDay: new Date(date.start).getDay(),
          startTime,
          endTime,
          millis: new Date(date.start).getTime()
        }
      })

      if (this.edit === 'course') {
        const data = {
          dates,
          course_id: this.course.id,
          teacher_id: this.form.teacher,
          pass: this.form.pass,
          group_id: this.form.group || undefined
        }

        await axios.post(server.URL + '/api/courses/edit', data);
        await this.$router.push(`/courses/${this.course.id}`)

      } else if (this.edit === 'lesson') {
        const data = {
          dates,
          subject_id: this.form.subject,
          teacher_id: this.form.teacher,
          lesson_id: this.lesson.id
        }

        await axios.post(server.URL + '/api/lessons/edit', data);
        // await this.$router.push(`/users/${this.user_id}/lessons`)

      } else {
        const student_id = this.isAdmin(this.$store.state.currentUser) ? this.user_id : this.$store.state.currentUser.id;

        const data = {
          dates,
          student_id,
          subject_id: this.form.subject,
          teacher_id: this.form.teacher,
          group_id: this.form.group,
          type: this.form.onetime ? 'one_time' : 'pass',
          pass: this.form.pass,
        }

        await axios.post(server.URL + '/api/lessons/create', data)

        await this.$router.push(`/users/${this.user_id}/calendar`)
      }

    },
    async getTeachersBySubject() {
      const data = {
        subject_id: this.form.subject
      }

      const dbTeachers = await axios.post(server.URL + "/api/subjects/get_teachers_by_subject", data)

      this.teachers = dbTeachers.teachers.map(t => {
        return {
          name: t.firstname + ' ' + t.lastname,
          value: t.id
        }
      })
    },
    async getSubjects() {
      const response = await axios.post(server.URL + '/api/subjects/get_all');
      this.subjects = response.subjects;
    },
    async getPasses() {
      const res = await axios.post(server.URL + "/api/passes/get_all");

      this.passes = res.passes.map(pass => {
        return {
          name: pass,
          value: pass
        }
      });

      this.changedPassForm();
    },
    parseDate(date) {
      const startDate = moment(date.start).tz(timeZone)
      const endDate = moment(date.end).tz(timeZone);
      const week = this.getWeek(startDate.weekday())

      return `${week} -  ${startDate.format('HH:mm')} : ${endDate.format('HH:mm')}`
    },
    addZero(i) {
      if (i < 10) {
        i = "0" + i
      }
      return i;
    },
    getWeek(i) {
      switch (i) {
        case 0:
          return 'Понедельник'
        case 1:
          return 'Вторник'
        case 2:
          return 'Среда'
        case 3:
          return 'Четверг'
        case 4:
          return 'Пятница'
        case 5:
          return 'Суббота'
        case 6:
          return 'Воскресенье'
      }
    },
    removeCalendarEvent(eventId) {
      this.$emit('removeEvent', eventId);
    },
    changedPassForm() {
      this.$emit('changedPassForm', this.form.pass)
    },
    async getGroupSchedule() {
      const data = {
        subject_id: this.form.subject,
        teacher_id: this.form.teacher,
      }

      const res = await axios.post(server.URL + '/api/subjects/get_groups_schedule', data)
      this.groupsSchedules = res.groupSchedules;
      this.groupsForSelect = res.groupSchedules.map(group => {
        return {
          name: group.name,
          value: group.id
        }
      })
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
  },
  async mounted() {
    this.user_id = this.$route.params.id;
    await this.getSubjects();
    await this.getPasses();

    if (this.edit === 'course') {
      this.isCourseEdit = true;
      await this.getCourse(this.$route.params.course);
      this.form.subject = this.course.subject.id;
      await this.getTeachersBySubject()
      this.form.teacher = this.course.teacher.id;
      this.form.pass = this.course.pass;
      await this.getGroupSchedule();
      this.form.group = this.course.group
    }

    if (this.edit === 'lesson') {
      this.isLessonEdit = true;
      await this.getLesson(this.$route.params.lesson);
      this.form.subject = this.lesson.subject.id;
      await this.getTeachersBySubject()
      this.form.teacher = this.lesson.teacher.id;
      this.form.onetime = true;
    }
  },
  watch: {
    'form.subject'() {
      this.form.teacher = '';
      this.form.group = '';
      this.groupsForSelect = [];
      this.getTeachersBySubject();

      if (this.form.subject && this.isSelectedSubjectWithGroup) {
        this.form.onetime = false;
      }
    },
    'form.teacher'() {
      this.$emit('form', {
        ...this.form,
        isGroup: this.isSelectedSubjectWithGroup
      });

      if (this.isSelectedSubjectWithGroup && this.form.teacher) {
        this.getGroupSchedule()
      }
    },
    'form.pass'() {
      this.changedPassForm();
    },
    'form.onetime'() {
      this.$emit('onetime', this.form.onetime);
    },
    'form.group'() {
      const schedule = this.groupsSchedules.find(gs => gs.id === this.form.group);

      if (this.form.group) {
        this.$emit('form', {
          ...this.form,
          isGroup: this.isSelectedSubjectWithGroup,
          schedule: schedule.dates
        });
      }
    }
  },
  computed: {
    isSelectedSubjectWithGroup() {
      if (!this.form.subject) {
        return false;
      }
      const subject = this.subjects.find(s => s.id === this.form.subject);
      return subject.group;
    },
    getSubjectsForSelect() {
      if (!this.subjects) {
        return;
      }
      const subs = this.isLessonEdit ? this.subjects.filter(s => !s.group) : this.subjects;

      return subs.map(s => {
        return {
          name: s.name,
          value: s.id
        }
      })
    }
  },
}
</script>

<style scoped>

</style>
