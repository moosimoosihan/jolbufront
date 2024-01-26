<template>
  <div class="table-container">
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="7">
            <v-sheet
              min-height="85vh"
              rounded="lg"
            >
              <v-select
                label="Select"
                :items="[10,20, 30, 40, 50]"
                variant="underlined"
                v-model="candleCount"
                @change="getStockCandle(candleCode,candleCount)"
              ></v-select>
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
            <v-sheet rounded="lg">
              <v-data-table
                height="100%"
                width="100%"
                :headers ="headers"
                :items="coinData"
                :hide-default-footer="true"
                class="coin-table-wrapper">
                <template v-slot:item="{ item }">
                  <tr @click="getStockCandle(item.coin,candleCount)" class="coin_table">
                    <td>{{ item.coin }}</td>
                    <td class="animation_table" :class="item.changeRate===0?'rate_black': item.changeRate>0?'rate_red':'rate_blue'">
                      {{ $currencyFormat(item.price) }}
                    </td>
                    <td>{{ item.volume }}</td>
                    <td :class="item.changeRate===0?'rate_black': item.changeRate>0?'rate_red':'rate_blue'">{{ item.changeRate }}</td>
                    <td>
                      <v-icon color="success" icon="mdi-plus" size="x-small" @click="addToLike(item)">
                      </v-icon>
                    </td>
                    <td>
                      <v-icon color="success" icon="mdi-minus" size="x-small" @click="deleteToLike(item)">
                      </v-icon>
                    </td>
                  </tr>
                </template>
              </v-data-table>
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
        { title: '삭제', value: 'delete', align: 'center' }
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
      stock_aicontent: ''
    }
  },
  created () {
    this.getStock()
    this.getStockCandle(this.candleCode,this.candleCount)
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    deleteToLike(item) {
      const userNo = this.user.user_no; // 사용자 번호 (실제 값으로 대체)
      const stockName = item.coin; // 종목명
      axios.post('http://localhost:3000/stock/delete_like', {
        user_no: userNo,
        stock_name: stockName,
      })
        .then(response => {
          if (response.data.success) {
            this.$swal('찜하기 삭제 성공', '', 'success');
            console.log('찜하기 삭제 성공');
          } else {
            console.log('찜하기 삭제 실패');
          }
        })
        .catch(error => {
          console.error('찜하기 삭제 중에 오류가 발생했습니다.', error);
        });
    },
    addToLike(item) {
      const userNo = this.user.user_no; // 사용자 번호 (실제 값으로 대체)
      const stockName = item.coin; // 종목명
      axios.post('http://localhost:3000/stock/add_like', {
        user_no: userNo,
        stock_name: stockName,
      })
        .then(response => {
          if (response.data.success) {
            this.$swal('찜하기 성공', '', 'success');
            console.log('찜하기 성공');
          } else {
            console.log('찜하기 실패');
          }
        })
        .catch(error => {
          console.error('찜하기 중에 오류가 발생했습니다.', error);
        });
    },
    async getStock () {
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
        } catch (err) {
          console.log(err)
        }
      }, 1000)
    },
    format (num) {
      return this.$currencyFormat(num)
    },
    // 차트
    async getStockCandle (code,count) {
      this.candleCode = code
      console.log(this.candleCode)
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
    }
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
</style>
