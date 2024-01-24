<template>
  <div class="header_wrapper">
    <div class="navbar_top">
      <!-- 로고 -->
      <div @click="gotoHome()" class="navbar_logo">
        <img class="logo_img" :src="require(`../assets/logo.png`)" alt="로고">
      </div>
      <!-- 로그인 버튼 및 마이페이지 버튼 -->
      <div class="mymenu">
        <div v-if="user.user_id===''">
          <button @click="gotoLogin()" class="login_btn">로그인</button>
        </div>
        <div v-else>
          <div>
            <button @click="gotoMyPage()">마이페이지</button>
            <button @click="logout()">로그아웃</button>
          </div>
        </div>
      </div>
      <!-- 검색바 -->
      <div class="navbar_search">
        <input type="text" v-model="searchKeyword" placeholder="종목명/코드명을 입력해주세요">
        <div>
          <a @click="gotoSearch()"><button class="search_btn">
            <i class="fas fa-search"></i>
          </button></a>
        </div>
      </div>
    </div>
    <div class="menu">
      <a class="hvr-underline-from-left" @click="gotoHome()">메인종목 추천(AI추천)</a>
      <a class="hvr-underline-from-left" @click="gotoMyStock()">MY종목</a>
    </div>
  </div>
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
      searchKeyword: ''
    }
  },
  methods: {
    gotoHome () {
      this.$router.push('/')
    },
    gotoMyStock () {
      this.$router.push('/myStock')
    },
    gotoSearch () {
      this.$router.push({ name: '/search', params: { keyword: this.searchKeyword } })
    },
    gotoLogin () {
      this.$router.push('/login')
    },
    gotoMyPage () {
      this.$router.push('/myPage')
    },
    logout () {
      if(this.user.kakao==='kakao'){
        Kakao.API.request({
          url: '/v1/user/unlink',
          success: function(response) {
          console.log(response);
          },
          fail: function(error) {
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
        })
      })
    }
  }
}
</script>
<style scoped>
.header_wrapper {
  font-size: 15px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  min-width: 1280px;
  height: 110px;
}
.navbar_top {
  height: 50px;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  --bs-navbar-padding-x: 0;
}
a {
  text-decoration: none;
}
/* ------------------------------------------------------ logo */
.navbar_logo {
  scale: 100%;
  position: relative;
}
.logo_img {
  width: 200px;
  height: 85px;
  float: left;
  padding: 0 0 0 16px;
  margin-top: 25px;
  margin-left: 35px;
}
/* ------------------------------------------------------ login */
.login_btn {
  float: right;
  margin-top: 15px;
  margin-right: 35px;
  margin-top: 40px;
  background-color: transparent;
  border: 0;
}
/* ------------------------------------------------------ search */
.navbar_search {
  display: flex;
  width: 20%;
  max-width: 100%;
  background-color: rgb(255, 255, 255);
  border-bottom: black 1px solid;
  float : right;
  margin-right: 55px;
  margin-right: 55px;
  margin-top: 50px;
}
input[type='text'] {
  width: 100%;
  font-size: 1rem;
  outline: none;
  background-color: rgb(255, 255, 255);
  margin-right: 8px;
  margin-left: 5px;
}

/* ------------------------------------------------------ navi */
.menu {
  width: 50%;
  position: absolute;
  overflow: hidden;
  justify-content: space-between;
}

.menu a {
  color: black;
  user-select: none;
  margin-left: 200px;
}

/* ------------------------------------------------------ menu hover */
/* Underline From Left */
.hvr-underline-from-left {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;
  overflow: hidden;
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
.hvr-underline-from-left:hover:before, .hvr-underline-from-left:focus:before, .hvr-underline-from-left:active:before {
  right: 0;
}
/* ------------------------------------------------------ login & mypage */
.mymenu {
  width:100px;
  overflow: hidden;
  margin-top: 8px;
  margin-bottom: 30px;
  float:right;
}
</style>
