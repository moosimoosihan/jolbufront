<template>
  <div class="table-container">
    <v-main>
      <div class="loading" v-if="loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <v-container>
        <v-row>
          <v-col cols="7">
            <v-sheet
              min-height="85vh"
              rounded="lg"
            >
              <p>{{ candleCode }}</p>
              <select class="candle_count" v-model="candleCount" @change="getStockCandle(candleCode, candleCount)">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
              <ApexCharts
                class="chart"
                ref="candleChart"
                type="candlestick"
                height="100%"
                width="100%"
                :options="candleChartOptions"
                :series="candleChartSeries"
              />
            </v-sheet>
          </v-col>
          <v-col cols="5">
            <v-row class="ml-5">
              <v-text-field class="mt-6 ml-5" v-model="searchKeyword" clearable @input="getListStock(searchKeyword)" ></v-text-field>
            </v-row>
            <v-sheet rounded="lg">
              <v-data-table-virtual
                height="800"
                width="100%"
                :headers ="headers"
                :items="coinData"
                :hide-default-footer="true"
                class="coin-table-wrapper">
                <template v-slot:item="{ item }">
                  <tr class="coin_table">
                    <td @click="getStockCandle(item.coin, candleCount)">
                      {{ item.coin }}
                    </td>
                    <td @click="getStockCandle(item.coin, candleCount)" class="animation_table" :class="item.changeRate===0?'rate_black': item.changeRate>0?'rate_red':'rate_blue'">
                      {{ $currencyFormat(item.price) }}
                    </td>
                    <td @click="getStockCandle(item.coin, candleCount)">
                      {{ item.volume }}
                    </td>
                    <td @click="getStockCandle(item.coin, candleCount)" :class="item.changeRate===0?'rate_black': item.changeRate>0?'rate_red':'rate_blue'">
                      {{ item.changeRate }}
                    </td>
                    <td>
                      <v-icon v-if="!likeList.includes(item.coin)" color="success" icon="mdi-plus" size="x-small" @click="addToLike(item.coin)">
                      </v-icon>
                      <v-icon v-else color="success" icon="mdi-minus" size="x-small" @click="deleteToLike(item.coin)">
                      </v-icon>
                    </td>
                  </tr>
                </template>
              </v-data-table-virtual>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios'
import ApexCharts from 'vue3-apexcharts'

