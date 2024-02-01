<template>
  <v-container>
    <v-navigation-drawer
      permanent
    >
      <v-list>
        <v-tabs direction="vertical" class="custom-tabs">
          <v-tab to="/admin/" class="m">
            <v-icon start>mdi-account</v-icon>
            <p>관리자 홈</p>
          </v-tab>
          <v-tab to="/admin/auth" class="m">
            <v-icon start>mdi-account-multiple</v-icon>
            <p>회원 관리</p>
          </v-tab>
          <v-tab to="/admin/mock" class="m">
            <v-icon start>mdi-folder</v-icon>
            <p>모의 투자</p>
          </v-tab>
          <v-tab to="/admin/ai" class="m">
            <v-icon start>mdi-history</v-icon>
            <p>AI 답변</p>
          </v-tab>
          <v-tab @click="logout()" class="m">
            <v-icon start>mdi-minus-circle</v-icon>
            <p>로그아웃</p>
          </v-tab>
        </v-tabs>
      </v-list>
    </v-navigation-drawer>
    <div class="default_content">
      <router-view />
    </div>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'adminLayout',
  computed:{
    user(){
      return this.$store.state.user
    }
  },
  created(){
    this.getUser()
  },
  methods: {
    async getUser(){
      if(this.user.user_no==='')
        return this.$router.push('/')

      try {
        const response = await axios.post(`http://localhost:3000/admin/admin_check`,{
          user_no:this.user.user_no
        });
        if(response.data.auth==='user')
          return this.$router.push('/')
      } catch (error) {
        console.error(error);
      }
    },
    logout () {
      if (this.user.kakao === 'kakao') {
        Kakao.API.request({
          url: '/v1/user/unlink',
          success: function (response) {
            console.log(response);
          },
          fail: function (error) {
            alert('탈퇴처리가 미완료되었습니다. \n관리자에게 문의하시기 바랍니다.');
            console.log(error);
          }
        })
      }
      this.$swal({
        position: 'top',
        icon: 'success',
        title: '로그아웃 성공!',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        window.location.href = 'http://localhost:8080'
        this.$store.commit('user', {
          user_no: '',
          user_id: '',
          kakao: '',
          save_id: this.user.save_id
        })
      })
    }
  }
}
</script>
<style scoped>
.default_content {
  margin: auto;
  height: 100%;
  position: relative;
  min-height: 100%;
}
.m {
  margin-top: 10px;
  color: black;
  width: 200px;
}
.custom-tabs .v-tab {
  font-size: 16px; /* 원하는 글씨 크기로 설정 */
  font-weight:bold;
}
</style>
