<template>
  <div class="root_container">
    <Header />
    <div class="default_content">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
import axios from 'axios'
import Header from './header.vue'
import Footer from './footer.vue'

export default {
  name: 'defaultLayout',
  components: {
    Header, Footer
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  created () {
    this.getUser()
  },
  methods: {
    async getUser () {
      if (this.user.user_no === '') return

      try {
        const response = await axios.post(`http://localhost:3000/admin/admin_check`, {
          user_no: this.user.user_no
        })
        if (response.data.auth === 'admin') return this.$router.push('/admin')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
<style scoped>
.root_container {
  width: 100%;
  min-width: 1450px;
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
</style>
