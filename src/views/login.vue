<template>
  <div class="logo">
    <img class="logo_img" :src="require('../assets/logo.png')" @click="gotoMain()"/>
     <main id="main-holder">
      <h1>로그인</h1>
      <input type="text" name="username" id="username-field" class="login-form-field" placeholder="아이디를 입력해 주세요." v-model="user_id" @keyup.enter="localLogin()">
      <input type="password" name="password" id="password-field" class="login-form-field" placeholder="비밀번호를 입력해 주세요." v-model="user_pw" @keydown.enter="localLogin()">
      <div class="custom-checkbox">
        <input type="checkbox" id="keepLogin" value="Y" v-model="idS" style="float:left" readonly @input="idSave()">
        <label tabindex="0" for="keepLogin">아이디 저장</label>
      </div>
      <input type="submit" value="로그인" class="login-form-submit" @click="localLogin()">
      <div class="mymenu">
        <div v-if="user.user_id===''" class="horizontal-buttons">
          <button @click="goToFind()" class="login_btn1">아이디 찾기</button>
          <span> | </span>
          <button @click="goToFindPw()" class="login_btn1">비밀번호 찾기</button>
          <span> | </span>
          <button @click="gotoSignUp()" class="login_btn1">회원가입</button>
        </div>
      </div>
      <hr>
      <p class="snslogin">SNS 계정으로 로그인</p>
      <div class="sns_container">
        <img :src="require('../assets/kakao.png')" class="btn_kakao" @click="kakaoLogin">
        <div id="naverIdLogin"></div>
      </div>
    </main>
  </div>
  </template>
  <script>
  import axios from 'axios'
  export default {
    name: 'Login',
     data() {
        return{
          user_id: '',
          naver_id: '',
          user_pw: '',
          // naverLogin: [],

          idS:false,
        }
      },
      methods: {
        gotoSignUp() {//회원가입
          this.$router.push('/login/signup')
        },
        goToFind() {
              this.$router.push({ path: '/login/find' });
        },
        goToFindPw() {
          this.$router.push({ path: '/login/findPw' });
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
                var sid = this.idS? this.user_id : '';
                this.$store.commit("user", { user_id: this.user_id, user_no: res.data.message, kakao: '', save_id:sid })
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
          idSave(){
            this.idS = !this.idS
          }
      },
      computed: {
          user() {
              return this.$store.state.user; // user 정보가 바뀔 때마다 자동으로 user() 갱신
          },
      },
      created() {
        if(this.user.save_id!=''){
          this.user_id=this.user.save_id
          this.idS = true
        }
      },
      mounted() {
          document.getElementById('username-field').focus();
          this.naverLogin = new window.naver.LoginWithNaverId({
              clientId: process.env.VUE_APP_NAVER_API_KEY,
              callbackUrl: "http://localhost:8080/login/naverlogin",
              isPopup: false,
              loginButton: {
                color: "green", type: 1, height:60
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
    margin-top: 1px;
    margin-bottom: 1px;
  }

  .logo_img{
    width: 10%;
    margin: auto;
    display: block;
    padding-top: 20px;
  }

  .zolboologin {
    width: 189px;
    height: 45px;
    text-align: center;
    line-height: 45px; /* 수직 가운데 정렬을 위한 line-height 설정 */
  }
  .custom-checkbox {
    margin-left: 10px;
    font-size:20px;
  }
  .custom-checkbox input {
    width:40px;
    height: 22px;
    margin-top:3px;
    margin-bottom: 26px;
  }
  #main-holder {
    display: grid;
    width: 499px;
    height: 620px;
    margin: 3% auto;
    align-items: center;
  }

  .login-form-field {
    width: 486px;
    height: 70px;
    font-size: 21px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
    border: solid 1.5px rgb(174, 174, 174);
    text-align: left;
    padding-left: 12px;
    border-radius: 2px;
    position: relative;
    font-family: 'GmarketSansMedium';
  }
  .login {
    text-align: center;
  }

  .login-form-submit {
    width: 486px;
    height: 73px;
    border: none;
    border-radius: 14px;
    color: white;
    font-weight: bold;
    background-color:  #6A94D2;
    cursor: pointer;
    outline: none;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    font-size: 28px;
  }
  h1{
    text-align: center;
    font-weight: bold;
    font-size: 45px;
    margin-bottom: 45px;
  }
  /* .btn_naver {
    width: 300px;
    height: 85px;
    padding: 7px;
    cursor: pointer;
    outline: none;
    margin-left: auto;
    margin-right: auto;

    } */


  .btn_kakao{
    width:60px;
    float:left;
    margin-right:15px;
    margin-bottom:10px;
  }
  .find {
    width: 100%;
    text-align: center;
    color: rgb(136, 136, 136);
    cursor: pointer;
    margin-top: -50px;
  }
  .login_btn1 {
  font-size: 18px;
  text-align: center;
}
.horizontal-buttons{
  display: flex;
  margin-right: 5px;
  margin-left: 52px;
  margin-top: 20px;
  margin-bottom: 30px;
}
  #login-header {
    text-align: center;
    margin-bottom: 50px;
  }
  .mymenu button {
    margin-left: 20px;
    margin-right: 20px;
  }
  .sns_container {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    /* margin-top: -15px; */
  }
  .snslogin{
    text-align: center;
    font-size: 23px;
    margin-top: 20px;
    margin-bottom: 25px;
    font-size: 1.4rem;

  }

  /*헤더*/
  </style>
