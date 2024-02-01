<template>
  <v-sheet>
    <v-data-table-virtual
      fixed-header
      hide-default-footer
      :headers="headers"
      :items="mockai"
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
    </v-data-table-virtual>
  </v-sheet>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      headers: [
        { title: '유저', value: 'user', align:'center'},
        { title: '코인', value: 'coin', align:'center'},
        { title: '평단가', value: 'price', align:'center'},
        { title: '남은 수량', value: 'amount', align:'center'},
        { title: '총 금액', value: 'total_price', align:'center'},
        { title: '최초 매수일자', value: 'sale_date', align:'center'},
        { title: '최종 매도일자', value: 'sell_date', align:'center'}
      ],
      getmockai:[],
      mockai:[],
      search:'',
    };
  },
  computed:{
    user(){
      return this.$store.state.user
    }
  },
  created(){
    this.getMockai()
  },
  methods: {
    async getMockai() {
          try {
            const user_no=this.user.user_no;
            const response = await axios.get(`http://localhost:3000/admin/mypagemkall/${user_no}`);
            console.log(response.data)
            this.mockai = Object.entries(response.data)
            .map(([coin,info]) =>({
              user:info.id,
              coin:info.MOCK_NAME,
              search:info.id,
              price: this.$currencyFormat(info.MOCK_PRICE),
              amount:info.MOCK_AMOUNT,
              total_price: this.$currencyFormat(parseInt(info.MOCK_PRICE)*parseInt(info.MOCK_AMOUNT)),
              sale_date:this.$formatDateTime(info.SALE_MOCK_DATE),
              sell_date:!info.SELL_DATE?'매도한 날짜가 없습니다.':this.$formatDateTime(info.SELL_DATE)
            }))
          } catch (error) {
            console.error(error);
          }
        },
    },
};
</script>
<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: -10px; /* correct offset on first border spacing if desired */
}

th {
  border: none !important;
  box-shadow: none !important;
}

td {
  padding: 20px;
  height: 60px !important;
}

td:first-child {
  border-left-style: solid;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

td:last-child {
  border-right-style: solid;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