export default {
  name: 'MainPage',
  components: { ApexCharts },
  data () {
    return {
      headers: [
        { title: '코인', value: 'coin', align: 'center' },
        { title: '가격', value: 'price', align: 'center' },
        { title: '거래량', value: 'volume', align: 'center' },
        { title: '변동률', value: 'changeRate', align: 'center' },
        { title: '찜', value: 'like', align: 'center' },
      ],
      coinData: [],
      candleData: [],
      stockDataTime: null,
      stockDataTimeCandle: null,
      candleCount: 10,
      candleCode: 'BTC',
      candleChartSeries:[],
      candleChartOptions: {
        candlestick: {
          colors: {
            upward: '#3C90EB',
            downward: '#DF7D46'
          }
        }
      },
      user_no: '',
      stock_name: '',
      stock_aicontent: '',

      likeList: [],

      searchKeyword: '종목명을 입력하세요',

      loading: false,
    }
  },
  created () {
    this.getStock()
    this.getStockCandle(this.candleCode, this.candleCount)
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    async deleteToLike(item) {
      if(this.user.user_no==='') {
        this.$swal('로그인이 필요합니다.', '', 'warning');
        return;
      }
      try{
        const userNo = this.user.user_no; // 사용자 번호 (실제 값으로 대체)
        const stockName = item; // 종목명
        const response = await axios.post('http://localhost:3000/stock/delete_like', {
          user_no: userNo,
          stock_name: stockName,
        })
        if (response.data.success) {
          this.$swal('찜하기 삭제 성공', '', 'success');
          await this.checkLike()
        } else {
          console.log('찜하기 삭제 실패');
        }
      } catch(error) {
        console.error('찜하기 삭제 중에 오류가 발생했습니다.', error);
      }
    },
    async addToLike(item) {
      if(this.user.user_no==='') {
        this.$swal('로그인이 필요합니다.', '', 'warning');
        return;
      }
      try{
        const userNo = this.user.user_no; // 사용자 번호 (실제 값으로 대체)
        const stockName = item; // 종목명
        const response = await axios.post('http://localhost:3000/stock/add_like', {
          user_no: userNo,
          stock_name: stockName,
        })
        if (response.data.success) {
          this.$swal('찜하기 성공', '', 'success');
          await this.checkLike()
        } else {
          console.log('찜하기 실패');
        }
      } catch(error) {
        console.error('찜하기 중에 오류가 발생했습니다.', error);
      }
    },
    async checkLike() {
      if(this.user.user_no==='') {
        return false;
      }
      try{
        const userNo = this.user.user_no; // 사용자 번호 (실제 값으로 대체)
        const response = await axios.post('http://localhost:3000/stock/check_like', {
          user_no: userNo,
        })
        if(response.data.success){
          // json 형태로 받아온 데이터를 배열로 변환
          this.likeList= []
          for(var i=0; i<response.data.result.length; i++){
            this.likeList.push(response.data.result[i].STOCK_NAME)
          }
        } else {
          this.likeList = []
        }
      } catch (error) {
        console.error('찜하기 불러오기 오류가 발생했습니다.', error);
      }
    },
    async getListStock(code) {
      // 영어가 아니라면 검색하지 않음
      if(!/^[a-zA-Z]*$/.test(code)) {
        return;
      }
      if(code==='종목명을 입력하세요') {
        return;
      }
      if(code==='') {
        await this.getStock()
        return;
      }
      this.loading = true
      clearInterval(this.stockDataTime)
      this.coinData = []
      this.stockDataTime = setInterval(async () => {
        try{
          const res = await axios.post('http://localhost:3000/stock/coin_info',{
            code: code
          })
          this.coinData = Object.entries(res.data)
            .map(([coin, info]) => ({
              coin,
              price: info.closing_price,
              volume: info.units_traded,
              changeRate: info.fluctate_rate_24H
            }))
        } catch (err) {
          console.log(err)
        }
      }, 1000)
      this.loading = false
    },
    async getStock () {
      this.loading = true
      clearInterval(this.stockDataTime)
      this.coinData = []
      this.stockDataTime = setInterval(async () => {
        try {
          const res = await axios.get('http://localhost:3000/stock/all_coin_info')
          this.coinData = Object.entries(res.data.data)
            .map(([coin, info]) => ({
              coin,
              price: info.closing_price,
              volume: info.units_traded,
              changeRate: info.fluctate_rate_24H
            }))
          this.coinData.pop()
        } catch (err) {
          console.log(err)
        }
      }, 1000)
      this.loading = false
      await this.checkLike()
    },
    // 차트
    async getStockCandle (code,count) {
      this.loading = true
      this.candleCode = code
      this.candleCount = count
      try {
        const res = await axios.get(`http://localhost:3000/stock/coin_info_candle/${code}`)
        this.candleData = res.data.data.splice(res.data.data.length - count, res.data.data.length)
      } catch (err) {
        console.log(err)
      }
      this.drawCandleChart()
    },
    drawCandleChart () {
      const cd = this.candleData
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
      this.loading = false
    },
  },
  unmounted () {
    clearInterval(this.stockDataTime)
  }
}
</script>
<style scoped>
.animation_table {
  transition: all 0.5s;
}
.coin_table thead th {
  white-space: nowrap;
}

.coin_table tbody th,
.coin_table tbody td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.coin-table-wrapper {
  /* 원하는 크기로 조정하세요 */
  min-height: 300px;
  min-width: 550px;
}
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 화면 전체 높이에 맞춤 */
}
.coin_table {
  text-align: center;
  width: 100%;
  table-layout: fixed;
}
.rate_black{
  color: black;
}
.rate_red{
  color: red;
}
.rate_blue{
  color: blue;
}
.candle_count {
  width: 100%;
  height: 30px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  font-size: 15px;
  font-weight: bold;
  color: #666;
  background-color: #fff;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
