<template>
  <v-sheet>
    <v-data-table-virtual
    :headers="headers"
    :items="userList"
    no-data-text="등록된 회원이 없습니다."
    :search="search"
    >
    <template v-slot:top>
      <v-card-title class="d-flex align-center pe-2">
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        label="Search"
        single-line
        flat
        hide-details
        variant="solo-filled"
      ></v-text-field>
    </v-card-title>
    </template>
    <template v-slot:bottom>
        <div class="text-center pt-2">
          <v-pagination 
          v-model="page" 
          :length="pageCount"
          ></v-pagination>
        </div>
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
        { title: '회원번호', value: 'user_no', align: 'center'},
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
th{
  background-color: #f5f5f5;
}
tr{
  text-align: center;
}

</style>
