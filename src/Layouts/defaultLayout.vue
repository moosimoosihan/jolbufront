<template>
  <div>
    <Header />
    <div>
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from './header.vue'
import Footer from './footer.vue'

export default {
  name: 'defaultLayout',
  components: {
    Header, Footer
  }
}
</script>
<style scoped>

</style>
