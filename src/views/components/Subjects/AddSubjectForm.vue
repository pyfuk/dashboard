<template>
  <div class="card">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>{{ isAdd ? $t('subjects.add_subject') : $t('subjects.edit_subject') }}</h6>
      <argon-button v-if="!editingForm && isEdit" color="success"
                    @click="editingForm = true">
        {{ $t('common.edit') }}
      </argon-button>
      <argon-button v-if="editingForm" color="success" @click="editSubject">
        {{ $t('common.save') }}
      </argon-button>
    </div>
    <div class="card-body">
      <label :for="form.name.ru" class="form-control-label"
      >{{ $t('subjects.name_ru') }}</label
      >
      <argon-input v-model="form.name.ru" type="text"
                   :placeholder="$t('subjects.name_ru')"
                   :valid="this.validate(formSubmitted, v$.form.name.ru.$error)"
                   :valid-text="this.validateText(v$.form.name.ru)"
                   :disabled="!editingForm && isEdit"
      />

      <label :for=" form.name.uz" class="form-control-label"
      >{{ $t('subjects.name_uz') }}</label>
      <argon-input v-model="form.name.uz" type="text"
                   :placeholder="$t('subjects.name_uz')"
                   :valid="this.validate(formSubmitted, v$.form.name.uz.$error)"
                   :valid-text="this.validateText(v$.form.name.uz)"
                   :disabled="!editingForm && isEdit"
      />

      <label :for="form.name.en" class="form-control-label"
      >{{ $t('subjects.name_en') }}</label
      >
      <argon-input v-model="form.name.en" type="text"
                   :placeholder="$t('subjects.name_en')"
                   :valid="this.validate(formSubmitted, v$.form.name.en.$error)"
                   :valid-text="this.validateText(v$.form.name.en)"
                   :disabled="!editingForm && isEdit"/>

      <hr class="horizontal dark" v-if="isAdd"/>

      <div class="d-flex justify-content-evenly my-4" v-if="isAdd">
        <span>{{ $t('subjects.group_subject') }}</span>
        <argon-switch v-model="form.group"></argon-switch>
      </div>

      <hr class="horizontal dark" v-if="isAdd"/>


      <subject-icons @selected="selectedItem" v-if="isAdd"/>
    </div>
    <div class="card-footer pt-1 ms-auto" v-if="isAdd">
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
  props: {
    action: {
      type: String,
      required: true
    },
    subject: Object
  },
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
      editingForm: false,
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
  computed: {
    isEdit() {
      return this.action === 'edit'
    },
    isAdd() {
      return this.action === 'add'
    },
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
    async editSubject() {
      this.v$.$validate();

      this.formSubmitted = true;
      if (this.v$.form.name.ru.$error || this.v$.form.name.uz.$error || this.v$.form.name.en.$error) {
        return;
      }

      const data = {
        subject_id: this.subject.id,
        name: {
          ru: this.form.name.ru,
          uz: this.form.name.uz,
          en: this.form.name.en
        }
      }

      const res = await axios.post(server.URL + '/api/subjects/edit', data);
      this.$emit('subjectEdited', res.subject);
      this.formSubmitted = false;
      this.editingForm = false;
      this.toast.success(this.$t('notifications.edit_subject'))
    }
  },
  mounted() {
    if (this.isEdit && this.subject) {
      this.form.name.ru = this.subject.title.ru;
      this.form.name.uz = this.subject.title.uz;
      this.form.name.en = this.subject.title.en;
    }
  }
}
</script>

<style scoped>

</style>
