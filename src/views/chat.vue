<template>
  <div>
    <v-btn class="chat-button" @click="toggleChatBox" style="transition: ease-in-out">
      {{ chatBoxVisible ? '채팅 닫기' : '채팅 열기' }}
    </v-btn>
    <v-list class="chat" v-show="chatBoxVisible">
      <rateRank />
        <v-list-item v-for="(msg, i) in chatList" :key="i">
          <v-row class="message">
            <v-col cols="12">
              <span class="message-content">{{ msg.name }}님 : {{ msg.chat_content }}</span>
            </v-col>
          </v-row>
        </v-list-item>
        <v-row class="input-form">
          <v-col cols="10">
            <v-text-field v-model="chat_content" @keydown.enter="send" placeholder="입력" />
          </v-col>
          <v-col cols="2">
            <v-btn @click="send">↲</v-btn>
          </v-col>
        </v-row>
    </v-list>
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
        chat_user: data.user_no,
        chat_content: data.chat_content,
        name: data.name
      });
      this.scroll()
    })
    this.getUser()
  },
  methods: {
    toggleChatBox() {
      this.chatBoxVisible = !this.chatBoxVisible;
    },
    scroll() {
      setTimeout(() => {
        const scroll = document.getElementById('scroll');
        scroll.scrollTop = scroll.scrollHeight;
      }, 100);
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
        const chat_user = this.user.user_no;

        const response = await axios.post(`http://localhost:3000/chat/send`, {
          chat_content,
          chat_date,
          chat_user
        });
        if(response.data.message === 'success') {
          this.socket.emit('chat', {
            chat_content: this.chat_content,
            chat_user: this.user.user_no,
            name: this.myName
          })
          this.chatList.push({
            name: this.myName,
            chat_content: this.chat_content
          });
          this.chat_content = '';
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
  width: 450px;
  height: 500px;
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column-reverse;
  position: fixed;
  top: 6%;
  left: 65%;
  background: #ffffff;
  border-radius: 5px;
}

.message {
  max-width: 430px;
  border: 1px solid #bec5d7;
  margin: 12px;
  border-radius: 4px;
  padding: 10px;
  font-size: 12px;
  display: inline-block;
  position: relative;
  text-align: right;
}
.message-content {
  border-radius: 5%;
  font-size: x-small;
}

.input-form {
  width: 290px;
  align-items: center;
  margin-top: 10px;
  position: fixed;
  top: 59%;
  left: 65%;
}

.input-form input {
  flex: 1;
  padding: 5px;
  border: none;
  border-radius: 5px;
  height: 2px;
}

.input-form button {
  padding: 1px 5px;
  margin-left: 10px;
  border: none;
  background-color: #333;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  font-size: x-small;
  position: fixed;
  top: 63%;
  left: 87%;
}

.input-form button:hover {
  background-color: #555;
}
#scroll {
  overflow-y: scroll;
}
/* 마우스 호버 시 애니메이션 효과 설정 */
.message:hover {

}

.chat-button {
  position: fixed;
  top: 90%;
  left: 90%;
  background-color: #333;
  color: #fff;
  border-radius: 85px;
  cursor: pointer;
  font-size: x-small;
  text-align: center;
}
.chat-button:hover {
  background-color: #555;
  transition-timing-function: ease-in-out;
}
</style>
