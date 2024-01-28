<template>
  <div class="table-container">
    <v-main class="main">
      <div class="loading" v-if="loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-sheet min-height="90vh" rounded="lg">
              <h1>{{ candleCode }}</h1>
              <p>캔들 갯수</p>
              <select class="select" v-model="candleCount" @change="getStockCandle(candleCode, candleCount, candleTime)">
                <option value="10" selected>10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
              <select class="select" v-model="candleTime" @change="getStockCandle(candleCode, candleCount, candleTime)">
                <option value="24h" selected>일</option>
                <option value="12h">12시간</option>
                <option value="6h">6시간</option>
                <option value="1h">1시간</option>
                <option value="30m">30분</option>
                <option value="10m">10분</option>
                <option value="5m">5분</option>
                <option value="3m">3분</option>
                <option value="1m">1분</option>
              </select>
              <ApexCharts
                class="chart"
                ref="candleChart"
                type="candlestick"
                height="80%"
                width="100%"
                :options="candleChartOptions"
                :series="candleChartSeries"
              />
              <ApexCharts
                class="chart"
                ref="barChart"
                type="bar"
                height="20%"
                width="100%"
                :options="barChartOptions"
                :series="barChartSeries"
              />
            </v-sheet>
          </v-col>
          <v-col cols="6">
            <v-btn :variant="myStock? 'plain':'tonal'" width="50%" :color="myStock?'grey':'black'" @click="myStockToggle(false)">전체종목</v-btn>
            <v-btn :variant="myStock? 'tonal':'plain'" width="50%" :color="myStock?'black':'grey'" @click="myStockToggle(true)">찜한종목</v-btn>
            <p>정렬 방식</p>
            <select class="select" @change="sortTable()" v-model="sortValue">
              <option value="price">가격</option>
              <option value="coin">코인명</option>
              <option value="volume">거래량</option>
              <option value="changeRate">변동률</option>
            </select>
            <select class="select" @change="sortTable()" v-model="sortOrder">
              <option value="desc">내림차순</option>
              <option value="asc">오름차순</option>
            </select>
            <v-sheet rounded="lg">
              <v-data-table-virtual
                height="85vh"
                width="100%"
                :headers ="headers"
                :items="coinData"
                :hide-default-footer="true"
                class="coin-table-wrapper"
                :sort-by="sortBy"
                :search="searchKeyword"
                :no-data-text="myStock?'찜한 종목이 없습니다.':'종목이 없습니다.'"
                :custom-filter="filterOnlyCapsText"
              >
                <template v-slot:top>
                  <v-text-field v-model="searchKeyword" placeholder="종목명을 입력하세요" clearable hide-details></v-text-field>
                </template>
                <template v-slot:item="{ item }">
                  <tr class="coin_table" :class="item.changeRate==0?'rate_black': item.changeRate>0?'rate_red':'rate_blue'">
                    <td @click="getStockCandle(item.coin, candleCount, candleTime)">
                      {{ item.coin }}
                    </td>
                    <td @click="getStockCandle(item.coin, candleCount, candleTime)">
                      {{ $currencyFormat(item.price) }}
                    </td>
                    <td @click="getStockCandle(item.coin, candleCount, candleTime)">
                      {{ Math.floor(item.volume) }}
                    </td>
                    <td @click="getStockCandle(item.coin, candleCount, candleTime)">
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
        { title: '찜', value: 'like', align: 'center', sortable: false },
      ],
      sortBy: [{key: this.sortValue, order: this.sortOrder}],
      sortValue: 'price',
      sortOrder: 'desc',
      coinData: [],
      candleData: [],
      stockDataTime: null,
      stockDataTimeCandle: null,
      candleCount: 10,
      candleTime: '24h',
      candleCode: 'BTC',
      candleChartSeries:[],
      barChartSeries: [],
      candleChartOptions: {
        candlestick: {
          colors: {
            upward: '#3C90EB',
            downward: '#DF7D46'
          }
        }
      },
      barChartOptions: {
        bar: {
          colors: {
            ranges: [{
              color: '#3C90EB'
            }]
          }
        }
      },
      user_no: '',
      stock_name: '',
      stock_aicontent: '',

      likeList: [],

      searchKeyword: '',

      loading: false,

      myStock: false,

      lowPrice: '',
      highPrice: '',
    }
  },
  created () {
    this.getStock()
    this.getStockCandle(this.candleCode, this.candleCount, this.candleTime)
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
        this.$router.push('/login/')
        return;
      }
      try{
        const userNo = this.user.user_no; // 사용자 번호 (실제 값으로 대체)
        const response = await axios.post('http://localhost:3000/stock/delete_like', {
          user_no: userNo,
          stock_name: item,
        })
        if (response.data.success) {
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
        this.$router.push('/login/')
        return;
      }
      try{
        const userNo = this.user.user_no; // 사용자 번호 (실제 값으로 대체)
        const response = await axios.post('http://localhost:3000/stock/add_like', {
          user_no: userNo,
          stock_name: item,
        })
        if (response.data.success) {
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
    async getStock () {
      this.loading = true
      clearInterval(this.stockDataTime)
      this.coinData = []
      if(!this.myStock) {
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
      } else {
        if(this.user.user_no==='') {
          this.$swal('로그인이 필요합니다.', '', 'warning');
          this.myStock = false
          this.$router.push('/login')
          return;
        }
        this.stockDataTime = setInterval(async () => {
          try {
            const res = await axios.post('http://localhost:3000/stock/like_stock_info',{
              user_no: this.user.user_no
            })
            this.coinData = []
            for(let i=0; i<res.data.length; i++) {
              const data = Object.entries(res.data[i])
                .map(([coin, info]) => ({
                  coin,
                  price: info.closing_price,
                  volume: info.units_traded,
                  changeRate: info.fluctate_rate_24H
                }))
              this.coinData.push(data[0])
            }
          } catch (err) {
            console.log(err)
          }
        }, 1000)
      }
      this.loading = false
      await this.checkLike()
    },
    // 차트
    async getStockCandle (code,count,time) {
      this.loading = true
      this.candleCode = code
      this.candleCount = count
      this.candleTime = time
      try {
        const res = await axios.get(`http://localhost:3000/stock/coin_info_candle/${code}/${time}`)
        this.candleData = res.data.data.splice(res.data.data.length - count, res.data.data.length)
      } catch (err) {
        console.log(err)
      }
      this.drawChart()
    },
    drawChart () {
      const cd = this.candleData
      var cdtemp=[];
      var trade_amount=[];
      for (var i = 0; i < cd.length; i++) {
        cdtemp.push({
          x: this.$formatDateTime(cd[i][0],this.candleTime!=='24h'),
          y: [cd[i][1], cd[i][3], cd[i][4], cd[i][2]]
        })
        trade_amount.push({
          x: this.$formatDateTime(cd[i][0],this.candleTime!=='24h'),
          y: Math.floor(cd[i][5])
        })
      }
      this.candleChartSeries = [{
        name: '캔들',
        type: 'candlestick',
        data: cdtemp
      }]
        this.barChartSeries = [
      {
        name: '거래량',
        type: 'bar',
        data: trade_amount
      }]
      this.loading = false
    },
    myStockToggle (myBool) {
      if(myBool===this.myStock) {
        return;
      }
      this.myStock = myBool
      this.getStock()
    },
    sortTable () {
      this.sortBy = [{key: this.sortValue, order: this.sortOrder}]
    }
  },
  unmounted () {
    clearInterval(this.stockDataTime)
  }
}
</script>
<style scoped>
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
}
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
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
.select {
  width: 50%;
  height: 30px;
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
.main {
  padding: 0;
}
</style>
