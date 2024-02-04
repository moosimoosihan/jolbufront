<template>
  <div>
    <v-btn v-if="!chatBoxVisible" class="chat-button" @click="toggleChatBox" style="transition: ease-in-out">
      <v-icon color="blue" size="25">mdi-chat</v-icon>
    </v-btn>
    <v-container class="pa-0 chat" v-show="chatBoxVisible">
      <rateRank />
      <v-row class="no-gutters elevation-4">
        <v-col
          cols="auto"
          class="flex-grow-1 flex-shrink-0"
        >
          <v-card
            flat
            class="d-flex flex-column"
            color="#E3F2FD"
          >
          <v-toolbar color="primary">
            <v-toolbar-title>실시간 채팅</v-toolbar-title>
            <v-icon class="mr-2" @click="toggleChatBox">mdi-close-circle</v-icon>
          </v-toolbar>
            <v-card-text class="overflow-y-auto chat_card">
              <template v-for="(msg, i) in chatList">
                <div
                  :class="{ 'd-flex flex-row-reverse': msg.user_no===user.user_no, 'd-flex flex-row': msg.user_no!==user.user_no}"
                >
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-chip
                       :color="msg.user_no===user.user_no ? '#673AB7' : ''" 
                      dark
                      style="height:auto; white-space: normal;"
                      class="pa-4 mb-2"
                      v-on="on"
                      >
                      <span :style="{ color: msg.user_no===user.user_no ? 'indigo' : 'black' }">{{ msg.chat_content }}</span>
                      <sub
                      class="ml-2"
                      :style="{ color: msg.user_no!==user.user_no ? 'gray' : 'white' }"
                      style="font-size: 0.5rem;"
                      >{{ msg.date }}</sub>
                    </v-chip>
                  </template>
                  </v-menu>
                </div>
              </template>
            </v-card-text>
            <v-card-text>
              <v-row>
                <v-text-field
                  v-model="chat_content"
                  label="메시지를 입력하세요."
                  type="text"
                  no-details
                  outlined
                  append-inner-icon="mdi-arrow-up-bold-box-outline"
                  @keyup.enter="send"
                  @click:append-inner="send"
                  hide-details
                  variant="solo"
                  style="background-color: #FFFFFF;"
                />
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import io from "socket.io-client";
import axios from "axios";
import rateRank from '@/views/rateRank.vue'

export default {
  data() {
    return {
      chatList: [],
      chat_content: '',
      chat_date: '',
      connected: false,
      socket: io('http://localhost:3001'),
      chatBoxVisible: false,
      myName: '',
    }
  },
  components: {
    rateRank
  },
  created() {
    this.socket.on('connect', () => {
      this.connected = true;
      console.log('채팅방 연결됨');
    })
    this.socket.on('chat', async (data) => {
      this.chatList.push({
        user_no: data.user_no,
        chat_content: data.chat_content,
        name: data.name,
        date: data.date
      });
      this.scroll()
    })
    this.getUser()
  },
  methods: {
    scroll(){
      setTimeout(() => {
        var chat_card = document.querySelector('.chat_card');
        chat_card.scrollTop = chat_card.scrollHeight;
      }, 100)
    },
    toggleChatBox() {
      this.chatBoxVisible = !this.chatBoxVisible;
      if(this.chatBoxVisible) {
        this.scroll()
      }
    },
    async getUser() {
      try {
        const response = await axios.get(`http://localhost:3000/chat/get_name/${this.user.user_no}`);
        this.myName = response.data[0].name;
      } catch(error) {
        console.error(error);
      }
    },
    //채팅룸 데이터베이스 보내기
    async send() {
      if(this.user.user_no===''){
        this.$swal('로그인을 해주세요.')
        this.$router.push('/login')
        return;
      }
      if(this.chat_content===''){
        this.$swal('메시지를 입력하세요.')
        return;
      }
      try {
        const chat_date = this.$formatDateTime(new Date(), true);
        const chat_content = this.chat_content;
        const user_no = this.user.user_no;

        const response = await axios.post(`http://localhost:3000/chat/send`, {
          chat_content,
          chat_date,
          user_no
        });
        if(response.data.message === 'success') {
          this.socket.emit('chat', {
            chat_content: chat_content,
            user_no: user_no,
            name: this.myName,
            date: chat_date
          })
          this.chatList.push({
            user_no: user_no,
            name: this.myName,
            chat_content: chat_content,
            date: chat_date
          });
          this.chat_content = '';
          this.scroll()
        } else {
          console.log('전송 실패');
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  unmounted () {
    this.socket.off('chat')
    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('채팅방 연결 끊김');
    })
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  }
}

</script>
<style scoped>
.chat {
  top: 60px;
  right: 20px;
  width: 300px; /* Set your desired width */
  min-height: 400px;
  max-height: 400px;
  position: fixed;
}
.chat_card {
  min-height: 400px;
  max-height: 400px;
}
.chat-button {
  position: fixed;
  bottom: 50px;
  right: 20px;
}
.v-application__wrap{
  min-height: 0;
}
</style>
