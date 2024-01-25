<template>   
  <div class="container">
    <div class="logo">
        <img :src="require('../assets/logo.png')" @click="gotoMain()">
        <h1 class="singnupp">회원가입</h1>
       <div id="box1">
        <div class="name">
          <span class="s">이름</span>
          <input id="name" type="text" v-model="user_name" placeholder="이름을 입력해 주세요.">
           <p class="alert_font">&nbsp;</p>
        </div>
        <div class="id">
          <span class="s">아이디</span>
          <input id="id" type="text" v-model="user_id" placeholder="아이디를 입력해 주세요." @input="id_check()">
          <p class="alert_font" v-if="id_check_bool==1" style="color:red;">중복된 아이디입니다.</p>
          <p class="alert_font" v-else-if="id_check_bool==2" style="color:red;">DB 에러 발생</p>
          <p class="alert_font" v-else-if="id_check_bool==3">사용 가능한 아이디입니다.</p>
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
          <p class="alert_font" v-if="user_pw_ck!=user_pw" style="color:red;">비밀번호가 일치하지 않습니다.</p>
          <p class="alert_font" v-else >&nbsp;</p>
        </div>
        <div class="email">
          <span class="s">이메일</span>
          <input id="email" type="text"  v-model="user_email" placeholder="이메일을 입력해 주세요." @input="email_check()">
          <p class="alert_font" v-if="email_check_bool==1" style="color:red;">사용할 수 없는 이메일입니다.</p>
          <p class="alert_font" v-else-if="email_check_bool==2">사용 가능한 이메일입니다.</p>
          <p class="alert_font" v-else >&nbsp;</p>
    </div>
    <div class="pns">
        <label for="pnspns" class="s">투자성향</label>
       <select id="pnspns"  v-model="user_pns" >
            <!-- 투자 성향 옵션들 -->
                <option value="방어적인">방어적인</option>
                <option value="보통">보통</option>
                <option value="공격적인">공격적인</option>
            </select>
    </div>
    <div id="box3">
    <div>
         <input type="checkbox" name="agree" value="agreed" class="radi1" checked/>
        <label for="radi1">모두 동의합니다. [필수] 이용약관동의  [필수] 개인정보 수집 및 활용 동의
       </label>
    </div>
    <div class="signUp">
        <input type="submit" class="signUpButton" @click="onSubmitForm()" value="회원가입">
    </div>
    </div>
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
      user_name:'',  //이름
      user_pns:'방어적인',//투자성향
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
       checkAllAgreements() {
        // "모두 동의합니다." 라디오 버튼을 클릭하면 각 라디오 버튼을 정확히 선택
         document.getElementById('radi2').checked = true;
         document.getElementById('radi3').checked = true;
      
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
.pns{
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}
.pns select {
    float:right;
    width: 329px;
    line-height: 35px;
    font-size: 12px;
    padding-left: 10px;
    border: 2px solid rgb(112, 86, 246);
    border-radius: 10px;
}
.logo img {
    width: 144px;
    height: 60px;
    display: flex;
    margin-left: 86px;
}
.container {
  width: 1030px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}  
div {     
    padding-top: 6px;
}
#box1 .addressz input {
    float:right;
    width: 300px;
    line-height: 35px;
    font-size: 12px;
    color: white;
    border: 2px solid rgb(18, 108, 210);
    border-radius: 10px;
    margin-left: 30px;
    margin-top:10px;
}
.signUp input:hover {
    color:black;
    border: 2px solid rgb(71, 169, 255);
    background-color: rgb(39, 173, 240);
    border-radius: 10px;
    cursor: pointer;
}
#box1 input {
    margin-left: 10px;
    width:329px;
    line-height: 35px;
    font-size: 12px;
    padding-left: 10px;
    float: right;
    color: rgb(137, 137, 137);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 10px;
}
#box1 {
    width: 329px;
    height: 500px;
    float: left;
}
/* 버튼컨테이너 */
#box3 {
  margin-top: 30px;
  width: 329px;
  height: 150px;
  float: left;
}
.alert_font{
    font-size: 10px;
    margin-left: 180px;
}
input:focus {
    /* border: 2px solid #ffc905; */
    outline: 2px solid rgb(112, 86, 246);
}
.s {
    margin-left: 13px;
    font-size: 16px;
    font-weight:900; /* 더 굵게 설정 */
}
#box3 div input {
     font-size: 12px; /* 원하는 크기로 조절 */
     margin-right: 5px;/* 라디오 버튼과 라벨 사이의 간격을 조절 */
}

#box3 div label {
    font-size: 11px; /* 원하는 크기로 조절 */
    margin-left:20px; /* 라디오 버튼과 라벨 사이의 간격을 조절 */
    cursor: pointer; /* 마우스 커서를 포인터로 변경하여 사용자에게 상호작용 가능함을 나타냄 */
}
.singnupp{
    margin-top: 60px;
    margin-left: 110px;
}
.radi1{
    margin-top: 3px;
}

</style>