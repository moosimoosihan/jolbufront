<template>
  <div class="id_Header" style="text-align: center">
    <h1>비밀번호 찾기</h1>
  </div>
  <v-card class="mx-auto" max-width="500">
    <v-card-title class="text-h6 font-weight-regular justify-space-between">
      <span>{{ currentTitle }}</span>
      <v-avatar color="primary" size="24" v-text="step"></v-avatar>
    </v-card-title>
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text>
          <v-text-field
            v-model="email"
            label="Email"
            placeholder="john@google.com"
          ></v-text-field>
          <span class="text-caption text-grey-darken-1">
            가입할 당시 입력한 이메일을 입력해주세요.
          </span>
        </v-card-text>
      </v-window-item>
      <v-window-item :value="2">
        <v-card-text>
          <v-text-field
            v-model="name"
            label="name"
            type="text"
          ></v-text-field>
          <span class="text-caption text-grey-darken-1">
            가입할 당시 입력한 이름을 입력해주세요.
          </span><br>
          <span v-if="emailError" class="text-error">이메일을 입력해주세요.</span>
        </v-card-text>
      </v-window-item>
      <v-window-item :value="3">
        <div class="pa-4 text-center">
          <e-img class="mb-4" contain height="128" src="../assets/logo.png"></e-img>
          <e-text class="text-h6 font-weight-light mb-2">
            임시 비밀번호를 이메일로 전송하였습니다.
          </e-text><br>
          <span class="text-caption text-grey">로그인 후 꼭 변경해주세요.</span><br>
          <span v-if="nameError" class="text-error">이름을 입력해주세요.</span>
        </div>
      </v-window-item>
    </v-window>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn v-if="step > 1" variant="text" @click="step--"> Back </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="step < 3 && !emailError && !nameError" color="primary" variant="text" @click="step < 2 ? step++ : findPW()" > Next</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import axios from "axios";
import { EButton, EContainer, EHead, EHr, EHtml, EImg, EPreview, ESection, EText } from 'vue-email';
export default {
  data() {
    return {
      step: 1,
      id: "",
      password: "",
      name: "",
      email: "",
      search_user_id: "", // id 찾기로 받은 아이디
      response_id_check: false,
      response_pw_check: false,
      emailError: false, // 이메일 필드 유효성 검사 에러 여부
      nameError: false // 이름 필드 유효성 검사 에러 여부
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    currentTitle() {
      switch (this.step) {
        case 1:
          return "이메일을 입력해주세요";
        case 2:
          return "이름을 입력해주세요";
        default:
          return "비밀번호 확인해주세요";
      }
    },
  },
  methods: {
    findPW() {
      console.log(this.email);
      console.log(this.name);
      if (this.step === 1) {
        if (this.email === "" || !this.isValidEmail(this.email)) {
          this.$swal("유효한 이메일을 입력해주세요");
        } else {
          this.isValidEmail();
          if (this.emailError) {
            return; // 이메일 형식이 올바르지 않으면 함수를 종료합니다.
          }
          this.step++;
        }
      } else if (this.step === 2) {
        if (this.name === "") {
          this.$swal("이름을 입력해주세요");
        } else {
          axios
            .post("http://localhost:3000/auth/find_pass", {
              email: this.email,
              name: this.name,
              password: this.password,
            })
            .then((res) => {
              this.password = res.data.message;
              this.response_pw_check = true;
              this.step++; // API 호출이 성공하면 step을 증가시킵니다.

            })
            .catch((error) => {
              console.log(error);
              this.$swal("정보 확인에 실패했습니다.");
            });
        }
      } else if (this.step === 3) {
      }
    },
    isValidEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.emailError = true;
      } else {
        this.emailError = false;
      }return emailPattern.test(email);
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200&display=swap");

.id_Header {
  margin-top: 50px;
  margin-bottom: 50px;
  font-family: "Noto Serif KR", sans-serif;
}
.mb-4{
  width:100px;
  height:50px;
}
</style>
