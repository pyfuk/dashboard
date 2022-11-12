<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>{{ $t('courses.add_course') }}</h6>
    </div>
    <div class="card-body">
      <label :for="form.teacher" class="form-control-label"
      >{{ $t('courses.teacher') }}</label>
      <argon-select v-model="form.teacher"
                    :options="teachers"></argon-select>


      <label :for="form.name" class="form-control-label">
        {{ $t('subjects.group.name') }}
      </label>
      <argon-input v-model="form.name"
                   type="text"
                   :placeholder="$t('subjects.group.name')"/>

      <label :for="form.name" class="form-control-label">
        {{ $t('subjects.group.students_count') }}
      </label>
      <argon-input v-model="form.students_count"
                   type="text"
                   :placeholder="$t('subjects.group.students_count')"/>

      <div v-for="date in dates" :key="date.id" class="form-control mb-2 d-flex justify-content-between">
        <span>{{ parseDate(date) }}</span>
        <span @click="removeCalendarEvent(date.id)">
          <i class="fa fa-xmark"></i>
        </span>
      </div>

    </div>
    <div class="card-footer pt-1 ms-auto">
      <argon-button color="success" @click="addSchedule">
        {{ $t('common.add') }}
      </argon-button>
    </div>
  </div>
</template>

<script>
import ArgonSelect from "@/components/ArgonSelect";
import ArgonButton from "@/components/ArgonButton";
import axios from "axios";
import { server, timeZone } from "@/config";
import ArgonInput from "@/components/ArgonInput";
import moment from "moment-timezone";

export default {
  name: "GroupSubjectScheduleAdd",
  components: {
    ArgonSelect,
    ArgonButton,
    ArgonInput
  },
  props: {
    dates: {
      type: Array
    }
  },
  data() {
    return {
      form: {
        teacher: '',
        students_count: '',
        name: ''
      },
      subject_id: '',
      teachers: []
    }
  }
  ,
  methods: {
    async getTeachers() {
      const data = {
        subject_id: this.subject_id
      }
      const response = await axios.post(server.URL + '/api/subjects/get_teachers_by_subject', data);

      this.teachers = response.teachers.map(t => {
        return {
          name: t.firstname + ' ' + t.lastname,
          value: t.id
        }
      });
    },
    async addSchedule() {
      const dates = this.dates.map(date => {
        const startDate = moment(date.start).tz(timeZone)
        const endDate = moment(date.end).tz(timeZone);
        const week = startDate.weekday()

        return {
          weekDay: week,
          startTime: startDate.format('HH:mm'),
          endTime: endDate.format('HH:mm'),
          millis: startDate.valueOf()
        }
      })

      const data = {
        dates,
        subject_id: this.subject_id,
        teacher_id: this.form.teacher,
        students_count: this.form.students_count,
        name: this.form.name
      }

      const res = await axios.post(server.URL + '/api/subjects/add_group_subject_schedule', data)

      await this.$router.push(`/subjects/${this.subject_id}/schedule`)

      console.log(res)

    },
    parseDate(date) {
      const startDate = moment(date.start).tz(timeZone)
      const endDate = moment(date.end).tz(timeZone);
      const week = this.getWeek(startDate.weekday())

      return `${week} -  ${startDate.format('HH:mm')} : ${endDate.format('HH:mm')}`
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
    addZero(i) {
      if (i < 10) {
        i = "0" + i
      }
      return i;
    },

  },
  watch: {
    'form.teacher'() {
      this.$emit('teacherChanged', this.form.teacher);
    },
  },
  mounted() {
    this.subject_id = this.$route.params.id;
    this.getTeachers();
  }
}

</script>

<style scoped>

</style>
