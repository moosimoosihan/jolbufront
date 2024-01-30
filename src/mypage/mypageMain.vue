<template>
<v-app id="inspire">
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="3">
          <span>아이디</span>
          <v-sheet color="grey-lighten-4" class="pa-4"/>
          <h1>핼로 : {{ UserInfo.ID }}</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <span>이름</span>
          <v-sheet color="grey-lighten-4" class="pa-4"/>
          <h1></h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5">
          <span>이메일</span>
          <v-sheet
          color="grey-lighten-4"
          class="pa-4"/>
           <!--<h1>{{ user_email}}</h1>-->
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5">
          <span>비밀번호</span>
          <v-sheet
          color="grey-lighten-4"
          class="pa-4"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5">
          <span>비밀번호 확인</span>
          <v-sheet color="grey-lighten-4" class="pa-4"/>
          <v-btn class="ma-2" color="blue">
            확인
            <v-icon end icon="mdi-pencil"></v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5">
          <span>투자성향</span>
          <v-sheet
          color="grey-lighten-4"
          class="pa-4"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-btn class="ma-2" color="blue">
            수정하기
            <v-icon end icon="mdi-pencil"></v-icon>
          </v-btn>
          <v-btn class="ma-2" >로그아웃
          <v-icon end icon="mdi-cancel"></v-icon>
        </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</v-app>
</template>
<script>
import axios from 'axios';
 export default {
  data() {
    return {
      UserInfo: {},
    }
  },
  created(){
    this.getUserInfo();

  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
    methods: {
        //유저정보
        async getUserInfo() {
          try {
            const user_no = this.user.user_no;
            const response = await axios.get(`http://localhost:3000/mypage/mypage/${user_no}`);
            this.UserInfo = response.data[0];
          } catch (error) {
            console.error(error);
          }
        },
    }
  }

</script>
