<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>{{ $t('courses.add_course') }}</h6>
    </div>
    <div class="card-body">
      <label :for="form.subject" class="form-control-label"
      >{{ $t('courses.subject') }}</label>
      <argon-select v-model="form.subject"
                    :options="subjectsForSelect"></argon-select>

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

      <hr class="horizontal dark" v-if="!isSelectedSubjectWithGroup"/>

      <div class="d-flex justify-content-between mb-2" v-if="!isSelectedSubjectWithGroup">
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
import { server } from "../../../config";
import ArgonSwitch from "@/components/ArgonSwitch";
import usersRoleMixin from "@/mixins/usersRoleMixin";

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
      subjectsForSelect: [],
      subjects: [],
      groupsForSelect: [],
      groupsSchedules: []
    }
  },
  props: {
    dates: {
      type: Array
    }
  },
  methods: {
    async addLesson() {
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
      this.subjectsForSelect = response.subjects.map(s => {
        return {
          name: s.name,
          value: s.id
        }
      })
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
      const week = this.getWeek(new Date(date.start).getDay());
      const startTime = this.addZero(new Date(date.start).getHours()) + ":" + this.addZero(new Date(date.start).getMinutes());
      const endTime = this.addZero(new Date(date.end).getHours()) + ":" + this.addZero(new Date(date.end).getMinutes());

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
    }
  },
  mounted() {
    this.user_id = this.$route.params.id;
    this.getSubjects();
    this.getPasses();
  },
  watch: {
    'form.subject'() {
      this.form.teacher = '';
      this.form.group = '';
      this.groupsForSelect = [];
      this.getTeachersBySubject();
    },
    'form.teacher'() {
      this.$emit('form', {
        ...this.form,
        isGroup: this.isSelectedSubjectWithGroup
      });

      if (this.isSelectedSubjectWithGroup) {
        this.getGroupSchedule()
      }
    },
    'form.pass'() {
      this.changedPassForm();
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
    }
  },
}
</script>

<style scoped>

</style>
