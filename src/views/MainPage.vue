<template>
  <div>
    <button @click="getStock()">코인 받기</button>
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
          <p>{{ stock.opening_price }}</p>
        </td>
        <td>
          <p>{{ stock.high_price }}</p>
        </td>
        <td>
          <p>{{ stock.low_price }}</p>
        </td>
        <td>
          <p>{{ stock.trade_price }}</p>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>
<script>
import axios from "axios"
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
          '09'
        ],
        datasets: [
          {
            label: '시간별',
            backgroundColor: '#718bff', // 포인트 색상
            data: [0],
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
      try{
        const res = await axios.get('http://localhost:3000/stock/all_stock_info')
        this.stockList = res.data
      } catch (err) {
        console.log(err)
      }
    }
  },
}
</script>
<style scoped>

</style>
