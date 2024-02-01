<template>
  <v-container>
    <Header />
    <v-navigation-drawer
      permanent
    >
      <v-list>
        <v-col>
          <v-tabs direction="vertical" class="custom-tabs">
            <v-tab to="/mypage" class="m">
              <v-icon start>mdi-account-circle</v-icon>
              <p>내 정보</p>
            </v-tab>
            <v-tab to="/mypage/mypagemk" class="m">
              <v-icon start>mdi-check-circle</v-icon>
              <p>모의투자</p>
            </v-tab>
            <v-tab to="/mypage/myStock" class="m">
              <v-icon start>mdi-folder</v-icon>
              <p>내 종목</p>
            </v-tab>
            <v-tab to="/mypage/ai" class="m">
              <v-icon start>mdi-history</v-icon>
              <p>AI 답변</p>
            </v-tab>
          </v-tabs>
        </v-col>
      </v-list>
    </v-navigation-drawer>
    <div class="default_content">
      <router-view />
    </div>
  </v-container>
</template>

  <script>
  import Header from './header.vue'
  import Footer from './footer.vue'

  export default {
    name: 'mypageLayout',
    components: {
      Header, Footer
    }
  }

  </script>
  <style scoped>
  .root_container {
    width: 100%;
    min-width: 1300px;
  }
  .default_content {
    margin: auto;
    height: 100%;
    position: relative;
    min-height: 100%;
  }

  Footer {
    width: 100%;
    height: auto;
    position : relative;
    transform : translateY(-1%);
  }

.m_container {
  height: 430px;
  overflow-y: scroll ;
  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none;
   /* 파이어폭스 */
}
.m {
  margin-top: 10px;
  color: black;
  width: 200px;
}
.custom-tabs .v-tab {
  font-size: 16px; /* 원하는 글씨 크기로 설정 */
  font-weight:bold;
}
  </style>
