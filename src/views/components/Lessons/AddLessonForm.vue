<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Добавить курс</h6>
    </div>
    <div class="card-body">
      <label for="subject" class="form-control-label"
      >Предмет</label>
      <argon-select v-model="form.subject"
                    :options="subjectsForSelect"></argon-select>

      <label for="teacher" class="form-control-label"
      >Учитель</label>
      <argon-select v-model="form.teacher"
                    :options="teachers"></argon-select>

      Время и дата
      <div v-for="date in dates" :key="date.id">
        {{ parseDate(date) }}
      </div>

    </div>
    <div class="card-footer pt-1 ms-auto">
      <argon-button color="success" @click="addLesson">Добавить курс
      </argon-button>
    </div>
  </div>
</template>

<script>
import ArgonSelect from "../../../components/ArgonSelect";
import ArgonButton from "../../../components/ArgonButton";
import { mapActions, mapState } from "vuex";
import axios from "axios";
import { server } from "../../../config";

export default {
  name: "AddLessonForm",
  components: {
    ArgonSelect,
    ArgonButton
  },
  data() {
    return {
      form: {
        subject: '',
        teacher: '',
      },
      teachers: [],
      user_id: ''
    }
  },
  props: {
    dates: {
      type: Array
    }
  },
  methods: {
    ...mapActions({
      getSubjects: 'subjects/getSubjects'
    }),
    async addLesson() {
      const date = this.dates.map(date => {
        const startTime = this.addZero(date.start.getHours()) + ":" + this.addZero(date.start.getMinutes());
        const endTime = this.addZero(date.end.getHours()) + ":" + this.addZero(date.end.getMinutes());
        return {
          weekDay: date.start.getDay(),
          startTime,
          endTime,
          millis: date.start.getTime()
        }
      })

      const data = {
        date,
        subject_id: this.form.subject,
        teacher_id: this.form.teacher,
        student_id: this.user_id,
        isCourse: true,
      }

      const res = await axios.post(server.URL + '/api/lessons/create', data)

      if (res.data.success) {
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
    parseDate(date) {
      const week = this.getWeek(date.start.getDay());
      const startTime = this.addZero(date.start.getHours()) + ":" + this.addZero(date.start.getMinutes());
      const endTime = this.addZero(date.end.getHours()) + ":" + this.addZero(date.end.getMinutes());

      return `${week} -  ${startTime} : ${endTime}`
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
          return 'Воскресенье'
        case 1:
          return 'Понедельник'
        case 2:
          return 'Вторник'
        case 3:
          return 'Среда'
        case 4:
          return 'Четверг'
        case 5:
          return 'Пятница'
        case 6:
          return 'Суббота'

      }
    }
  },
  computed: {
    ...mapState({
      subjectsForSelect: state => state.subjects.subjectsForSelect,
    })
  },
  mounted() {
    this.user_id = this.$route.params.id;
    this.getSubjects();
  },
  watch: {
    'form.subject'() {
      this.form.teacher = ''
      this.getTeachersBySubject();
    }
  }
}
</script>

<style scoped>

</style>
