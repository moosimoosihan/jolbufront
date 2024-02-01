<template>
  <v-sheet>
    <v-row>
      <v-col class="name">
        <span class="s">이름</span>
        <v-text-field
          id="name"
          type="text"
          v-model="user_name"
          :placeholder="UserInfo.NAME"
        />
        <p class="alert_font">&nbsp;</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="email">
        <span class="s">이메일</span>
        <v-text-field id="email" type="text" v-model="UserInfo.EMAIL" :placeholder="UserInfo.EMAIL" @input="email_check()"/>
        <p class="alert_font" v-if="email_check_bool === 1" style="color: red">사용할 수 없는 이메일입니다.</p>
        <p class="alert_font" v-else-if="email_check_bool === 2">사용 가능한 이메일입니다.</p>
        <p class="alert_font" v-else>&nbsp;</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class="pns">투자성향</p>
        <v-select
          v-model="user_pns"
          :items="['방어적인', '보통', '공격적인']"
          class="my-select"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-btn class="ma-2" color="blue" @click="onSubmitForm">
          수정하기
          <v-icon end icon="mdi-pencil"></v-icon>
        </v-btn>
          <v-btn class="ma-2" color="blue" @click="gotoChangePw()">
          비밀번호변경
          <v-icon end icon="mdi-wrench"></v-icon>
        </v-btn>
        <v-btn class="ma-2" @click="userDelete"
          >회원탈퇴
          <v-icon end icon="mdi-cancel"></v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      UserInfo: {},
      id_check_bool: 0,
      email_check_bool: 0,
      user_pw: "", //비밀번호
      user_npw: "",
      user_pw_ck: "", //비밀번호 확인
      isDelete: true,

      user_name: "",
      user_email: "",
      user_pns: "",
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    gotoChangePw(){
      this.$router.push({ path: '/mypage/password' });
    },
    //유저정보
    async getUserInfo() {
      try {
        const user_no = this.user.user_no;
        const response = await axios.get(
          `http://localhost:3000/mypage/mypage/${user_no}`
        );
        this.UserInfo = response.data[0];
        this.user_pns = this.UserInfo.PNS;
      } catch (error) {
        console.error(error);
      }
    },
    // 수정하기
    onSubmitForm() {
      if (
        this.user_email === "" &&
        this.user_name === "" &&
        this.user_pns === this.UserInfo.PNS
      ) {
        return this.$swal("바꿀 내용을 입력해주세요.");
      }
      if (this.user_name === "" && this.user_email !== "") {
        this.user_name = this.UserInfo.NAME;
      }
      if (this.user_email === "" && this.user_name !== "") {
        this.user_email = this.UserInfo.EMAIL;
      }
      axios({
        url: "http://localhost:3000/mypage/mypageupdate",
        method: "POST",
        data: {
          NAME: this.user_name,
          EMAIL: this.user_email,
          PNS: this.user_pns,

          USER_NO: this.user.user_no,
        },
      })
        .then((res) => {
          if (res.data.message === "Update successful") {
            this.$swal
              .fire({
                title: "수정되었습니다.",
                showConfirmButton: false,
                timer: 1000,
              })
              .then(() => {
                window.location.href = "http://localhost:8080/mypage/";
              });
          }
        })
        .catch((err) => {
          console.log("수정 요청 중 오류가 발생했습니다.", err);
          this.$swal("수정에 실패했습니다.");
        });
    },
    // 회원탈퇴
    async userDelete() {
      this.$swal
        .fire({
          title: "정말 탈퇴하시겠습니까?",
          showCancelButton: true,
          confirmButtonText: `탈퇴`,
          cancelButtonText: `취소`,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            if (this.UserInfo.length == 0) {
              this.$swal("데이터가 존재하지 않습니다.");
              return;
            }
            try {
              const response = await axios.post(
                `http://localhost:3000/mypageUser/${user_no}`
              );
              if (response.data.message === "delete_success") {
                this.$swal("한 달 뒤 탈퇴됩니다.");
                if (this.UserInfo.social == 1) {
                  window.Kakao.Auth.logout();
                }
                this.$store.commit("user", { user_no: "", user_id: "" });
                this.$router.push({ path: "/" });
              } else {
                this.$swal("탈퇴에 실패했습니다.");
              }
            } catch (error) {
              console.error(error);
            }
          }
        });
    },
    id_check() {
      if (this.user_id == "") {
        this.id_check_bool = 0;
        return;
      }
      // 아이디에 특수문자, 공백, 한글 입력 불가
      this.user_id = this.user_id.replace(/[^a-z0-9]/gi, "");
      axios({
        url: "http://localhost:3000/auth/id_check",
        method: "POST",
        data: {
          user_id: this.user_id,
        },
      })
        .then((res) => {
          console.log(res.data.message);
          if (res.data.message == "already_exist_id") {
            this.id_check_bool = 1;
            return;
          } else if (res.data.message == "DB_error") {
            this.id_check_bool = 2;
            return;
          } else {
            this.id_check_bool = 3;
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //이메일 유효성 검사
    id_check() {
      if (this.user_id == "") {
        this.id_check_bool = 0;
        return;
      }
      // 아이디에 특수문자, 공백, 한글 입력 불가
      this.user_id = this.user_id.replace(/[^a-z0-9]/gi, "");
      axios({
        url: "http://localhost:3000/auth/id_check",
        method: "POST",
        data: {
          user_id: this.user_id,
        },
      })
        .then((res) => {
          console.log(res.data.message);
          if (res.data.message == "already_exist_id") {
            this.id_check_bool = 1;
            return;
          } else if (res.data.message == "DB_error") {
            this.id_check_bool = 2;
            return;
          } else {
            this.id_check_bool = 3;
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    email_check() {
      if (this.user_email == "") {
        this.email_check_bool = 0;
        return;
      }
      // 이메일에  @와 .을 제외한 특수문자, 공백, 한글 입력 불가
      this.user_email = this.user_email.replace(/[^a-z0-9@.]/gi, "");
      // 이메일이 영어@영어.영어 가 아닌 경우
      if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(this.user_email)) {
        this.email_check_bool = 1;
        return;
      }
      this.email_check_bool = 2;
    },
    // 회원탈퇴
    async userDelete() {
        const user_no = this.user.user_no; // 추가된 코드

        this.$swal.fire({
            title: "정말 탈퇴하시겠습니까?",
            showCancelButton: true,
            confirmButtonText: `탈퇴`,
            cancelButtonText: `취소`,
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                if (this.UserInfo.length == 0) {
                    this.$swal("데이터가 존재하지 않습니다.");
                    return;
                }
                try {
                    const response = await axios.delete(`http://localhost:3000/mypage/mypageUser/${user_no}`);
                if (response.data.message === "회원탈퇴성공") {
                  this.$swal("탈퇴 되었습니다.");
                  if (this.UserInfo.social == 1) {
                    window.Kakao.Auth.logout();
                  }
                  this.$store.commit("user", { user_no: "", user_id: "" });
                  this.$router.push({ path: "/" });
                } else {
                  this.$swal("탈퇴에 실패했습니다.");
                }
              } catch (error) {
                console.error(error);
              }
            }
        });
      }
    }
}
</script>
<style scoped>

</style>
