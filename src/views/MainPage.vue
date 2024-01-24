<template>
  <div>
    <table style="width: 100%;">
      <thead>
        <tr>
          <th>코드</th>
          <th>시작가</th>
          <th>최고가</th>
          <th>최저가</th>
          <th>거래가</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(stock, i) in stockList" :key="i">
          <td>
            <p>{{ stock.code }}</p>
          </td>
          <td>
            <p>{{ format(stock.opening_price) }}</p>
          </td>
          <td>
            <p>{{ format(stock.high_price) }}</p>
          </td>
          <td>
            <p>{{ format(stock.low_price) }}</p>
          </td>
          <td>
            <p style="color:red;">{{ format(stock.trade_price) }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'MainPage',
  data () {
    return {
      stockList: [],
      stockDataTime: null,
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: null
    }
  },
  created () {
    this.getStock()
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    async getStock () {
      this.stockDataTime = setInterval(async () => {
        try {
          const res = await axios.get('http://localhost:3000/stock/all_stock_info')
          this.stockList = res.data
        } catch (err) {
          console.log(err)
        }
        if(this.stockList.length === 0) return
        this.chartData = {
          labels: [
            '시작가', '최고가', '최저가', '거래가'
          ],
            datasets: [
            {
              label: this.stockList[0].code,
              backgroundColor: '#718bff', // 포인트 색상
              data: [this.stockList[0].opening_price, this.stockList[0].high_price, this.stockList[0].low_price, this.stockList[0].trade_price], // 데이터
              borderColor: '#1a48ff', // 선 색상
              hoverBorderColor: '#000000' // 마우스 hover 시 포인트 테두리 색상
            }
          ]
        }
        this.chartOptions = {
          responsive: false,
            maintainAspectRatio: false
        }
      }, 1000)
    },
    format (num) {
      return this.$currencyFormat(num)
    },
    gotoStock (code) {
      this.$router.push(`/stock/${code}`)
    }
  },
  unmounted () {
    clearInterval(this.stockDataTime)
  }
}
</script>
<style scoped>
p {
  text-align: center;
}
</style>
