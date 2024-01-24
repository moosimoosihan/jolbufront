<template>
  <div>
    <Line
      class="cospy-chart"
      :options="chartOptions"
      :data="chartData"
    />
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
          <p>{{ format(stock.trade_price) }}</p>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>
<script>
import axios from 'axios'
import { Chart, registerables } from 'chart.js'
import { Line } from 'vue-chartjs'
Chart.register(...registerables)

export default {
  name: 'MainPage',
  components: {
    Line
  },
  data () {
    return {
      stockList: [],
      stockDataTime: null,
      chartData: {
        labels: [
          '시작가', '최고가', '최저가', '거래가'
        ],
        datasets: [
          {
            label: '코스피',
            backgroundColor: '#718bff', // 포인트 색상
            data: [2000, 5000, 1900, 3000],
            borderColor: '#1a48ff', // 선 색상
            hoverBorderColor: '#000000' // 마우스 hover 시 포인트 테두리 색상
          }
        ]
      },
      chartOptions: {
        responsive: false,
        maintainAspectRatio: false
      }
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
      }, 1000)
    },
    format(num) {
      return this.$currencyFormat(num)
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
