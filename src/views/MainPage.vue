<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer>
      <v-list>
        <v-list-item title="관심 종목">
          <ul>
            <li>삼성전자</li>
            <li>SK하이닉스</li>
            <li>LG화학</li>
            <li>삼성바이오로직스</li>
            <li>NAVER</li>
          </ul>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer location="right">
      <v-list>
        <v-list-item title="AI 추천 종목">
          <ul>
            <li>삼성전자</li>
            <li>SK하이닉스</li>
            <li>LG화학</li>
            <li>삼성바이오로직스</li>
            <li>NAVER</li>
          </ul>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="d-flex align-center justify-center">
      <div>
        <p>코스닥 지수</p>
        <Bar
          class="cosdack-chart"
          :options="chartOptions1"
          :data="chartData1"
        />
        <Line
          class="cosdack-chart"
          :options="chartOptions1"
          :data="chartData1"
        />
      </div>
      <div>
        <p>코스피 지수</p>
        <Bar
          class="cospy-chart"
          :options="chartOptions2"
          :data="chartData2"
        />
        <Line
          class="cospy-chart"
          :options="chartOptions2"
          :data="chartData2"
        />
      </div>
    </v-main>
  </v-layout>
</template>
<script>
// import axios from "axios"
import io from 'socket.io-client'
import { Chart, registerables } from 'chart.js'
import { Line, Bar } from 'vue-chartjs'
Chart.register(...registerables)

export default {
  name: 'MainPage',
  components: {
    Line, Bar
  },
  data () {
    return {
      socket: io('http://localhost:3001'),
      chartData1: {
        labels: [
          '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'
        ],
        datasets: [
          {
            label: '시간별',
            backgroundColor: '#718bff', // 포인트 색상
            data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20],
            borderColor: '#1a48ff', // 선 색상
            hoverBorderColor: '#000000' // 마우스 hover 시 포인트 테두리 색상
          }
        ]
      },
      chartData2: {
        labels: [
          '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'
        ],
        datasets: [
          {
            label: '시간별',
            backgroundColor: '#ff5858',
            data: [10, 78, 20, 30, 20, 60, 40, 30, 20, 5]
          }
        ]
      },
      chartOptions1: {
        responsive: false,
        maintainAspectRatio: false
      },
      chartOptions2: {
        plugins: {
          legend: {
            display: true, // 범례 숨기기
            position: 'bottom', // 범례 위치
            labels: {
              boxWidth: 8, // 범례 박스 크기
              padding: 10, // 범례와 차트 사이 간격
              usePointStyle: true, // 범례 포인트 스타일 사용
              pointStyle: 'circle', // 범례 포인트 모양
              font: {
                size: 14 // 범례 폰트 크기
              }
            },
            fullSize: true, // 범례 전체 크기 사용
            align: 'center' // 범례 정렬
          },
          tooltip: {
            boxWidth: 15, // 툴팁 박스 크기
            bodyFont: {
              size: 14 // 툴팁 폰트 크기
            }
          }
        },
        responsive: false, // 차트 크기 조정
        maintainAspectRatio: false, // 차트 비율 조정
        layout: {
          padding: {
            top: 0, // 차트와 상단 간격
            bottom: 0 // 차트와 하단 간격
          }
        },
        elements: {
          arc: {
            borderWidth: 2 // 차트 테두리 두께
          }
        },
        animation: {
          duration: 5000 // 애니메이션 지속 시간
        }
      }
    }
  },
  created () {
    this.socket.on('connect', () => {
      console.log('주식 서버 연결됨')
    })
    this.socket.on('stock', async (data) => {
      console.log('주식 데이터 받음')
      console.log(data)
    })
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {

  }
}
</script>
<style scoped>

</style>
