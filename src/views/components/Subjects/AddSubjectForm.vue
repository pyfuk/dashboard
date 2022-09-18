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
        icon: 'guitar'
      },
      passes: []
    }
  },
  methods: {
    ...mapActions({
      addSubjectToArray: 'subjects/addSubjectToArray'
    }),
    async addSubject() {
      const data = this.form;
      const res = await axios.post(server.URL + '/api/subjects/create', data);
      await this.addSubjectToArray(res.subject)
      this.clearForm()
    },
    clearForm() {
      this.form = {
        name: '',
        icon: ''
      }
    },
    selectedItem(icon) {
      this.form.icon = icon;
    },
  }
}
</script>

<style scoped>

</style>
