<template>
  <div class="card">
    <div class="p-3 pb-0 card-header d-flex justify-content-between">
      <h6 class="mb-0">Предметы</h6>
      <div class="d-flex justify-content-around">
        <argon-select class="mx-2" v-model="form.subject"
                      :options="subjects"></argon-select>
        <argon-button color="success" @click="addSubjectToTeacher">Добавить</argon-button>
      </div>
    </div>
    <div class="p-3 card-body">
      <ul class="list-group" v-if="teacherSubjects.length">
        <category-card v-for="teacherSubject of teacherSubjects" :subject="teacherSubject" :key="teacherSubject._id"/>
      </ul>
      <h2 v-else style="color: red">
        Список постов пуст
      </h2>
    </div>
  </div>

</template>

<script>
import ArgonSelect from "../../../components/ArgonSelect";
import axios from "axios";
import ArgonButton from "../../../components/ArgonButton";
import { server } from "@/config";
import CategoryCard from "@/views/components/CategoriesCard/CategoryCard";

export default {
  name: "AddSubjectForm",
  components: {
    ArgonSelect,
    ArgonButton,
    CategoryCard
  },
  data() {
    return {
      subjects: [],
      teacherSubjects: [],
      teacher_id: '',
      form: {
        subject: ''
      }
    }
  },
  mounted() {
    this.teacher_id = this.$route.params.id;
    this.getSubjects();
    this.getUserSubjects()
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
    async getUserSubjects() {
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
      await axios.post(server.URL + '/api/subjects/add_subject_to_teacher', data)
    }
  }


}
</script>

<style scoped>
.form-group {
  margin-bottom: 0;
}
</style>
