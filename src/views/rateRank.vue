<template>
  <v-sheet class="rateRank">
    <v-data-table-virtual
      :headers="headers"
      :items="rateRank"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>수익률 랭킹</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item="{item}">
        <tr>
          <td>{{ item.rank }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.mock_rate.toFixed(2) }}%</td>
        </tr>
      </template>
    </v-data-table-virtual>
  </v-sheet>
</template>
<script>
import axios from 'axios'
export default {
  name: 'rateRank',
  data () {
    return {
      headers: [
        { title:'순위', value: 'rank'},
        { title:'닉네임', value: 'name' },
        { title:'수익률', value: 'mock_rate'},
      ],
      rateRank: []
    }
  },
  created () {
    this.getRateRank()
  },
  methods: {
    getRateRank () {
      axios.get('http://localhost:3000/stock/rateRank')
        .then(res => {
          // rank 추가
          console.log(res.data)
          this.rateRank = res.data.map((item, index) => {
            return {
              ...item,
              rank: index + 1 + '위'
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
}
</script>
<style scoped>
.rateRank {
  width: 250px;
  height: 500px;
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column-reverse;
  position: fixed;
  top: 10%;
  right: 82.5%;

  background: seashell;
}
</style>
