<template>
  <v-app-bar class="px-3" flat density="compact">
    <v-img @click="gotoHome()" class="mx-auto" v-bind="img" :aspect-ratio="aspectRatios.value" />
    <v-spacer></v-spacer>
    <v-tabs centered color="grey-darken-2">
      <v-tab class="mr-10 hvr-underline-from-left" @click="gotoHome()">MY종목</v-tab>
      <v-tab class="hvr-underline-from-left" @click="gotoMyStock()">고객센터</v-tab>
    </v-tabs>
    <v-spacer></v-spacer>
    <v-tab v-if="user.user_id===''" class="mr-5 hvr-underline-from-left" @click="gotoLogin()">로그인 | 회원가입</v-tab>
    <v-tab v-if="user.user_id!==''" class="mr-5 hvr-underline-from-left" @click="gotoMyPage()">마이페이지</v-tab>
    <v-tab v-if="user.user_id!==''" class="mr-5 hvr-underline-from-left" @click="logout()">로그아웃</v-tab>
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
    gotoMyStock () {
      this.$router.push('/myStock')
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
/* ------------------------------------------------------ logo */
.logo_img {
  width: 150px;
  height: 60px;
  float: left;
  padding: 0 0 0 16px;
}

/* ------------------------------------------------------ navi */

/* Underline From Left */
.hvr-underline-from-left {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;
  overflow: hidden;
  font-weight: bold;
  font-size: 18px;
}

.hvr-underline-from-left:before {
  content: "";
  position: absolute;
  z-index: -1;
  left: 0;
  right: 100%;
  bottom: 0;
  background: black;
  height: 2px;
  -webkit-transition-property: right;
  transition-property: right;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
}

.hvr-underline-from-left:hover, .hvr-underline-from-left:focus, .hvr-underline-from-left:active {
  color: blue;
}

.hvr-underline-from-left:hover:before, .hvr-underline-from-left:before, .hvr-underline-from-left:before {
  //-webkit-transform: scale(1);
  transform: scale(1);
}
</style>
