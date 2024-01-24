<template>
  <div class="container">

    <div class="logo">
        <img :src="require('../assets/logo.png')" @click="gotoMain()">
    </div>
      <div id="box1">
        <div class="name">
          <span class="s">이름</span>
          <input id="name" type="text" v-model="user_name" placeholder="이름을 입력해 주세요.">
        <div class="pns">
          <span class="s">투자성향</span>
          <input id="pnspns" type="text" v-model="user_pns" placeholder="투자 성향을 입력해 주세요.">
        </div>
        </div>
        <div class="id">
          <span class="s">아이디</span>
          <input id="id" type="text" v-model="user_id" placeholder="id를 입력해 주세요." @input="id_check()">
          <p class="alert_font" v-if="id_check_bool==1" style="color:red;">중복된 아이디입니다.</p>
          <p class="alert_font" v-else-if="id_check_bool==2" style="color:red;">DB 에러 발생</p>
          <p class="alert_font" v-else-if="id_check_bool==3">사용 가능한 아이디입니다.</p>
          <p class="alert_font" v-else >&nbsp;</p>
        </div>
        <div class="email">
          <span class="s">이메일</span>
          <input id="email" type="text"  v-model="user_email" placeholder="이메일을 입력해 주세요." @input="email_check()">
          <p class="alert_font" v-if="email_check_bool==1" style="color:red;">사용할 수 없는 이메일입니다.</p>
          <p class="alert_font" v-else-if="email_check_bool==2">사용 가능한 이메일입니다.</p>
          <p class="alert_font" v-else >&nbsp;</p>
        </div>
        <div class="password">
          <span class="s">비밀번호</span>
          <input id="password" type="password"  v-model="user_pw" placeholder="비밀번호를 입력해 주세요.(6자리 이상)">
          <p class="alert_font" v-if="user_pw.length < 6 && user_pw.length!=0" style="color:red;">비밀번호는 6자리 이상으로 입력해주세요.</p>
          <p class="alert_font">&nbsp;</p>
        </div>
        <div class="passwordCheck">
          <span class="s">비밀번호 확인</span>
          <input id="passwordCheck" type="password"  v-model="user_pw_ck" placeholder="비밀번호를 다시 입력해 주세요.">
          <p class="alert_font" v-if="user_pw_ck!==user_pw" style="color:red;">비밀번호가 일치하지 않습니다.</p>
          <p class="alert_font" v-else >&nbsp;</p>
        </div>
      </div>
      <div id="box3">
        <div class="signUp">
          <button class="cancelButton" @click="gotoLogin()">취소하기</button>
          <input type="submit" class="signUpButton" @click="onSubmitForm()" value="가입하기">
        </div>
      </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data () {
    return{
      user_id: '', //아이디
      user_email: '', //이메일
      user_name:'',
      user_pns:'',
      user_pw: '', //비밀번호
      // 실시간 확인 데이터
      id_check_bool: 0,
      email_check_bool: 0,
      phone_check_bool: 0,
      
    
    }
  },
  mounted() {
    document.getElementById('id').focus();
  },
  methods: {
    //로컬로그인 정보
    onSubmitForm() {
            if (!this.validationCheck()) {
                return;
            }
            axios({
                url: "http://localhost:3000/auth/join_process",
                method: "POST",
                data: {
                    user_id: this.user_id,
                    user_email: this.user_email,
                    user_pw: this.user_pw,
                    user_name:this.user_name,
                    user_pns:this.user_pns,
                    // user_social_tp: 0,
                    // user_accesstoken: '',
                    // user_tp: 0,
                },
            })
            //유효성검사
                .then(res => {
                    if (res.data.message == 'already_exist_id') {
                        this.$swal("이미 존재하는 아이디입니다.")
                    }
                    else if (res.data.message == 'DB_error') {
                        this.$swal("DB 에러 발생")
                    }
                   
                    else  {
                        this.$swal({
                            position: 'top',
                            icon: 'success',
                            title: '회원가입이 완료되었습니다!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        this.$router.push({ path: '/login' }); // 로그인 화면으로 이동
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //메인페이지로 이동
        gotoMain() {
          this.$router.push('/')
        },
        //유효성검사
        validationCheck() {
            if (this.user_id == "") {
                this.$swal("아이디를 입력하세요.");
                return false;
            }
            // 아이디가 한글인 경우 제외
            if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(this.user_id)) {
                this.$swal("아이디에는 한글을 사용할 수 없습니다.");
                return false;
            }

            if (this.user_nick == "") {
                this.$swal("닉네임을 입력하세요.");
                return false;
            }

            if (this.user_email == "") {
                this.$swal("이메일 주소를 입력하세요.");
                return false;
            }

            if (this.user_pw == "") {
                this.$swal("비밀번호를 입력하세요.");
                return false;
            }

            if (this.user_pw_ck !== this.user_pw) {
                this.$swal("비밀번호가 일치하지 않습니다.");
                return false;
            }
            if(this.user_pw.length < 6){
                this.$swal("비밀번호는 6자리 이상으로 입력해주세요.");
                return false;
            }
            return true;
        },
       
        gotoLogin() {
          this.$router.back();
        },
            //아이디 유효성검사
            id_check() {
                if(this.user_id == "") {
                    this.id_check_bool = 0;
                    return;
                }
                // 아이디에 특수문자, 공백, 한글 입력 불가
                this.user_id = this.user_id.replace(/[^a-z0-9]/gi,'');
                axios({
                    url: "http://localhost:3000/auth/id_check",
                    method: "POST",
                    data: {
                        user_id: this.user_id,
                    },
                })
                    .then(res => {
                        console.log(res.data.message);
                        if (res.data.message == 'already_exist_id') {
                            this.id_check_bool = 1;
                            return;
                        }
                        else if (res.data.message == 'DB_error') {
                            this.id_check_bool = 2;
                            return;
                        }
                        else {
                            this.id_check_bool = 3;
                            return;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    
                })
            },
            //이메일 유효성 검사
            email_check() {
                if(this.user_email == "") {
                    this.email_check_bool = 0;
                    return;
                }
                // 이메일에  @와 .을 제외한 특수문자, 공백, 한글 입력 불가
                this.user_email = this.user_email.replace(/[^a-z0-9@.]/gi,'');
                // 이메일이 영어@영어.영어 가 아닌 경우
                if(!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(this.user_email)) {
                    this.email_check_bool = 1;
                    return;
                }
                this.email_check_bool = 2;
            },
          
  }
}
</script>
<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.logo {
  
}  
.logo img {
    width: 200px;
    height: 85px;
}
.container {
    width: 800px;
    height: 800px;
    margin: 6% auto;
    border-radius: 30px;
    border: 2px solid rgb(221, 221, 221);
}
div {
    padding-top: 20px;
}
#img-preview{
    width: 200px;
    height: 200px;
    margin-top: -20px;
}
#img-preview_default{
    width: 200px;
    height: 200px;
    margin-top: -20px;
}
.signUp {
    width: 700px;
}
.signUpButton {
    width:300px;
    cursor:pointer;
}
#addressButton {
    color: rgb(123, 123, 123);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 10px;
    cursor: pointer;
    float: right;
}
.cancelButton {
    width:300px;
    cursor:pointer;
    color: rgb(123, 123, 123);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 10px;
}
#box1 .address .addressDetail input {
    float:right;
    width: 300px;
    line-height: 35px;
    font-size: 12px;
    color: rgb(137, 137, 137);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 10px;
    margin-left: 30px;
    margin-top:10px;
}
#box1 .address .addinput1 {
    float:right;
    margin-left: 10px;
    width: 60px;
    line-height: 35px;
    font-size: 12px;
    color: rgb(137, 137, 137);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 10px;
}
#box1 .address .addinput2 {
    float:right;
    margin-left: 10px;
    width: 150px;
    line-height: 35px;
    font-size: 12px;
    color: rgb(137, 137, 137);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 10px;
}
button{
    cursor: pointer;
    height: 40px;
    width: 70px;
    margin-left:10px;
}
.signUp button {
    margin-left: 80px;
}

