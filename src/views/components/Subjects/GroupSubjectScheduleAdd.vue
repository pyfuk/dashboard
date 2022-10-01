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
import { server } from "@/config";
import ArgonInput from "@/components/ArgonInput";

export default {
  name: "GroupSubjectScheduleAdd",
  components: {
    ArgonSelect,
    ArgonButton,
    ArgonInput
  }
  ,
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

      const data = {
        subject_id: this.subject_id,
        teacher_id: this.form.teacher,
        students_count: this.form.students_count,
        name: this.form.name
      }

      const res = await axios.post(server.URL + '/api/subjects/add_group_subject_schedule')


      console.log(res)

    }
  }
  ,
  mounted() {
    this.subject_id = this.$route.params.id;
    this.getTeachers();
  }
}

</script>

<style scoped>

</style>
