<template>
  <v-sheet>
    <v-row>
      <v-col cols="3">
        <v-card height="80">
          <v-card-title>총 유저 수</v-card-title>
          <v-card-text>{{ count.user_count }} 명</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card height="80">
          <v-card-title>총 관리자 수</v-card-title>
          <v-card-text>{{ count.admin_count }} 명</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card height="80">
          <v-card-title>총 거래 수</v-card-title>
          <v-card-text>{{ count.buy_count }} 개</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card height="80">
          <v-card-title>총 AI 응답 수</v-card-title>
          <v-card-text>{{ count.ai_count }} 개</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card height="250">
          <v-card-title>모의 투자 날짜별 거래 수</v-card-title>
          <ApexCharts
            class="chart"
            ref="barChart"
            type="bar"
            height="200"
            :options="barChartOptions1"
            :series="barChartSeries1"
          />
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card height="250">
          <v-card-title>모의 투자 구매 수량 많은 종목</v-card-title>
          <apex-charts
            class="chart"
            ref="barChart"
            type="bar"
            height="200"
            :options="barChartOptions2"
            :series="barChartSeries2"
          />
        </v-card>
      </v-col>
      <v-col cols="5">
        <v-card height="250">
          <v-card-title>24시간내 판매량 백분율</v-card-title>
          <apex-charts
            class="chart"
            ref="pieChart"
            type="pie"
            height="200"
            :options="pieChartOptions1"
            :series="pieChartSeries1"
          />
        </v-card>
      </v-col>
      <v-col cols="7">
        <v-card height="250">
          <v-card-title>24시간내 변동량이 높은 순</v-card-title>
          <apex-charts
            class="chart"
            ref="pieChart"
            type="pie"
            height="200"
            :options="pieChartOptions2"
            :series="pieChartSeries2"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
import axios from 'axios'
import * as apexcharts from 'apexcharts'
import ApexCharts from 'vue3-apexcharts'
export default {
  name: 'adminMainPage',
  components: { ApexCharts },
  data () {
    return {
      count: {},
      barChartSeries1: [{
        name: '거래량',
        type: 'bar',
        data: []
      }],
      barChartSeries2: [{
        name: '거래량',
        type: 'bar',
        data: []
      }],
      barChartOptions1: {
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
        colors: ['#008FFB'],
        plotOptions: {
          bar: {
            columnWidth: '50%',
          }
        },
      },
      barChartOptions2: {
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
        colors: ['#008FFB'],
        plotOptions: {
          bar: {
            columnWidth: '50%',
            horizontal: true,
          }
        },
      },
      pieChartSeries1: [],
      pieChartOptions1: {
        chart: {
          type: 'pie',
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
        labels: [],
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      pieChartSeries2: [],
      pieChartOptions2: {
        chart: {
          type: 'pie',
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
        labels: [],
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    }
  },
  created() {
    this.getCount()
    this.getBuyChart()
    this.getMockRandChart()
    this.getVolumeRank()
    this.getChangeRank()
  },
  methods: {
    async getCount() {
      try {
        const response = await axios.get('http://localhost:3000/admin/count')
        this.count = response.data
      } catch(e) {
        console.log(e)
      }
    },
    async getBuyChart() {
      this.barChartSeries1[0].data = []
      try {
        const response = await axios.get('http://localhost:3000/admin/buyChart')
        for(let i=0;i<response.data.length;i++){
          this.barChartSeries1[0].data.push({
            x: response.data[i].date,
            y: response.data[i].count
          })
        }
      } catch(e) {
        console.log(e)
      }
    },
    async getMockRandChart(){
      this.barChartSeries2[0].data = []
      try {
        const response = await axios.get('http://localhost:3000/admin/mock_rank')
        for(let i=0;response.data.length;i++){
          this.barChartSeries2[0].data.push({
            x: response.data[i].mock_name,
            y: response.data[i].sum_amount
          })
        }
      } catch(e) {
        console.log(e)
      }
    },
    async getVolumeRank() {
      this.pieChartSeries1 = []
      try {
        const response = await axios.get('http://localhost:3000/admin/volume_rank')
        for(let i=0;i<response.data.length;i++){
          this.pieChartOptions1.labels.push(response.data[i].code)
          this.pieChartSeries1.push(response.data[i].units_traded)
        }
      } catch(e) {
        console.log(e)
      }
    },
    async getChangeRank() {
      this.pieChartSeries2 = []
      try {
        const response = await axios.get('http://localhost:3000/admin/change_rank')
        for(let i=0;i<response.data.length;i++){
          this.pieChartOptions2.labels.push(response.data[i].code)
          this.pieChartSeries2.push(response.data[i].fluctate_rate_24H)
        }
      } catch(e) {
        console.log(e)
      }
    }
  }
}
</script>
<style scoped>

</style>
