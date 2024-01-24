<template>
  <div>
<!--    <Line style="max-height: 200px; max-width: 500px"-->
<!--      class="cospy-chart"-->
<!--      :options="chartOptions"-->
<!--      :data="chartData"-->
<!--    />-->
  </div>
</template>
<script>
import axios from 'axios'
// import { Chart, registerables } from 'chart.js'
// import { Line } from 'vue-chartjs'
// Chart.register(...registerables)
// import io from 'socket.io-client'

export default {
  name: 'stock',
  // components: {
  //   Line
  // },
  data () {
    return {
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: null,
      // socket: io('http://localhost:3001')
    }
  },
  created () {
    this.getStock(12)
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
    async getStock (time) {
      let data = []
      try{
        const res = await axios.get(`http://localhost:3000/stock/stock_info/${this.$route.params.code}/${time}`)
        data = res.data
        console.log(data)
      } catch (err) {
        console.log(err)
      }
      // if(data.length === 0) return
      // this.chartData = {
      //   labels: [
      //     '시작가', '최고가', '최저가', '거래가'
      //   ],
      //   datasets: [
      //     {
      //       label: data[0].code,
      //       backgroundColor: '#718bff', // 포인트 색상
      //       data: [data[0].opening_price, data[0].high_price, data[0].low_price, data[0].trade_price], // 데이터
      //       borderColor: '#1a48ff', // 선 색상
      //       hoverBorderColor: '#000000' // 마우스 hover 시 포인트 테두리 색상
      //     }
      //   ]
      // }
      // this.chartOptions = {
      //   responsive: false,
      //   maintainAspectRatio: false
      // }
      // this.socket.timeout(5000).emit('stock', {
      //   user_no: this.user.user_no,
      //   code: this.$route.params.code
      // })
    }
  },
  unmounted () {
    // this.socket.off('stock')
    // this.socket.on('disconnect', () => {
    //   console.log('주식 연결 끊김')
    // })
  }
}
</script>
<style scoped>

</style>
