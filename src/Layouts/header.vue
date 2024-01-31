<template>
  <v-app-bar flat density="compact">
    <v-img @click="gotoHome()" class="mx-2 ml-10 mt-1" v-bind="img" max-height="60" max-width="60" contain />
    <v-spacer></v-spacer>
    <v-tab v-if="user.user_id===''" height="50" class="mr-5" @click="gotoLogin()">로그인</v-tab>
    <v-tab v-if="user.user_id!==''" height="50" class="mr-5" @click="gotoMyPage()">마이페이지</v-tab>
    <v-tab v-if="user.user_id!==''" height="50" class="mr-5" @click="logout()">로그아웃</v-tab>
  </v-app-bar>
</template>
<script>
export default {
  name: 'header',
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  data () {
    return {
      img: {
        src: require('@/assets/logo.png')
      },
      aspectRatios: [
        { text: '16:9', value: 16 / 9 },
        { text: '4:3', value: 4 / 3 },
        { text: '1:1', value: 1 },
        { text: '2:3', value: 2 / 3 },
        { text: '3:4', value: 3 / 4 }
      ]
    }
  },
  methods: {
    gotoHome () {
      this.$router.push('/')
    },
    gotoLogin () {
      this.$router.push('/login')
    },
    gotoMyPage () {
      this.$router.push('/myPage')
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

</style>
