<template>
  <div class="table-container">
    <v-main class="main">
      <div class="loading" v-if="loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-sheet min-height="40vh" rounded="lg">
              <v-col cols="12">
                <v-row>
                  <v-card variant="flat" class="mx-auto" color="white" max-width="344">
                    <v-card-title :class="selectRate==0?'rate_black': selectRate>0?'rate_red':'rate_blue'">
                      <h2>{{ candleCode }}</h2>
                      <h3>{{ $currencyFormat(selectPrice) }}</h3>
                      <span :class="selectRate>0?'positive':'negative'">
                      {{ selectRate > 0 ? '+' : '' }}{{ selectRate }}%
                      </span>
                      <span>{{ $currencyFormat(selectAmount) }}</span>
                    </v-card-title>
                    <p>캔들 갯수</p>
                  </v-card>
                  <v-col>
                    <v-card-title>
                      <strong class="float-lg-right" style="color:#f75467">최고가 : {{ $currencyFormat(selectHighPrice) }}</strong>
                    </v-card-title>
                    <v-card-title>
                      <strong class="float-lg-right" style="color:#2b6fe5">최저가 : {{ $currencyFormat(selectLowPrice) }}</strong>
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-col>
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
            <v-col>
              <v-col class="mock">
                <strong class="mock title">모의투자</strong>
                <p class="mock-asset">현재 자산 : {{ $currencyFormat(simulatedAmount) }}</p>
              </v-col>
              <v-row>
                <v-text-field width="50%" hide-details readonly>{{ $currencyFormat(selectPrice * (buy_mock_amount!==''?buy_mock_amount:1)) }}</v-text-field>
                <v-text-field width="50%" v-model="buy_mock_amount" type="number" placeholder="매수 수량" hide-details></v-text-field>
                <v-col class="no-padding">
                  <v-btn class="rate_red" @click="mock(false)"  style="height: 40px;">매수</v-btn>
                  </v-col>
                  <v-col class="no-padding">
                  <v-btn class="mb-3" @click="full_mock()"  style="height: 40px;">최대</v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-text-field width="50%" hide-details readonly>{{ $currencyFormat(selectPrice * (sell_mock_amount!==''?sell_mock_amount:1)) }}</v-text-field>
                <v-text-field width="50%" v-model="sell_mock_amount" type="number" placeholder="매도 수량" hide-details></v-text-field>
                <v-col class="no-padding">
                  <v-btn class="rate_blue" @click="mock(true)" style="height: 40px;">매도</v-btn>
                  </v-col>
                  <v-col class="no-padding">
                  <v-btn class="mb-3" @click="getSaleStock()"  style="height: 40px;">최대</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-col>

          <v-col cols="6">
            <v-btn :variant="myStock ? 'text' : saleStock ? 'text' : 'tonal'" width="34%" :color="myStock ? 'grey' : saleStock ? 'grey' : '#2b6fe5'" @click="myStockToggle(false)" class="click">전체종목</v-btn>
            <v-btn :variant="myStock ? 'tonal' : saleStock ? 'text' : 'text'" width="33%" :color="myStock ? '#2b6fe5' : saleStock ? 'grey' : 'grey'" @click="myStockToggle(true)" class="click">찜한종목</v-btn>
            <v-btn :variant="myStock?'text':saleStock?'tonal':'text'" width="33%" :color="myStock?'grey':saleStock?'#2b6fe5':'grey'" @click="saleStockToggle()" class="click">모의투자</v-btn>
            <select v-if="!saleStock" class="select" @change="sortTable()" v-model="sortValue">
              <option value="price">가격</option>
              <option value="coin">코인명</option>
              <option value="volume">거래량</option>
              <option value="changeRate">변동률</option>
            </select>
            <select v-else class="select" @change="sortTable()" v-model="sortValue">
              <option value="price">가격</option>
              <option value="coin">코인명</option>
              <option value="amount">수량</option>
              <option value="total_price">총 금액</option>
              <option value="rate">변동량</option>
            </select>
            <select class="select" @change="sortTable()" v-model="sortOrder">
              <option value="desc">내림차순</option>
              <option value="asc">오름차순</option>
            </select>
            <v-sheet rounded="lg">
              <v-data-table-virtual
                v-if="!saleStock"
                height="80vh"
                width="100%"
                :headers ="headers"
                :items="coinData"
                :hide-default-footer="true"
                class="coin-table-wrapper"
                :sort-by="sortBy"
                :search="searchKeyword"
                :no-data-text="myStock?'찜한 종목이 없습니다.':'종목이 없습니다.'"
              >
                <template v-slot:top>
                  <v-toolbar class="px-2">
                    <v-text-field
                      v-model="searchKeyword"
                      clearable
                      density="comfortable"
                      hide-details
                      placeholder="Search"
                      prepend-inner-icon="mdi-magnify"
                      variant="solo"
                    />
                  </v-toolbar>
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
                      <p>{{item.changePrice>0?'+':''}}{{ $currencyFormat(item.changePrice) }}</p>
                      <p>{{ item.changeRate }}%</p>
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
              <v-data-table-virtual
                v-else
                height="80vh"
                width="100%"
                :headers ="headers2"
                :items="coinData"
                :hide-default-footer="true"
                class="coin-table-wrapper"
                :sort-by="sortBy"
                :search="searchKeyword"
                no-data-text="매수 및 매도할 종목이 없습니다."
              >
                <template v-slot:top>
                  <v-toolbar class="px-2">
                    <v-text-field
                      v-model="searchKeyword"
                      clearable
                      density="comfortable"
                      hide-details
                      placeholder="Search"
                      prepend-inner-icon="mdi-magnify"
                      variant="solo"
                    />
                  </v-toolbar>
                </template>
                <template v-slot:item="{ item }">
                  <tr class="coin_table" :class="item.rate==0?'rate_black': item.rate>0?'rate_red':'rate_blue'">
                    <td @click="getStockCandle(item.coin, candleCount, candleTime)">
                      {{ item.coin }}
                    </td>
                    <td @click="getStockCandle(item.coin, candleCount, candleTime)">
                      {{ $currencyFormat(item.price) }}
                    </td>
                    <td @click="getStockCandle(item.coin, candleCount, candleTime)">
                      {{ $currencyFormat(item.closing_price) }}
                    </td>
                    <td @click="getStockCandle(item.coin, candleCount, candleTime)">
                      {{ Math.floor(item.amount) }}
                    </td>
                    <td @click="getStockCandle(item.coin, candleCount, candleTime)">
                      <p>{{ $currencyFormat(item.total_price) }}</p>
                    </td>
                    <td @click="getStockCandle(item.coin, candleCount, candleTime)">
                      <p>{{ item.rate_price>0?'+':''}}{{ $currencyFormat(item.rate_price) }}</p>
                      <p>{{ item.rate>0?'+':'' }}{{ item.rate }}%</p>
                    </td>
                  </tr>
                </template>
                <template v-slot:bottom>
                  <v-row :class="(parseInt(coinData.reduce((acc, cur) => acc + cur.rate_price, 0)))>0?'rate_red':(parseInt(coinData.reduce((acc, cur) => acc + cur.rate_price, 0)))<0?'rate_blue':'rate_black'">
                    <v-col>
                      <p>수익금 : {{ coinData.reduce((acc, cur) => acc + cur.rate_price, 0)>0?'+':'' }}{{ $currencyFormat(coinData.reduce((acc, cur) => acc + cur.rate_price, 0)) }}</p>
                    </v-col>
                    <v-col>
                      <p>수익률 : {{ coinData.reduce((acc, cur) => acc + cur.rate_price, 0)>0?'+':'' }}{{ (coinData.reduce((acc, cur) => acc + cur.rate_price, 0) / coinData.reduce((acc, cur) => acc + cur.total_price, 0) * 100).toFixed(2) }}%</p>
                    </v-col>
                    <v-col>
                      <p>구매 금액 : {{ $currencyFormat(coinData.reduce((acc, cur) => acc + cur.total_price, 0)) }}</p>
                    </v-col>
                    <v-col>
                      <p>현재 금액 : {{ $currencyFormat(coinData.reduce((acc, cur) => acc + cur.closing_price * cur.amount, 0).toFixed(0)) }}</p>
                    </v-col>
                  </v-row>
                </template>
              </v-data-table-virtual>
            </v-sheet>
            <v-col>
              <v-card>
                <v-card-title>
                  <strong>AI 추천 종목</strong>
                </v-card-title>
                <v-card-text>
                  <v-btn @click="getAiStock()">AI 종목 추천</v-btn>
                  <v-text-field v-model="stock_aicontent" readonly hide-details placeholder="AI 종목 추천"></v-text-field>
                </v-card-text>
              </v-card>
            </v-col>
            <rateRank />
            <chat />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios'
