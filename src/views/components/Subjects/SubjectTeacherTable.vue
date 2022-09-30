<template>
  <div class="card mt-4">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>{{ $t('subjects.teachers') }}</h6>
      <div class="d-flex justify-content-around">
        <argon-select class="mx-2" v-model="form.teacher"
                      :options="allTeachers"
                      :valid="this.validate(formSubmitted, v$.form.teacher.$error)"></argon-select>
        <argon-button color="success" @click="addTeacher">{{ $t('common.add') }}</argon-button>
      </div>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table v-if="teachers.length && !isTeachersLoading" class="table align-items-center mb-0">
          <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{
                $t('users.user.fullname')
              }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="teacher in teachers" :key="teacher.id">
            <td>
              <div class="d-flex px-2 py-1">
                <div>
                  <img
                      src="../../../assets/img/team-2.jpg"
                      class="avatar avatar-sm me-3"
                      alt="user1"
                  />
                </div>
                <div class="d-flex flex-column justify-content-center">
                  <router-link
                      :to="{ path: `/users/${teacher.id}` }"
                  >
                    <h6 class="mb-0 text-sm">{{ teacher.firstname }} {{ teacher.lastname }}</h6>
                  </router-link>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else-if="!isTeachersLoading" class="d-flex justify-content-center my-2">
          <span class="text-secondary text-3xl font-weight-bold">{{ $t('common.no_data') }}</span>
        </div>

        <div class="d-flex justify-content-center my-2" v-if="isTeachersLoading">
          <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import ArgonButton from "@/components/ArgonButton";
import ArgonPagination from "@/components/ArgonPagination";
import ArgonPaginationItem from "@/components/ArgonPaginationItem";
import utilsMixin from "@/mixins/utilsMixin";
import { server, timeout } from "@/config";
import axios from "axios";
import ArgonSelect from "@/components/ArgonSelect";
import useValidate from "@vuelidate/core";
import { useToast } from "vue-toastification";
import { required } from "@vuelidate/validators";

export default {
  name: "SubjectTeacherTable",
  components: {
    ArgonButton,
    ArgonSelect,
    ArgonPagination,
    ArgonPaginationItem,
  },
  mixins: [utilsMixin],
  props: {
    subject: {
      type: Object
    }
  },
  data() {
    return {
      form: {
        teacher: ''
      },
      allTeachers: [],
      teachers: [],
      isTeachersLoading: true,
      v$: useValidate(),
      toast: useToast(),
      formSubmitted: false,
    }
  },
  validations() {
    return {
      form: {
        teacher: { required },
      }
    }
  },
  methods: {
    async getSubjectTeachers() {
      this.isTeachersLoading = true;

      const data = {
        subject_id: this.subject.id
      }
      const response = await axios.post(server.URL + '/api/subjects/get_teachers_by_subject', data);
      this.teachers = response.teachers;
      this.isTeachersLoading = false;
    },
    async getAllTeachers() {
      const data = {
        role: 'teacher'
      }

      const res = await axios.post(server.URL + '/api/users/get_all', data)
      this.allTeachers = res.users.map(t => {
        return {
          name: t.firstname + ' ' + t.lastname,
          value: t.id
        }
      })
    },
    async addTeacher() {
      this.formSubmitted = true;
      this.v$.$validate();
      if (this.v$.$error) {
        return;
      }

      const data = {
        teacher_id: this.form.teacher,
        subject_id: this.subject.id
      }
      const res = await axios.post(server.URL + '/api/subjects/add_subject_to_teacher', data);
      this.teachers.push(res.teacher);
      this.formSubmitted = false;
      this.form.teacher = '';
      this.toast.success(this.$t('notifications.add_teacher_to_subject'))
    }
  },
  async mounted() {
    await this.sleep(timeout.LIST_SLEEP);
    await this.getSubjectTeachers();
    await this.getAllTeachers();
  },
}
</script>

<style scoped>
.form-group {
  margin-bottom: 0;
}

</style>
