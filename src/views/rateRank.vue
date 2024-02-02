<template>
  <v-sheet class="rateRank">
    <v-data-table-virtual
      :headers="headers"
      :items="rateRank"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="rank">수익률 랭킹</v-toolbar-title>
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
.rank{
  font-weight: 900;
  margin-left:54px;
}
.rateRank {
  width: 250px;
  height: 500px;
  font-weight: 900;
  border: 1px solid #fafafa;
  padding: 10px;
  display: flex;
  flex-direction: column-reverse;
  position: fixed;
  top: 10%;
  right: 82.5%;

  background: rgb(255, 242, 243);
}

/* 마우스 호버시 */
.dropbtn {
  background-color: #4CAF50;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}


.dropdown {
  display: inline-block;
}

.dropdown-content {
  display: none;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {background-color: #f1f1f1}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}
</style>
