<template>
  <div>
    <ApexCharts
      class="chart"
      ref="candleChart"
      type="candlestick"
      height="350"
      width="500"
      :options="candleChartOptions"
      :series="candleChartSeries"
    />
    <p>{{ state }}</p>
    <p>코드명 : {{ $route.params.code }}</p>
    <p>최고가 : {{ $currencyFormat(data.max_price) }}</p>
    <p>최저가 : {{ $currencyFormat(data.min_price) }}</p>
    <p>시가 : {{ $currencyFormat(data.opening_price) }}</p>
    <p>현재가 : {{ $currencyFormat(data.closing_price) }}</p>
    <p>거래금액 : {{ $currencyFormat(data.acc_trade_value) }}</p>
  </div>
</template>
<script>
import axios from 'axios'
import ApexCharts from 'vue3-apexcharts'
// import io from 'socket.io-client'

export default {
  name: 'stock',
  components: {
    ApexCharts
  },
  data () {
    return {
      state: '',
      coinData: [],
      stockDataTime: null,
      // socket: io('http://localhost:3001')
      candleChartSeries:[],
      candleChartOptions: {
        candlestick: {
          colors: {
            upward: '#3C90EB',
            downward: '#DF7D46'
          }
        }
      },
      data: []
    }
  },
  created () {
    this.getStock()
    this.getStockCandle()
  },
  methods : {
    async getStock () {
      this.stockDataTime = setInterval(async () => {
        try {
          const res = await axios.get(`http://localhost:3000/stock/coin_info/${this.$route.params.code}`)
          this.state = res.data.status === '0000' ? '거래중' : '거래중지'
          this.data = res.data.data
        } catch (err) {
          console.log(err)
        }
        await this.getStockCandle()
      }, 1000)
    },
    async getStockCandle () {
      try {
        const res = await axios.get(`http://localhost:3000/stock/coin_info_candle/${this.$route.params.code}`)
        this.coinData = res.data.data.splice(res.data.data.length - 10, res.data.data.length)
      } catch (err) {
        console.log(err)
      }
      this.drawCandleChart()
    },
    drawCandleChart () {
      const cd = this.coinData
      var cdtemp=[];
      for (var i = 0; i < cd.length; i++) {
        cdtemp.push({
          x: this.$formatDateTime(cd[i][0]),
          y: [cd[i][1], cd[i][3], cd[i][4], cd[i][2]]
        })
      }
      this.candleChartSeries = [{
        data: cdtemp
      }]
    }
  },
  unmounted () {
    clearInterval(this.stockDataTime)
  }
}
</script>
<style scoped>

</style>
