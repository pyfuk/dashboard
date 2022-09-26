<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex align-items-center">
        <p class="mb-0">{{ action === 'add' ? $t('users.add_user') : $t('users.edit_user') }}</p>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <label :for="firstname" class="form-control-label">
            {{ $t('users.user.firstname') }}
          </label>
          <argon-input v-model="firstname"
                       type="text"
                       :placeholder="$t('users.user.firstname')"/>
          <span v-if="v$.firstname.$error"> {{ v$.firstname.$errors[0].$message }}</span>
        </div>
        <div class="col-md-6">
          <label :for="lastname" class="form-control-label"
          >{{ $t('users.user.lastname') }}</label
          >
          <argon-input v-model="lastname" type="text"
                       :placeholder="$t('users.user.lastname')"/>
          <span v-if="v$.lastname.$error"> {{ v$.lastname.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label :for="password" class="form-control-label">
            {{ $t('users.user.password') }}
          </label>
          <argon-input v-model="password" type="password"
                       :placeholder="$t('users.user.password')"/>
          <span v-if="v$.password.$error"> {{ v$.password.$errors[0].$message }}</span>
        </div>
        <div class="col-md-6">
          <label :for="repassword" class="form-control-label">
            {{ $t('users.user.re_password') }}
          </label>
          <argon-input v-model="repassword" type="password"
                       :placeholder="$t('users.user.re_password')"/>
          <span v-if="v$.repassword.$error"> {{ v$.repassword.$errors[0].$message }}</span>
        </div>
      </div>
      <hr class="horizontal dark"/>

      <div class="row">
        <div class="col-md-4">
          <label :for="email" class="form-control-label">
            {{ $t('users.user.email') }}
          </label>
          <argon-input v-model="email" type="email"
                       :placeholder="$t('users.user.email')"/>
          <span v-if="v$.email.$error"> {{ v$.email.$errors[0].$message }}</span>
        </div>
        <div class="col-md-4">
          <label :for="birthday" class="form-control-label">
            {{ $t('users.user.birthday') }}
          </label>
          <argon-input v-model="birthday" type="date"
                       :placeholder="$t('users.user.birthday')"/>
          <span v-if="v$.birthday.$error"> {{ v$.birthday.$errors[0].$message }}</span>
        </div>
        <div class="col-md-4">
          <label :for="phone" class="form-control-label">
            {{ $t('users.user.phone') }}
          </label>
          <argon-input v-model="phone" type="text"
                       :placeholder="$t('users.user.phone')"/>
          <span v-if="v$.phone.$error"> {{ v$.phone.$errors[0].$message }}</span>
        </div>
      </div>
      <hr class="horizontal dark"/>
      <div class="row justify-content-center">
        <div class="col-md-6">
          <label :for="role" class="form-control-label">
            {{ $t('users.user.role') }}
          </label>
          <argon-select v-model="role"
                        :options="roles"></argon-select>
          <span v-if="v$.role.$error"> {{ v$.role.$errors[0].$message }}</span>
        </div>
      </div>
    </div>
    <div class="card-footer pt-1 ms-auto">
      <argon-button color="success" @click="addUser">{{ action === 'add' ? $t('common.add') : $t('common.save') }}
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

export default {
  name: "add-user-form",
  components: { ArgonButton, ArgonInput, ArgonSelect },
  props: {
    action: {
      type: String,
      required: true
    }
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
      email: ''
    }
  },
  computed: {
    ...mapState({
      roles: state => state.users.roles,
    })
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
      email: { required },
    }
  },
  methods: {
    async addUser() {
      this.v$.$validate();

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

      await this.$router.push(`/users/${response.data.user_id}`)
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
