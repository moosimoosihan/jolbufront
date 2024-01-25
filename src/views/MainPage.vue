<template>
  <div class="table-container">
    <v-data-table
      :headers ="headers"
      :items="coinData"
      :hide-default-footer="true"
      class="elevation-1 small-table"
    >
      <template v-slot:item="{ item }">
        <tr @click="gotoStock(item.coin)">
          <td>{{ item.coin }}</td>
          <td>{{ $currencyFormat(item.price) }}</td>
          <td>{{ item.volume }}</td>
          <td>{{ item.changeRate }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'MainPage',
  data () {
    return {
      headers: [
        { text: '코인', value: 'coin' },
        { text: '가격', value: 'price' },
        { text: '거래량', value: 'volume' },
        { text: '변동률', value: 'changeRate' }
      ],
      coinData: [],
      stockDataTime: null,
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
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 화면 전체 높이에 맞춤 */
}
.small-table {
  width: 50%;
  font-size: 12px;
}
</style>
