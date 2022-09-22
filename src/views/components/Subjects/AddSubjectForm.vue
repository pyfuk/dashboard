<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Добавить предмет</h6>
    </div>
    <div class="card-body">
      <label for="name" class="form-control-label"
      >Название на русском</label
      >
      <argon-input v-model="form.name.ru" type="text"
                   placeholder="Название на русском"/>

      <label for="name" class="form-control-label"
      >Название на узбекском</label
      >
      <argon-input v-model="form.name.uz" type="text"
                   placeholder="Название на узбекском"/>

      <label for="name" class="form-control-label"
      >Название на английском</label
      >
      <argon-input v-model="form.name.en" type="text"
                   placeholder="Название на английском"/>

      <hr class="horizontal dark"/>

      <div class="d-flex justify-content-evenly my-4">
        <span>Групповое занятие</span>
        <argon-switch v-model="form.group"></argon-switch>
      </div>

      <hr class="horizontal dark"/>


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
import ArgonSwitch from "@/components/ArgonSwitch";

export default {
  name: "AddSubjectForm",
  components: { SubjectIcons, ArgonInput, ArgonButton, ArgonSwitch },
  data() {
    return {
      form: {
        name: {
          ru: '',
          uz: '',
          en: ''
        },
        group: false,
        icon: 'guitar'
      },
    }
  },
  methods: {
    ...mapActions({
      addSubjectToArray: 'subjects/addSubjectToArray'
    }),
    async addSubject() {
      const data = this.form;
      const res = await axios.post(server.URL + '/api/subjects/create', data);
      this.clearForm()
    },
    clearForm() {
      this.form = {
        name: {
          ru: '',
          uz: '',
          en: ''
        },
        icon: '',
        group: false,
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
