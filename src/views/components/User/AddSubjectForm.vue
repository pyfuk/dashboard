<template>
  <div>
    <categories-card cardTitle="Предметы" :subjects="teacherSubjects"/>
    <div class="card mt-4">
      <div class="p-3 pb-0 card-header">
        <h6 class="mb-0">Добавить предмет</h6>
      </div>
      <div class="p-3 card-body">
        <div class="row">
          <div class="col">
            <label for="name" class="form-control-label"
            >Название</label
            >
            <argon-select v-model="form.name"
                          :options="subjects"></argon-select>
          </div>
        </div>
      </div>
      <div class="card-footer p-3 pt-1 ms-auto">
        <argon-button color="success" @click="addSubjectToUser">Add user
        </argon-button>
      </div>
    </div>
  </div>
</template>

<script>
import CategoriesCard from "../CategoriesCard/CategoriesCard";
import ArgonSelect from "../../../components/ArgonSelect";
import axios from "axios";
import ArgonButton from "../../../components/ArgonButton";
import { server } from "@/config";

export default {
  name: "AddSubjectForm",
  components: {
    CategoriesCard,
    ArgonSelect,
    ArgonButton
  },
  data() {
    return {
      subjects: [],
      teacherSubjects: [],
      form: {
        name: ''
      }
    }
  },
  mounted() {
    const user_id = this.$route.params.id;
    this.getSubjects();
    this.getUserSubjects(user_id)
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
    async getUserSubjects(user_id) {
      const data = {
        teacher_id: user_id
      }
      const res = await axios.post(server.URL + '/api/subjects/get_teacher_subjects', data)
      this.teacherSubjects = res.subjects.map(s => {
        return {
          title: s.name,
          icon: s.icon
        }
      })
    },
    async addSubjectToUser() {
      const user_id = this.$route.params.id;
      const data = {
        teacher_id: user_id,
        subject_id: this.form.name
      }

      const res = await axios.post(server.URL + '/api/subjects/add_subject_to_teacher', data)
    }
  }


}
</script>

<style scoped>

</style>
