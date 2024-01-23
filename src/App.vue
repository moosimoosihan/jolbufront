<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App'
}
</script>
<style>
* {
  margin:0;
  padding:0;
  box-sizing: border-box;
}

body {
  overflow-y: scroll;
  -ms-overflow-style: none;
  /* 인터넷 익스플로러 */
  scrollbar-width: none;
  /* 파이어폭스 */
}
</style>
