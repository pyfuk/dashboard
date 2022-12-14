<template>
  <div class="card" :class="{'mt-4': !isAdmin($store.state.currentUser)}">
    <div class="pb-0 card-header d-flex justify-content-between">
      <h6 class="mb-0">{{ $t('subjects.subjects') }}</h6>
      <div class="d-flex justify-content-around" v-if="isAdmin($store.state.currentUser)">
        <argon-select class="mx-2" v-model="form.subject"
                      :options="subjects"></argon-select>
        <argon-button color="success" @click="addSubjectToTeacher">{{ $t('common.add') }}</argon-button>
      </div>
    </div>
    <div class="p-3 card-body">
      <ul class="list-group" v-if="teacherSubjects.length">
        <category-card v-for="teacherSubject of teacherSubjects" :subject="teacherSubject" :key="teacherSubject._id"/>
      </ul>
      <div v-else class="d-flex justify-content-center my-2">
        <span class="text-secondary text-3xl font-weight-bold">
          {{ $t('common.no_data') }}
        </span>
      </div>
    </div>
  </div>

</template>

<script>
import ArgonSelect from "../../../components/ArgonSelect";
import axios from "axios";
import ArgonButton from "../../../components/ArgonButton";
import { server } from "@/config";
import CategoryCard from "@/views/components/CategoriesCard/CategoryCard";
import usersRoleMixin from "@/mixins/usersRoleMixin";
import { useToast } from "vue-toastification";

export default {
  name: "AddSubjectForm",
  components: {
    ArgonSelect,
    ArgonButton,
    CategoryCard
  },
  mixins: [usersRoleMixin],
  data() {
    return {
      subjects: [],
      teacherSubjects: [],
      teacher_id: '',
      toast: useToast(),
      form: {
        subject: ''
      }
    }
  },
  mounted() {
    this.teacher_id = this.$route.params.id;
    this.getSubjects();
    this.getTeacherSubjects()
  },
  methods: {
    async getSubjects() {
      const res = await axios.post(server.URL + '/api/subjects/get_all');
      this.subjects = res.subjects.map(sub => {
        return {
          name: sub.name,
          value: sub.id
        }
      })
    },
    async getTeacherSubjects() {
      const data = {
        teacher_id: this.teacher_id
      }
      const res = await axios.post(server.URL + '/api/subjects/get_teacher_subjects', data)
      this.teacherSubjects = res.subjects;
    },
    async addSubjectToTeacher() {
      const data = {
        teacher_id: this.teacher_id,
        subject_id: this.form.subject
      }
      const res = await axios.post(server.URL + '/api/subjects/add_subject_to_teacher', data)
      this.teacherSubjects.push(res.subject);
      this.toast.success(this.$t('notifications.add_subject_to_teacher'))
    },
  },


}
</script>

<style scoped>
.form-group {
  margin-bottom: 0;
}
</style>
