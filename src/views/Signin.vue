<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Авторизация</h4>
                  <p class="mb-0">Введите номер телефона и пароль</p>
                </div>
                <div class="card-body" v-if="!recovery">
                  <div class="mb-3">
                    <argon-input v-model="formData.phone" type="text" placeholder="Номер телефона" name="phone"
                                 size="lg"/>
                  </div>
                  <div class="mb-3">
                    <argon-input v-model="formData.password" type="password" placeholder="Пароль" name="password"
                                 size="lg"/>
                  </div>

                  <div class="cursor-pointer" @click="recovery = true">
                    Востановить пароль
                  </div>

                  <div class="text-center">
                    <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        @click="submitAuth"
                    >Авторизация
                    </argon-button>
                  </div>
                </div>

                <div class="card-body" v-if="recovery">
                  <div class="mb-3">
                    <argon-input v-model="recoveryForm.phone" type="text" placeholder="Номер телефона" name="phone"
                                 size="lg"/>
                  </div>

                  <div class="cursor-pointer" @click="sendOtp" v-if="!otp_send">
                    Отправить код на почту
                  </div>

                  <div class="mb-3" v-if="otp_send">
                    <argon-input v-model="recoveryForm.password" type="text" placeholder="Новый пароль" name="phone"
                                 size="lg"/>
                  </div>
                  <div class="mb-3" v-if="otp_send">
                    <argon-input v-model="recoveryForm.code" type="text" placeholder="Код" name="phone"
                                 size="lg"/>
                  </div>

                  <div class="text-center">
                    <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        @click="recoveryPassword"
                    >Восстановить пароль
                    </argon-button>
                  </div>
                </div>
              </div>
            </div>
            <div
                class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                  class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                  style="background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg');
          background-size: cover;"
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4
                    class="mt-5 text-white font-weight-bolder position-relative"
                >"Attention is the new currency"</h4>
                <p
                    class="text-white position-relative"
                >The more effortless the writing looks, the more effort the writer actually put into the process.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import axios from "axios";
import { useToast } from 'vue-toastification'
import { mapMutations } from "vuex";
import { server } from "@/config";
import usersRoleMixin from "@/mixins/usersRoleMixin";

const body = document.getElementsByTagName("body")[0];

export default {
  name: "signin",
  components: {
    ArgonInput,
    ArgonButton,
  },
  data() {
    return {
      formData: {
        password: '',
        phone: '',
      },
      recoveryForm: {
        phone: '',
        password: '',
        code: ''
      },
      toast: useToast(),
      recovery: false,
      otp_send: false,
    }
  },
  mixins: [usersRoleMixin],
  methods: {
    ...mapMutations({
      setIsAuth: 'setIsAuth',
      setCurrentUser: 'setCurrentUser'
    }),
    async submitAuth() {
      const res = await axios.post(server.URL + '/api/users/login', this.formData)
      localStorage.setItem('session', res.session);
      localStorage.setItem('user', JSON.stringify(res.user));
      this.setIsAuth(true)
      this.setCurrentUser(res.user)
      this.toast.success('Успешно логинились')

      if (!this.isAdmin(res.user)) {
        await this.$router.push(`/users/${res.user.id}/calendar`)
      } else {
        this.$store.state.showASidenav = true;
        await this.$router.push(`/`)
      }
    },
    async sendOtp() {

      const data = {
        phone: this.recoveryForm.phone
      }

      const res = await axios.post(server.URL + "/api/users/get_activation_code_recovery_password", data);
      this.otp_send = true;
    },
    async recoveryPassword() {
      const data = {
        phone: this.recoveryForm.phone,
        code: this.recoveryForm.code,
        password: this.recoveryForm.password
      }

      await axios.post(server.URL + '/api/users/recovery_password', data)
      this.recovery = false
      this.otp_send = false
    }
  },
  created() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.add("bg-gray-100");
  },
};
</script>
