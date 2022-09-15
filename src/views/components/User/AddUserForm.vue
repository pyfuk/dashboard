<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex align-items-center">
        <p class="mb-0">{{ action === 'add' ? 'Добавить пользователя' : 'Редактировать пользователя' }}</p>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <label for="firstname" class="form-control-label"
          >Имя</label
          >
          <argon-input v-model="firstname"
                       type="text"
                       placeholder="Имя"/>
          <span v-if="v$.firstname.$error"> {{ v$.firstname.$errors[0].$message }}</span>
        </div>
        <div class="col-md-6">
          <label for="lastname" class="form-control-label"
          >Фамилия</label
          >
          <argon-input v-model="lastname" type="text"
                       placeholder="Фамилия"/>
          <span v-if="v$.lastname.$error"> {{ v$.lastname.$errors[0].$message }}</span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="password" class="form-control-label"
          >Пароль</label
          >
          <argon-input v-model="password" type="password"
                       placeholder="Пароль"/>
          <span v-if="v$.password.$error"> {{ v$.password.$errors[0].$message }}</span>
        </div>
        <div class="col-md-6">
          <label for="repassword" class="form-control-label"
          >Повтор пароля</label
          >
          <argon-input v-model="repassword" type="password"
                       placeholder="Повтор пароля"/>
          <span v-if="v$.repassword.$error"> {{ v$.repassword.$errors[0].$message }}</span>
        </div>
      </div>
      <hr class="horizontal dark"/>

      <div class="row">
        <div class="col-md-4">
          <label for="email" class="form-control-label"
          >Почта</label
          >
          <argon-input v-model="email" type="email"
                       placeholder="Почта"/>
          <span v-if="v$.email.$error"> {{ v$.email.$errors[0].$message }}</span>
        </div>
        <div class="col-md-4">
          <label for="birthday" class="form-control-label"
          >Дата рождения</label
          >
          <argon-input v-model="birthday" type="date"
                       placeholder="Дата рождения"/>
          <span v-if="v$.birthday.$error"> {{ v$.birthday.$errors[0].$message }}</span>
        </div>
        <div class="col-md-4">
          <label for="phone" class="form-control-label"
          >Телефон</label
          >
          <argon-input v-model="phone" type="text"
                       placeholder="Телефон"/>
          <span v-if="v$.phone.$error"> {{ v$.phone.$errors[0].$message }}</span>
        </div>
      </div>
      <hr class="horizontal dark"/>
      <div class="row justify-content-center">
        <div class="col-md-6">
          <label for="role" class="form-control-label"
          >Роль</label>
          <argon-select v-model="role"
                        :options="roles"></argon-select>
          <span v-if="v$.role.$error"> {{ v$.role.$errors[0].$message }}</span>
        </div>
      </div>
    </div>
    <div class="card-footer pt-1 ms-auto">
      <argon-button color="success" @click="addUser">{{ action === 'add' ? 'Добавить' : 'Редактировать' }}
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