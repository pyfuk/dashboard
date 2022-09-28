<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between">
        <p class="mb-0">{{ action === 'add' ? $t('users.add_user') : $t('users.edit_user') }}</p>
        <argon-button v-if="!editingForm && isEdit" color="success" @click="editingForm = true">
          {{ $t('common.edit') }}
        </argon-button>
        <argon-button v-if="editingForm" color="success" @click="editUser">
          {{ $t('common.save') }}
        </argon-button>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-12 col-md-12 col-lg-6">
          <label :for="firstname" class="form-control-label">
            {{ $t('users.user.firstname') }}
          </label>
          <argon-input v-model="firstname"
                       type="text"
                       :placeholder="$t('users.user.firstname')"
                       :valid="this.validate(formSubmitted, v$.firstname.$error)"
                       :valid-text="this.validateText(v$.firstname)"
                       :disabled="!editingForm && isEdit"/>

        </div>
        <div class="col-12 col-md-12 col-lg-6">
          <label :for="lastname" class="form-control-label"
          >{{ $t('users.user.lastname') }}</label
          >
          <argon-input v-model="lastname"
                       type="text"
                       :placeholder="$t('users.user.lastname')"
                       :valid="this.validate(formSubmitted, v$.lastname.$error)"
                       :valid-text="this.validateText(v$.lastname)"
                       :disabled="!editingForm && isEdit"/>

        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-12 col-lg-6" v-if="isAdd">
          <label :for="password" class="form-control-label">
            {{ $t('users.user.password') }}
          </label>
          <argon-input v-model="password"
                       type="password"
                       :placeholder="$t('users.user.password')"
                       :valid="this.validate(formSubmitted, v$.password.$error)"
                       :valid-text="this.validateText(v$.password)"
                       :disabled="!editingForm && isEdit"/>


        </div>
        <div class="col-12 col-md-12 col-lg-6" v-if="isAdd">
          <label :for="repassword" class="form-control-label">
            {{ $t('users.user.re_password') }}
          </label>
          <argon-input v-model="repassword"
                       type="password"
                       :placeholder="$t('users.user.re_password')"
                       :valid="this.validate(formSubmitted, v$.repassword.$error)"
                       :valid-text="this.validateText(v$.repassword)"
                       :disabled="!editingForm && isEdit"/>
        </div>
      </div>
      <hr v-if="isAdd" class="horizontal dark"/>

      <div class="row">
        <div class="col-12 col-md-12 col-lg-6 col-xl-6">
          <label :for="email" class="form-control-label">
            {{ $t('users.user.email') }}
          </label>
          <argon-input v-model="email"
                       type="email"
                       :placeholder="$t('users.user.email')"
                       :disabled="!editingForm && isEdit"
          />
        </div>
        <div class="col-12 col-md-12 col-lg-6 col-xl-6">
          <label :for="birthday" class="form-control-label">
            {{ $t('users.user.birthday') }}
          </label>
          <argon-input v-model="birthday"
                       type="date"
                       :placeholder="$t('users.user.birthday')"
                       :valid="this.validate(formSubmitted, v$.birthday.$error)"
                       :valid-text="this.validateText(v$.birthday)"
                       :disabled="!editingForm && isEdit"/>

        </div>
        <div class="col-12 col-md-12 col-lg-12 col-xl-12">
          <label :for="phone" class="form-control-label">
            {{ $t('users.user.phone') }}
          </label>
          <argon-input v-model="phone"
                       type="text"
                       :placeholder="$t('users.user.phone')"
                       :valid="this.validate(formSubmitted, v$.phone.$error)"
                       :valid-text="this.validateText(v$.phone)"
                       :disabled="!editingForm && isEdit"/>
        </div>
      </div>
      <hr v-if="isAdd" class="horizontal dark"/>
      <div v-if="isAdd" class="row justify-content-center">
        <div class="col-12 col-md-12 col-lg-12 col-xl-6">
          <label :for="role" class="form-control-label">
            {{ $t('users.user.role') }}
          </label>
          <argon-select v-model="role"
                        :options="roles"
                        :valid="this.validate(formSubmitted, v$.role.$error)"
                        :valid-text="this.validateText(v$.role)"
                        :disabled="!editingForm && isEdit"></argon-select>

        </div>
      </div>
    </div>
    <div class="card-footer pt-1 ms-auto" v-if="isAdd">
      <argon-button color="success" @click="addUser">
        {{ $t('common.add') }}
      </argon-button>
    </div>
  </div>

</template>

<script>
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSelect from "@/components/ArgonSelect.vue";
import { mapState } from "vuex";
import useValidate from '@vuelidate/core'
import { required, sameAs } from '@vuelidate/validators'
import axios from "axios";
import { server } from "../../../config";
import utilsMixin from "@/mixins/utilsMixin";

export default {
  name: "add-user-form",
  components: { ArgonButton, ArgonInput, ArgonSelect },
  mixins: [utilsMixin],
  props: {
    action: {
      type: String,
      required: true
    },
    user: Object
  },
  data() {
    return {
      v$: useValidate(),
      firstname: '',
      lastname: '',
      birthday: '',
      role: '',
      password: '',
      repassword: '',
      phone: '',
      email: '',
      formSubmitted: false,
      editingForm: false,
    }
  },
  computed: {
    ...mapState({
      roles: state => state.users.roles,
    }),
    isEdit() {
      return this.action === 'edit'
    },
    isAdd() {
      return this.action === 'add'
    },
  },
  validations() {
    return {
      firstname: { required },
      lastname: { required },
      birthday: { required },
      role: { required },
      password: { required },
      repassword: { required, sameAs: sameAs(this.password) },
      phone: { required },
    }
  },
  methods: {
    async addUser() {
      this.v$.$validate();

      this.formSubmitted = true;
      if (this.v$.$error) {
        return;
      }
      const data = {
        firstname: this.firstname,
        lastname: this.lastname,
        birthday: this.birthday,
        role: this.role,
        password: this.password,
        phone: this.phone,
        email: this.email
      }

      const response = await axios.post(server.URL + '/api/users/create', data);

      this.formSubmitted = false;
      await this.$router.push(`/users/${response.data.user_id}`)
    },

    async editUser() {
      this.v$.$validate();

      this.formSubmitted = true;
      if (this.v$.firstname.$error || this.v$.lastname.$error || this.v$.birthday.$error || this.v$.phone.$error) {
        return;
      }

      const data = {
        user_id: this.user.id,
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        birthday: this.birthday,
        phone: this.phone
      }
      const res = await axios.post(server.URL + '/api/users/edit', data);
      this.$emit('userEdited', res.user);
      this.formSubmitted = false;
      this.editingForm = false;
    }
  },
  mounted() {
    if (this.isEdit && this.user) {
      this.firstname = this.user.firstname;
      this.lastname = this.user.lastname;
      this.email = this.user.email;
      this.birthday = this.user.birthday;
      this.phone = this.user.phone;
    }
  }
}
</script>

<style scoped>

</style>
