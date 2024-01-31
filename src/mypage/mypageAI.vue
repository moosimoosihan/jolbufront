<template>
  <div id="app">
    <v-app id="inspire">
      <v-data-table
        class="elevation-1"
        fixed-header
        hide-default-footer
        show-select
        :headers="headers"
        :items="mockai"
      ></v-data-table>
    </v-app>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      headers: [
        { title: '코인', value: 'coin', align:'center'},
        { title: '구매가', value: 'price', align:'center'},
        { title: '현재가', value: 'close_price', align:'center'},
        { title: '수량', value: 'amount', align:'center'},
        { title: '총액', value: 'total_price', align:'center'},
        { title: '매수일자', value: 'sale_date', align:'center'},
        { title: '매도일자', value: 'sell_date', align:'center'}
      ],
      getmockai:[],
      mockai:[]
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
            const response = await axios.get(`http://localhost:3000/mypage/mypageai/${user_no}`);
            this.mockai = Object.entries(response.data)
            .map(([coin,info]) =>({
              coin:info.MOCK_NAME,
              price:info.MOCK_PRICE,
              close_price:info.CLOSE_PRICE,
              amount:info.MOCK_SELL_AMOUNT,
              total_price:parseInt(info.MOCK_PRICE)*parseInt(info.MOCK_SELL_AMOUNT),
              sale_date:Date(info.SALE_MOCK_DATE),
              sell_date:Date(info.SELL_DATE)

            }))
          } catch (error) {
            console.error(error);
            console.log(this.mockai);
          }
          console.log(this.mockai);
        },
    },
    mounted() {
    // 컴포넌트가 마운트될 때 자동으로 데이터를 가져오도록 설정
    this.getMockai();
  }

};
</script>
<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: -10px; /* correct offset on first border spacing if desired */
}

th {
  background-color: map-get (grey, "lighten-5") !important;
  border: none !important;
  box-shadow: none !important;
}

td {
  border: solid 1px transparent;
  border-style: solid none;
  padding: 20px;
  background-color: map-get (shades, "white");
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
