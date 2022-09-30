<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>{{ $t('subjects.add_subject') }}</h6>
    </div>
    <div class="card-body">
      <label :for="form.name.ru" class="form-control-label"
      >{{ $t('subjects.name_ru') }}</label
      >
      <argon-input v-model="form.name.ru" type="text"
                   :placeholder="$t('subjects.name_ru')"
                   :valid="this.validate(formSubmitted, v$.form.name.ru.$error)"
                   :valid-text="this.validateText(v$.form.name.ru)"
      />

      <label :for=" form.name.uz" class="form-control-label"
      >{{ $t('subjects.name_uz') }}</label>
      <argon-input v-model="form.name.uz" type="text"
                   :placeholder="$t('subjects.name_uz')"
                   :valid="this.validate(formSubmitted, v$.form.name.uz.$error)"
                   :valid-text="this.validateText(v$.form.name.uz)"
      />

      <label :for="form.name.en" class="form-control-label"
      >{{ $t('subjects.name_en') }}</label
      >
      <argon-input v-model="form.name.en" type="text"
                   :placeholder="$t('subjects.name_en')"
                   :valid="this.validate(formSubmitted, v$.form.name.en.$error)"
                   :valid-text="this.validateText(v$.form.name.en)"/>

      <hr class="horizontal dark"/>

      <div class="d-flex justify-content-evenly my-4">
        <span>{{ $t('subjects.group_subject') }}</span>
        <argon-switch v-model="form.group"></argon-switch>
      </div>

      <hr class="horizontal dark"/>


      <subject-icons @selected="selectedItem"></subject-icons>
    </div>
    <div class="card-footer pt-1 ms-auto">
      <argon-button color="success" @click="addSubject">{{ $t('common.add') }}
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
import useValidate from "@vuelidate/core";
import { useToast } from "vue-toastification";
import { required } from "@vuelidate/validators";
import utilsMixin from "@/mixins/utilsMixin";

export default {
  name: "AddSubjectForm",
  components: { SubjectIcons, ArgonInput, ArgonButton, ArgonSwitch },
  mixins: [utilsMixin],
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
      v$: useValidate(),
      toast: useToast(),
      formSubmitted: false,
    }
  },
  validations() {
    return {
      form: {
        name: {
          ru: { required },
          uz: { required },
          en: { required }
        }
      }
    }
  },
  methods: {
    ...mapActions({
      addSubjectToArray: 'subjects/addSubjectToArray'
    }),
    async addSubject() {
      this.v$.$validate();

      this.formSubmitted = true;
      if (this.v$.$error) {
        return;
      }

      const data = this.form;
      const res = await axios.post(server.URL + '/api/subjects/create', data);
      this.toast.success(this.$t('notifications.add_subject'))
      await this.$router.push(`/subjects/${res.subject.id}`);
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
