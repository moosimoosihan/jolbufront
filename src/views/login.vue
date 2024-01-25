<template>
<div class="logo">
  <img :src="require('../assets/logo.png')" @click="gotoMain()"/>
   <main id="main-holder">
    <div class="login">
     </div>
    <h1 id="loginn">로그인</h1>
    <div id="zolboologin">ZolBoo 계정으로 로그인</div>
    <input type="text" name="username" id="username-field" class="login-form-field" placeholder="아이디를 입력해주세요" v-model="user_id" @keyup.enter="localLogin()">
    <input type="password" name="password" id="password-field" class="login-form-field" placeholder="비밀번호를 입력해주세요" v-model="user_pw" @keydown.enter="localLogin()">
    <input type="submit" value="로그인" id="login-form-submit" @click="localLogin()">
    <input type="submit" value="회원가입" id="join-form-submit" @click="gotoSignUp()">
    <img :src="require('../assets/kakao.png')" class="btn_kakao" @click="kakaoLogin">
    <div id="naverIdLogin" @click="naverBtnClick()"></div>
    <input type="submit" value="아이디 / 비밀번호 찾기" id="find" @click="goToFind()">
  </main>
</div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Login',
   data() {
      return{
        id: '',
        naver_id: '',
        password: '',
        // naverLogin: [],
      }
    },
    methods: {
      gotoSignUp() {//회원가입
        this.$router.push('/login/signup')
      },
      goToFind() {
            this.$router.push({ path: '/login/find' });
      },
      // 로컬 로그인
      localLogin() {
        if(this.user_id == '' || this.user_pw == '') {
          this.$swal("아이디와 비밀번호를 입력해주세요.")
          return
        }
        axios({
          url: "http://localhost:3000/auth/login_process",
          method: "POST",
          data: {
            user_id: this.user_id,
            user_pw: this.user_pw
          },
        })
          .then(res => {
            if (res.data.message == 'undefined_id') {
              this.$swal("존재하지 않는 아이디입니다.")
            } else if (res.data.message == 'incorrect_pw'){
              this.$swal("비밀번호가 일치하지 않습니다.")
              return
            } else {
              this.$store.commit("user", { user_id: this.user_id, user_no: res.data.message, kakao: '' })
              this.$swal({
                position: 'top',
                icon: 'success',
                title: '로그인 성공!',
                showConfirmButton: false,
                timer: 1000
              }).then(() => {
                this.$router.push({ path : '/'});
              })
            }
          })
          .catch(err => {
            console.log(err);
          })
      },

      //카카오 로그인
      kakaoLogin() {
        window.Kakao.Auth.login({
            scope: "profile_nickname, account_email",
            success: this.getKakaoAccount,
        });
      },
      getKakaoAccount() {
        window.Kakao.API.request({
            url: "/v2/user/me",
            success: (res) => {
                const kakao_account = res.kakao_account;
                const email = kakao_account.email; //카카오 이메일
                const name = kakao_account.profile.nickname
                console.log( email, name)

                axios({
                    url: "http://localhost:3000/auth/kakaoLoginProcess",
                    method: "POST",
                    data: {
                        user_id: name,
                        user_email: email,
                    },
                }).then(res => {
                    if (res.data.message == '저장완료') {
                        this.$swal({
                            position: 'top',
                            icon: 'success',
                            title: '회원가입 성공!',
                            showConfirmButton: false,
                            timer: 1000
                        })
                    }
                    else {
                        this.$store.commit("user", { user_id: email, user_no: res.data.message, kakao : 'kakao' })
                        this.$swal({
                            position: 'top',
                            icon: 'success',
                            title: '로그인 성공!',
                            showConfirmButton: false,
                            timer: 1000
                        }).then(() => {
                            window.location.href = "http://localhost:8080";
                        })
                    }
                })
                    .catch(err => {
                        console.log(err);
                    })
            },
            fail: (error) => {
                // this.$router.push("/errorPage");
                console.log(error);
            },
        });
      },
        //네이버
        naverlogin() {
            console.log("로그인함수 실행됨")
            axios({
                url: "http://localhost:3000/auth/naverlogin",
                method: "POST",
                data: {
                    // naverlogin: this.naverLogin.accessToken.accessToken,
                    naverlogin: this.naverLogin.user,
                },
            })
                .then(res => {
                    if (res.data.message == '저장완료') {
                        this.$swal({
                            position: 'top',
                            icon: 'success',
                            title: '회원가입 성공!',
                            showConfirmButton: false,
                            timer: 1000
                        });
                    } else {
                        this.$store.commit("user", { user_id: this.naver_id, user_no: res.data.message })
                        this.$swal({
                            position: 'top',
                            icon: 'success',
                            title: '로그인 성공!',
                            showConfirmButton: false,
                            timer: 1000,
                        }).then(() => {
                            window.location.href = "http://localhost:8080/";
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
       },//메인페이지 이동
        gotoMain() {
          this.$router.push('/')
        },//네이버 페이지 버튼
        naverBtnClick(){
          var btnNaverLogin = document.getElementById("naverIdLogin").firstChild;
          btnNaverLogin.click();
        },//소켓
        formatDateTime(dateTime) {
          const date = new Date(dateTime);
          const options = {
              year: "numeric",
              month: "long",
              day: "numeric",
          };
          const formattedDateTime = date.toLocaleDateString("ko-KR", options);
          return formattedDateTime;
        },
    },
    computed: {
        user() {
            return this.$store.state.user; // user 정보가 바뀔 때마다 자동으로 user() 갱신
        },
    },
    mounted() {
        document.getElementById('username-field').focus();
        this.naverLogin = new window.naver.LoginWithNaverId({
            clientId: process.env.VUE_APP_NAVER_API_KEY,
            callbackUrl: "http://localhost:8080/login/naverlogin",
            isPopup: false,
            loginButton: {
              color: "green", type: 1, height: 45
            },
        });
        this.$store.commit("naverLogin", this.naverLogin);

        this.naverLogin.init();

        this.naverLogin.getLoginStatus((status) => {
            if (status) {
                console.log(status);
                console.log(this.naverLogin.user.nickname);

                const email = this.naverLogin.user.email;
                const id = this.naverLogin.user.id;
                const name = this.naverLogin.user.nickname;

                this.naver_id = id;
                console.log(email)
                console.log(name)

            } else {
                console.log("callback처리 실패");
            }
        });
      },

};
</script>
<style scoped>
html {
  height: 100%;
}

.logo {
  margin-left: 20px;
  margin-top: 1px;
  margin-bottom: 1px;
}
#loginn{
  width:94px;
  height: 44px;
  font-weight: 10px;
  font-weight: bold;
}
#zolboologin{
  width:189px;
  height: 37px;
}
#main-holder {
  display: grid;
  width: 499px;
  height: 615px;
  margin: 6% auto;
  border: solid 2px rgb(0, 0, 0);
  border-radius: 30px;
  align-items: center;
}

.login-form-field {
  width: 307px;
  height: 45px;
  font-size: 16px;
  margin-left: 50px;
  margin-bottom: 10px;
  border: solid 1.5px  rgb(0, 0, 0);
  text-align: center;
  border-radius: 8px;
  position: relative;
  font-family: 'GmarketSansMedium';
}
#login-form-submit {
  width: 307px;
  height: 46px;
  padding: 7px;
  border: none;
  border-radius: 15px;
  color: white;
  font-weight: bold;
  background-color:  rgb(94, 80, 249);
  cursor: pointer;
  outline: none;
  margin-bottom: 10px;
  margin-left: 50px;
  font-size: 18px;
}


#join-form-submit {
  width: 90px;
  height: 18px;
  color: black;
  cursor: pointer;
  outline: none;
  margin-bottom: 10px;
  margin-left: 50px;
  font-size: 15px;
}


#find {
  width: 100%;
  text-align: center;
  border: none;
  background: none;
  color: rgb(136, 136, 136);
  cursor: pointer;
  outline: none;
  margin-top:50px;
}

#login-header {
  text-align: center;
  margin-bottom: 50px;
}
/*헤더*/
</style>
