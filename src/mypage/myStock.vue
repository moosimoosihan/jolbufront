<template>
    <v-sheet>
        <v-data-table
        :headers="headers"
        :items="likeData"
        hide-default-footer
        no-data-text="찜한 종목이 없습니다."
        >
            <template v-slot:item="{ item }">
                <tr class="coin_table" :class="item.changeRate==0?'rate_black': item.changeRate>0?'rate_red':'rate_blue'">
                    <td>
                        {{ item.coin }}
                    </td>
                    <td>
                        {{ $currencyFormat(item.price) }}
                    </td>
                    <td>
                        {{ Math.floor(item.volume) }}
                    </td>
                    <td>
                        <p>{{ item.changePrice>0?'+':'' }}{{ $currencyFormat(item.changePrice) }}</p>
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
        </v-data-table>
    </v-sheet>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            headers: [
                { title: '코인', value: 'coin', align: 'center' },
                { title: '가격', value: 'price', align: 'center' },
                { title: '거래량', value: 'volume', align: 'center' },
                { title: '변동률', value: 'changeRate', align: 'center' },
                { title: '찜', value: 'like', align: 'center', sortable: false },
            ],
            likeData: [],
            likeList: [],
            stockDataTime: null,
        }
    },
    computed:{
        user(){
            return this.$store.state.user
        }
    },
    created(){
        this.getmylike()
        this.getmylikeinfo()
    },

    methods:{
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
          await this.getmylike()
          await this.getmylikeinfo()
        } else {
          console.log('찜하기 삭제 실패')
        }
      } catch(error) {
        console.error('찜하기 삭제 중에 오류가 발생했습니다.', error)
      }
    },
        async getmylike(){
            if(this.user.user_no===''){
                return false
            }
            try {
                const response = await axios.post('http://localhost:3000/stock/check_like',{
                    user_no: this.user.user_no
                })

                this.likeList= []
                for(var i=0; i<response.data.result.length; i++){
                    this.likeList.push(response.data.result[i].STOCK_NAME)
                }
            } catch(err){
                console.log(err)
            }
        },
        async getmylikeinfo(){
            if(this.user.user_no==='') {
            this.$swal('로그인이 필요합니다.', '', 'warning')
            this.myStock = false
            this.$router.push('/login')
            return
            }
            this.stockDataTime = setInterval( async () => {
                try {
                    const res = await axios.post('http://localhost:3000/stock/like_stock_info',{
                        user_no: this.user.user_no
                    })
                    this.likeData = []
                    for(let i=0; i<res.data.length; i++) {
                        const data = Object.entries(res.data[i])
                        .map(([coin, info]) => ({
                            coin,
                            price: info.closing_price,
                            volume: info.units_traded,
                            changePrice: info.fluctate_24H,
                            changeRate: info.fluctate_rate_24H
                        }))
                        this.likeData.push(data[0])
                    }

                } catch (err) {
                    console.log(err)
                }
            }, 1000);
        }
    },
    unmounted () {
        clearInterval(this.stockDataTime)
    }
}
</script>
<style scoped>

.rate_black{
  color: black;
}
.rate_red{
  color: red;
}
.rate_blue{
  color: blue;
}

.coin_table thead th {
  white-space: nowrap;
}

.coin_table tbody th,
.coin_table tbody td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}
.coin_table {
  text-align: center;
  width: 100%;
  table-layout: fixed;
}

.coin-table-wrapper {
  min-height: 80px
}
</style>