import ApexCharts from 'vue3-apexcharts'
import chat from '/src/views/chat.vue'

export default {
  name: 'MainPage',
  components: { ApexCharts, chat },
  data () {
    return {
      headers: [
        { title: '코인', value: 'coin', align: 'center' },
        { title: '가격', value: 'price', align: 'center' },
        { title: '거래량', value: 'volume', align: 'center' },
        { title: '변동률', value: 'changeRate', align: 'center' },
        { title: '찜', value: 'like', align: 'center', sortable: false },
      ],
      headers2: [
        { title: '코인', value: 'coin', align:'center'},
        { title: '구매가', value: 'price', align:'center'},
        { title: '현재가', value: 'close_price', align:'center'},
        { title: '수량', value: 'amount', align:'center'},
        { title: '총액', value: 'total_price', align:'center'},
        { title: '변동률', value: 'rate', align:'center'}
      ],
      sortBy: [{key: this.sortValue, order: this.sortOrder}],
      sortValue: 'price',
      sortOrder: 'desc',
      coinData: [],
      candleData: [],
      stockDataTime: null,
      stockDataTimeCandle: null,

      // 현재 선택된 종목
      selectPrice: '',
      selectAmount: '',
      selectRate: '',
      selectHighPrice: '',
      selectLowPrice: '',

      // 모의 투자
      simulatedAmount: '100000000',
      buy_mock_amount: '',
      sell_mock_amount: '',

      // 차트
      candleCount: 10,
      candleTime: '24h',
      candleCode: '',
      curCandleCode: '',
      candleChartSeries:[{
        name: '캔들',
        type: 'candlestick',
        data: []
      }],
      barChartSeries: [{
        name: '거래량',
        type: 'bar',
        data: []
      }],
      candleChartOptions: {
        chart: {
          id: 'candleChart',
          type: 'candlestick',
          toolbar: {
            show: false,
            tools: {
              download: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
              customIcons: []
            },
          },
          animations: {
            enabled: false
          },
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: '#f75467', // 업일 때 빨강
              downward: '#2b6fe5' //다운일 때 파랑
            }
          }
        },
        tooltip: {
          enabled: false
        },
      },
      barChartOptions: {
        chart:{
          id: 'barChart',
          type: 'bar',
          toolbar: {
            show: false,
            tools: {
              download: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
              customIcons: []
            },
          },
          animations: {
            enabled: false
          },
        },
        colors: ['#ff9e2b'],
        plotOptions: {
          bar: {
            columnWidth: '50%',
          }
        },
        tooltip: {
          enabled: false
        }
      },
      user_no: '',
      stock_name: '',
      stock_aicontent: '',

      likeList: [],

      searchKeyword: '',

      loading: false,

      myStock: false,
      saleStock: false,
    }
  },
  created () {
    this.getStock()
    this.getStockCandle('BTC', this.candleCount, this.candleTime)
    this.getSimulatedAmount()
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    async deleteToLike(item) {
      if(this.user.user_no==='') {
        this.$swal('로그인이 필요합니다.', '', 'warning')
        this.$router.push('/login/')
        return
      }
      try{
        const userNo = this.user.user_no // 사용자 번호 (실제 값으로 대체)
        const response = await axios.post('http://localhost:3000/stock/delete_like', {
          user_no: userNo,
          stock_name: item,
        })
        if (response.data.success) {
          await this.checkLike()
        } else {
          console.log('찜하기 삭제 실패')
        }
      } catch(error) {
        console.error('찜하기 삭제 중에 오류가 발생했습니다.', error)
      }
    },
    async addToLike(item) {
      if(this.user.user_no==='') {
        this.$swal('로그인이 필요합니다.', '', 'warning')
        this.$router.push('/login/')
        return
      }
      try{
        const userNo = this.user.user_no // 사용자 번호 (실제 값으로 대체)
        const response = await axios.post('http://localhost:3000/stock/add_like', {
          user_no: userNo,
          stock_name: item,
        })
        if (response.data.success) {
          await this.checkLike()
        } else {
          console.log('찜하기 실패')
        }
      } catch(error) {
        console.error('찜하기 중에 오류가 발생했습니다.', error)
      }
    },
    async checkLike() {
      if(this.user.user_no==='') {
        return false
      }
      try{
        const userNo = this.user.user_no // 사용자 번호 (실제 값으로 대체)
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
        console.error('찜하기 불러오기 오류가 발생했습니다.', error)
      }
    },
    async getStock () {
      this.loading = true
      this.saleStock = false
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
                changePrice: info.fluctate_24H,
                changeRate: info.fluctate_rate_24H
              }))
            this.coinData.pop()
          } catch (err) {
            console.log(err)
          }
        }, 1000)
      } else {
        if(this.user.user_no==='') {
          this.$swal('로그인이 필요합니다.', '', 'warning')
          this.myStock = false
          this.$router.push('/login')
          return
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
                  changePrice: info.fluctate_24H,
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
      setTimeout(() => {
        this.loading = false
      }, 2000)
      this.candleCode = code
      this.candleCount = count
      this.candleTime = time
      clearInterval(this.stockDataTimeCandle)
      this.stockDataTimeCandle = setInterval(async () => {
        try {
          const res = await axios.get(`http://localhost:3000/stock/coin_info_candle/${code}/${time}`)
          this.candleData = res.data.data.splice(res.data.data.length - count, res.data.data.length)
        } catch (err) {
          console.log(err)
        }
        this.drawChart()
      }, 1500)
      // 만약 구매한 종목이라면 구매한 종목 갯수를 가져온다.
      await this.getSaleStock(code)
    },
    drawChart () {
      this.curCandleCode = this.candleCode
      let cd = this.candleData
      let cdtemp = []
      let chart_trade_amount = []
      for (var i=0; i<cd.length; i++) {
        cdtemp.push({
          x: this.$formatDateTime(cd[i][0], this.candleTime !== '24h'),
          y: [cd[i][1], cd[i][3], cd[i][4], cd[i][2]]
        })
        chart_trade_amount.push({
          x: this.$formatDateTime(cd[i][0], this.candleTime !== '24h'),
          y: Math.floor(cd[i][5])
        })
        if (cd[cd.length - 1]) {
          this.selectPrice = cd[cd.length - 1][2]
          this.selectAmount = cd[cd.length - 1][2] - cd[cd.length - 1][1]
          this.selectRate = ((cd[cd.length - 1][2] - cd[cd.length - 1][1]) / cd[cd.length - 1][1] * 100).toFixed(2)
          this.selectHighPrice = cd[cd.length - 1][3]
          this.selectLowPrice = cd[cd.length - 1][4]
        }
      }
      this.candleChartSeries[0].data = cdtemp
      this.barChartSeries[0].data = chart_trade_amount
    },
    async getSaleStock(code) {
      if(this.user.user_no==='') return
      try {
        const response = await axios.post('http://localhost:3000/stock/sale_stock_amount', {
          user_no: this.user.user_no,
          stock_name : code
        })
        if(response.data.message==='구매한 종목 없음') return

        this.sell_mock_amount = parseInt(response.data.amount.MOCK_AMOUNT)
      } catch (err) {
        console.log(err)
      }
    },
    async saleStockToggle() {
      if (this.user.user_no === '') {
        this.$swal('로그인이 필요합니다.', '', 'warning')
        this.$router.push('/login')
        return
      }
      if(this.saleStock) return

      this.coinData = []
      this.myStock = false
      this.saleStock = true
      this.sortValue = 'price'
      clearInterval(this.stockDataTime)
      this.stockDataTime = setInterval(async () => {
        try {
          const res = await axios.post('http://localhost:3000/stock/sale_stock_info', {
            user_no: this.user.user_no
          })
          if(res.data.message!=='구매한 종목 없음'){
            this.coinData = Object.entries(res.data)
              .map(([coin,info]) => ({
                coin : info.MOCK_NAME,
                price: info.MOCK_PRICE,
                amount: info.MOCK_AMOUNT,
                total_price: info.TOTAL_PRICE,
                rate: info.RATE.toFixed(2),
                rate_price: info.rate_price,
                closing_price : info.closing_price
              }))
          } else {
            this.coinData = []
          }
        } catch (err) {
          console.log(err)
        }
      }, 1000)
    },
    myStockToggle (myBool) {
      if(this.saleStock){
        // 모의투자가 켜져있을 경우
        if(myBool){
          // 나의 종목으로 갈 경우
          if (this.user.user_no === '') {
            this.$swal('로그인이 필요합니다.', '', 'warning')
            this.$router.push('/login')
            return
          }
          this.saleStock = false
          this.sortValue = 'price'
          this.myStock = myBool
          this.getStock()
        } else {
          // 전체 종목으로 갈 경우
          this.saleStock = false
          this.sortValue = 'price'
          this.myStock = myBool
          this.getStock()
        }
      } else {
        // 모의투자가 꺼져있을 경우
        if(myBool){
          // 나의 종목으로 갈 경우
          if (this.user.user_no === '') {
            this.$swal('로그인이 필요합니다.', '', 'warning')
            this.$router.push('/login')
            return
          }
          this.myStock = myBool
          this.getStock()
        } else {
          // 전체 종목으로 갈 경우
          this.myStock = myBool
          this.getStock()
        }
      }
    },
    sortTable () {
      this.sortBy = [{key: this.sortValue, order: this.sortOrder}]
    },
    async getSimulatedAmount () {
      if(this.user.user_no === '') return
      try {
        const res = await axios.get(`http://localhost:3000/stock/simulatedAmount/${this.user.user_no}`)
        this.simulatedAmount = res.data.result
      } catch (err) {
        console.log(err)
      }
    },
    async mock(sell) {
      if(this.user.user_no===''){
        this.$swal('로그인이 필요합니다.', '', 'warning')
        return this.$router.push('/login')
      }
      if(sell && (this.sell_mock_amount==='' || this.sell_mock_amount===0) || !sell && (this.buy_mock_amount==='' || this.buy_mock_amount===0)) {
        this.$swal('수량을 입력해주세요.', '', 'warning')
        return
      }
      if(this.loading) return
      this.loading = true
      try{
        const res = await axios.post('http://localhost:3000/stock/update_simulatedAmount', {
          user_no: this.user.user_no,
          code: this.candleCode,
          trade_price: this.selectPrice,
          trade_amount: sell ? this.sell_mock_amount : this.buy_mock_amount,
          sell: sell
        })
        if(res.data.message==='금액이 부족합니다.'){
          this.$swal('금액이 부족합니다.', '', 'warning')
        } else if (res.data.message==='매도할 종목 없음'){
          this.$swal('매도할 종목이 없습니다.', '', 'warning')
        } else if (res.data.message==='매수할 종목 없음'){
          this.$swal('매수할 종목이 없습니다.', '', 'warning')
        } else if (res.data.message==='수량 부족') {
          this.$swal('수량이 부족합니다.', '', 'warning')
        } else if (res.data.message==='매수 성공') {
          this.$swal('매수 성공', '', 'success')
          await this.getSimulatedAmount()
          this.buy_mock_amount = ''
        } else if (res.data.message==='매도 성공') {
          this.$swal('매도 성공', '', 'success')
          await this.getSimulatedAmount()
          this.sell_mock_amount = ''
        } else {
          this.$swal('오류가 발생했습니다.', '', 'warning')
        }
        this.loading = false
      } catch(error) {
        console.error(error)
        this.loading = false
      }
    },
    async getAiStock() {
      if(this.user.user_no===''){
        this.$swal('로그인이 필요합니다.', '', 'warning')
        return this.$router.push('/login')
      }
      try {
        const res = await axios.post('http://localhost:3000/openai/aichat',{
          user_no: this.user.user_no
        })
        if(res.data.message==='이미 1분 이내에 실행한 적이 있습니다.'){
          this.$swal('이미 1분 이내에 실행한 적이 있습니다.', '', 'warning')
          return
        } else if (res.data.message==='DB 오류가 발생했습니다.') {
          this.$swal('DB 오류가 발생했습니다.', '', 'warning')
          return
        } else if (res.data.message==='관심 종목이 5개 미만입니다.') {
          this.$swal('관심 종목이 5개 미만입니다.', '', 'warning')
          return
        }
        this.stock_name = res.data.stock_name
        this.stock_aicontent = res.data.message
      } catch (error) {
        console.error(error)
      }
    },
    full_mock() {
      if(this.user.user_no===''){
        this.$swal('로그인이 필요합니다.', '', 'warning')
        return this.$router.push('/login')
      }
      this.buy_mock_amount = Math.floor(this.simulatedAmount/this.selectPrice)
    }
  },
  unmounted () {
    clearInterval(this.stockDataTime)
    clearInterval(this.stockDataTimeCandle)
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
  text-overflow: ellipsis
}
.coin-table-wrapper {
  /* 원하는 크기로 조정하세요 */
  min-height: 300px
}
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: #efefef; */
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
  color: #f75467;
  margin-right: -15px;
}
.rate_blue{
  color: #2b6fe5;
  margin-right: -15px;
}
.select {
  width: 50%;
  height: 30px;
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
.no-padding {
  width: 100px; /* 원하는 너비로 조절 */
  height: 60px; /* 원하는 높이로 조절 */
  }

.click {
  color: #1b1b1b;
  font-weight: 700;
  height: 40px;
}

.mock
.mock.title {
  font-size: 20px;
  margin-left: -20px;
}

.mock-asset {
  margin-left: -20px;
  margin-bottom: 10px;
}
</style>
