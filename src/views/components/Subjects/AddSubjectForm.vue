<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Добавить предмет</h6>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col">
          <label for="name" class="form-control-label"
          >Название</label
          >
          <argon-input v-model="form.name" type="text"
                       placeholder="Название"/>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label for="lessons_count" class="form-control-label"
          >Количество занятий</label
          >
          <argon-input v-model="form.lessons_count" type="text"
                       placeholder="Количество занятий"/>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label for="cost" class="form-control-label"
          >Стоимость</label
          >
          <argon-input v-model="form.cost" type="text"
                       placeholder="Стоимость"/>
        </div>
      </div>
      <subject-icons @selected="selectedItem"></subject-icons>
    </div>
    <div class="card-footer pt-1 ms-auto">
      <argon-button color="success" @click="addSubject">Добавить предмет
      </argon-button>
    </div>
  </div>
</template>

<script>
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import axios from "axios";
import { server } from "../../../config";
import { mapActions } from "vuex";
import SubjectIcons from "./SubjectIcons";

export default {
  name: "AddSubjectForm",
  components: { SubjectIcons, ArgonInput, ArgonButton },
  data() {
    return {
      form: {
        name: '',
        lessons_count: '',
        cost: '',
      }
    }
  },
  methods: {
    ...mapActions({
      addSubjectToArray: 'subjects/addSubjectToArray'
    }),
    async addSubject() {
      const data = this.form;
      console.log(data)
      const res = await axios.post(server.URL + '/api/subjects/create', data);
      this.addSubjectToArray(res.data)
      this.clearForm()
    },
    clearForm() {
      this.form = {
        name: '',
        lessons_count: '',
        cost: ''
      }
    },
    selectedItem(icon) {
      this.form.icon = icon;
    }
  }
}
</script>

<style scoped>

</style>