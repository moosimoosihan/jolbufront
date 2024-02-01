<template>
    <v-app id="inspire">
    <v-main>
        <v-container class="login-form text-center">
            <v-text-field v-model="user_pw" :type="showPassword ? 'text' : 'password'" label="기존 비밀번호" prepend-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword"></v-text-field>
            <v-text-field v-model="user_npw" :type="showPassword ? 'text' : 'password'" label="새 비밀번호" prepend-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"  @click:append="showPassword = !showPassword" ></v-text-field>
            <v-text-field v-model="user_pw_ck" :type="showPassword ? 'text' : 'password'" label="비밀번호 확인" prepend-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" ></v-text-field>
            <v-btn color="primary" class="mt-5" @click="onSubmitForm">비밀번호 변경</v-btn>
            <p v-if="user_npw.length<6 && user_npw.length>0" class="error">비밀번호는 6자리 이상입니다.</p>
            <p v-else-if="user_npw!=user_pw_ck" class="error">비밀번호가 다릅니다.</p>
        </v-container>
    </v-main>
    </v-app>
</template>
<script> 
    import axios from 'axios';
    export default {
        name: 'password',
        data() {
            return {
                 
                showPassword: false,
                user_id: '',
                user_pw: '',          
                user_npw: '',       
                user_pw_ck: '',    
                user_no: ''       
            };
        },
        methods: {
            // 비밀번호 변경
            onSubmitForm() {
                if (this.user_pw === "" || this.user_npw === "" || this.user_pw_ck === "") {
                    this.$swal("모든 항목을 입력해주세요");
                    return
                }
                if (this.user_npw !== this.user_pw_ck) {
                    this.$swal("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                    return
                }
                if(this.user_npw.length < 6){
                    this.$swal("비밀번호는 6자리 이상입니다.");
                    return
                }
               console.log('Request data:', this.user.user_no, this.user_pw, this.user_npw, this.user_pw_ck);

        axios.post('http://localhost:3000/mypage/pass_process', {
            user_no: this.user.user_no,
            user_pw: this.user_pw,
            user_npw: this.user_npw,
            user_pw_ck: this.user_pw_ck
        })
       .then((res) => {
       console.log("response data:", res.data);
                    if (res.data.message === 'pass_update') {
                        this.$swal("수정이 완료되었습니다");
                        this.$router.push({ path: '/mypage' });
                    } else if (res.data.message === 'pw_ck') {
                        this.$swal("비밀번호가 틀립니다.");
                    } else {
                        this.$swal("알 수 없는 오류가 발생했습니다.");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.$swal("수정에 실패했습니다.");
                });
            },
        },
        computed: {
            user() {
                return this.$store.state.user;
            }
        },
    };
</script>
