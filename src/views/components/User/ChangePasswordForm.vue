<template>
  <div class="card">
    <div class="card-header pb-0">
      {{ $t('users.change_password') }}
    </div>
    <div class="card-body d-flex justify-content-center">
      <argon-input v-model="form.password"
                   type="password"
                   :placeholder="$t('users.user.new_password')"
                   :valid="this.validate(formSubmitted, v$.form.password.$error)"/>
      <argon-button class="ms-2" color="success" @click="changePassword">{{ $t('common.save') }}</argon-button>
    </div>
  </div>

</template>

<script>
import ArgonButton from "@/components/ArgonButton";
import ArgonInput from "@/components/ArgonInput";
import useValidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import utilsMixin from "@/mixins/utilsMixin";
import axios from "axios";
import { server } from "@/config";

export default {
  name: "ChangePasswordForm",
  mixins: [utilsMixin],
  components: {
    ArgonInput,
    ArgonButton,
  },
  validations() {
    return {
      form: {
        password: { required },
      }
    }
  },
  data() {
    return {
      v$: useValidate(),
      formSubmitted: false,
      user_id: '',
      form: {
        password: ''
      }
    }
  },
  methods: {
    async changePassword() {
      this.v$.$validate();

      this.formSubmitted = true;
      if (this.v$.$error) {
        return;
      }

      const data = {
        user_id: this.user_id,
        password: this.form.password
      }

      await axios.post(server.URL + '/api/users/change_password', data)
    }
  },
  mounted() {
    this.user_id = this.$route.params.id;
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 0;
}
</style>
