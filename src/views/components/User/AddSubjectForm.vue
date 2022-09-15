<template>
  <div>
    <categories-card cardTitle="Предметы" :subjects="userSubjects"/>
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
import { mapActions, mapState } from "vuex";

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
      form: {
        name: ''
      }
    }
  },
  computed: {
    ...mapState({
      userSubjects: state => state.subjects.userSubjects,
    })
  },
  mounted() {
    const user_id = this.$route.params.id;
    this.getSubjects();
    this.getUserSubjects(user_id)
  },
  methods: {
    ...mapActions({
      getUserSubjects: 'subjects/getUserSubjects'
    }),

    async getSubjects() {
      const res = await axios.post('http://localhost:3000/api/subjects/get_all');
      this.subjects = res.data.map(sub => {
        return {
          name: sub.name,
          value: sub._id
        }
      })
    },
    async addSubjectToUser() {
      const user_id = this.$route.params.id;
      const data = {
        teacher_id: user_id,
        subject_id: this.form.name
      }

      const res = await axios.post('http://localhost:3000/api/subjects/add_subject_to_teacher', data)

      console.log(res)
    }
  }


}
</script>

<style scoped>

</style>