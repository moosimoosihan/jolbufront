<template>
  <v-sheet>
    <v-data-table-virtual
    :headers="headers"
    :items="userList"
    height="100vh"
    width="20px"
    no-data-text="등록된 회원이 없습니다."
    :search="search"
    >
    <template v-slot:top>
      <v-text-field v-model="search" placeholder="검색할 아이디를 입력하세요."></v-text-field>
    </template>
    <template v-slot:item="{item}">
      <tr>
        <td>
          {{ item.user_no }}
        </td>
        <td>
          {{ item.id }}
        </td>
        <td>
          {{ item.name }}
        </td>
        <td>
          {{ item.email }}
        </td>
        <td>
          {{ $usersocial(item.social) }}
        </td>
        <td>
          {{ item.pns }}
        </td>
        <td>
          {{ $currencyFormat(item.simulatedamount) }}
        </td>
        <td>
          {{ $formatDateTime(item.sign_date,false) }}
        </td>
      </tr>
    </template>
    </v-data-table-virtual>
  </v-sheet>
</template>
<script>
import axios from 'axios';
export default {
  name: 'adminAuthPage',
  data(){
    return{
      userList: [],
      headers: [
        { title: '회원번호', value: 'user_no', align: 'center', class:'header'},
        { title: '회원아이디', value: 'id', align: 'center'},
        { title: '회원이름', value: 'name', align: 'center'},
        { title: '회원이메일', value: 'email', align: 'center'},
        { title: '가입경로', value: 'social', align: 'center'},
        { title: '투자성향', value: 'pns', align: 'center'},
        { title: '모의투자금액', value: 'simulatedamount', align: 'center'},
        { title: '가입일자', value: 'sign_date', align: 'center'},
      ],
      search: ''
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  created() {
    this.getmylikeinfo()
  },
  methods: {
    async getmylikeinfo(){
            if(this.user.user_no==='') {
            this.$swal('로그인이 필요합니다.', '', 'warning')
            this.myStock = false
            this.$router.push('/login')
            return
            }
              try {
                  const res = await axios.get('http://localhost:3000/admin/get_alluser')
                  this.userList = res.data
                  console.log(this.userList)
                  
              } catch (err) {
                  console.log(err)
              }
        }
  }
}
</script>
<style scoped>

tr{
  text-align: center;
}

</style>
