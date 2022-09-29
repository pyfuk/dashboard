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
import { useToast } from "vue-toastification";

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
      toast: useToast(),
      form: {
        password: ''
      }
    }
  },
  methods: {
    async changePassword() {
      this.formSubmitted = true;
      this.v$.$validate();
      if (this.v$.$error) {
        return;
      }

      const data = {
        user_id: this.user_id,
        password: this.form.password
      }
      await axios.post(server.URL + '/api/users/change_password', data)

      this.clearForm();
      this.formSubmitted = false;
      this.toast.success(this.$t('notifications.change_password'))
    },
    clearForm() {
      this.form = {
        password: ''
      }
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
