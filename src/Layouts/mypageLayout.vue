<template>
    <div class="root_container">
      <Header />
      <v-navigation-drawer>
        <v-drawer>
        <v-list>
            <div class="m_container">
                <router-link class="m" to="/mypage/">
                    <p>내 정보</p>
                </router-link>
                <router-link class="m" to="mypage/mypageAI">
                    <p>AI 히스토리</p>
                </router-link>
            </div>
        </v-list>
    </v-drawer>
    </v-navigation-drawer>
      <div class="default_content">
        <router-view />
      </div>
      <Footer />

    </div>
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
}
  </style>
  