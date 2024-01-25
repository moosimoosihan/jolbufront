<template>
  <div>
    <Bar style="max-height: 200px; max-width: 500px"
      class="cospy-chart"
      :options="chartOptions"
      :data="chartData"
    />
    <p>코드명 : {{ data.code }}</p>
    <p>최고가 : {{ data.high_price }}</p>
    <p>최저가 : {{ data.low_price }}</p>
    <p>시가 : {{ data.opening_price }}</p>
    <p>거래가 : {{ data.trade_price }}</p>
  </div>
</template>
<script>
import axios from 'axios'
import { Chart, registerables } from 'chart.js'
import { Bar } from 'vue-chartjs'
Chart.register(...registerables)
// import io from 'socket.io-client'

export default {
  name: 'stock',
  components: {
    Bar
  },
  data () {
    return {
      data: {},
      stockDataTime: null,
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: null,
      // socket: io('http://localhost:3001')
    }
  },
  created () {
    this.getStock()
    // this.socket.on('connect', () => {
    //   console.log('주식 연결됨')
    // })
    // this.socket.on('stock', async (data) => {
    //   if(data.user_no === this.user.user_no) {
    //     console.log('유저 번호 일치')
    //     console.log(data)
    //   }
    // })
  },
  methods : {
    async getStock () {
      this.stockDataTime = setInterval(async () =>{
        try{
          const res = await axios.get(`http://localhost:3000/stock/stock_info/${this.$route.params.code}`)
          this.data = res.data[0]
          if(this.data.length<=0) return
          this.chartData = {
            labels: [
              '거래가'
            ],
            datasets: [
              {
                label: this.data.code,
                backgroundColor: '#718bff', // 포인트 색상
                data: [this.data.trade_price], // 데이터
                borderColor: '#1a48ff', // 선 색상
                hoverBorderColor: '#000000' // 마우스 hover 시 포인트 테두리 색상
              }
            ]
          }
          this.chartOptions = {
            responsive: false,
            maintainAspectRatio: false
          }
        } catch (err) {
          console.log(err)
        }
      }, 1000)
      /* this.socket.timeout(5000).emit('stock', {
        user_no: this.user.user_no,
        code: this.$route.params.code
      }) */
    }
  },
  unmounted () {
    // this.socket.off('stock')
    // this.socket.on('disconnect', () => {
    //   console.log('주식 연결 끊김')
    // })
    clearInterval(this.stockDataTime)
  }
}
</script>
<style scoped>

</style>