.signUp input {
    color: rgb(123, 123, 123);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 10px;
    cursor: pointer;
}
.signUp input:hover {
    color: rgb(0, 0, 0);
    border: 2px solid rgb(0, 110, 33);
    background-color: rgb(0, 110, 33);
    border-radius: 10px;
    cursor: pointer;
}

#box1 input {
    margin-left: 10px;
    width:300px;
    line-height: 35px;
    font-size: 12px;
    padding-left: 10px;

    float: right;
    color: rgb(137, 137, 137);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 10px;
}

#box3 input {
    margin-left: 10px;
    width:300px;
    line-height: 35px;
    font-size: 12px;
    padding-left: 10px;
    
    float: right;
    color: rgb(137, 137, 137);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 10px;
}

#addressDetail {
    margin-left: 10px;
    width: 430px;
    color: rgb(137, 137, 137);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 3px;
    line-height: 35px;
    font-size: 12px;
    padding-left: 10px;
    padding-right: 10px;
    float: right;
}

#box1 {
    width: 400px;
    height: 500px;
    float: left;
}


#box2 {
  margin-top: 50px;
  width: 300px;
  height: 400px;
  float: right;
}
/* 버튼컨테이너 */
#box3 {
  margin-top: 50px;
  width: 1000px;
  height: 50px;
  float: left;
}

.profile-img {
  width: 200px;
  height: 200px;
  text-align: center;
  border-radius: 70%;
  overflow: hidden;
  border: 2px solid rgb(221, 221, 221);
}
.upload-img button {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: rgb(255, 0, 0);
    border: 2px solid rgb(123, 123, 123);
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    margin-left: -10px;
    margin-top: -10px;
  }
.alert_font{
    font-size: 10px;
    margin-left: 180px;
}
input:focus {
    /* border: 2px solid #ffc905; */
    outline: 2px solid rgb(255, 236, 253);
}
.s {
    margin-left: 20px;
    font-size: 12px;
    font-weight: bold;
}
.isLoadingScreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../assets/logo.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
}
</style>