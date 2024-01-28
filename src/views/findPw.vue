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
            v-model="user.email"
            label="이메일"
            placeholder="john@google.com"
          ></v-text-field>
          <span class="text-caption text-grey-darken-1">
            가입할 당시 입력한 이메일을 입력해주세요.
          </span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="2">
        <v-card-text>
          <v-text-field v-model="user.name" label="이름"></v-text-field>
          <span class="text-caption text-grey-darken-1">
            가입할 당시 입력한 이름을 입력해주세요.
          </span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="3">
        <div class="pa-4 text-center">
          <v-img
            class="mb-4"
            contain
            height="48"
            width="70"
            position="center"
            src="../assets/logo.png"
          ></v-img>
          <h3
            class="text-h6 font-weight-light mb-2"
            style="padding-bottom: 6%; padding-top: -10%"
          >
            가입하신 아이디는 {{ user.id }} 입니다.
          </h3>
        </div>
      </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn v-if="step > 1" variant="text" @click="step--">뒤로 가기</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        v-if="step < 3"
        color="primary"
        variant="flat"
        @click="findId()"
      >
        다음
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  data: () => {
    return {
      step: 1,
      user: {
        email: '',
        name: '',
        id: ''
      }
    }
  },

  // REST API / PATH PARAMETER , QUERY PARAMETER / HTTP METHOD(GET, POST, PUT, DELETE

  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "이메일을 입력하세요";
        case 2:
          return "이름을 입력하세요";
        default:
          return "성공";
      }
    },
  },

  methods: {
    findId() {
      if (this.step === 1) {
        this.step++;
      } else if (this.step === 2) {
        // 이름 입력 단계에서 다음 버튼을 클릭한 경우
        // 이름과 관련된 백엔드 API를 호출하여 해당 이름에 대한 아이디를 가져옵니다.
        axios
          .post(`http://localhost:3000/auth/findId?email=${this.user.email}&name=${this.user.name}`, )
          .then(response => {
            // API 응답에서 받은 아이디를 사용자 객체에 저장합니다.
            this.user.id = response.data.user_id;
            this.step++; // 다음 단계로 이동합니다.
          })
          .catch(error => {
            console.error(error);
            // 에러 처리 로직을 추가하세요.
          });
      }
    },
  },
};
</script>

<style scoped>
.id_Header {
  margin-top: 50px;
  margin-bottom: 50px;
}
</style>
