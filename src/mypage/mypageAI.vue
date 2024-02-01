<template>
    <v-sheet>
      <v-data-table
        fixed-header
        item-key="order"
        hide-default-footer
        :headers="headers"
        :items="mypageai"
      />
    </v-sheet>
  </template>
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        headers: [
          { title: '번호', value: 'order', align: 'center'},
          { title: '답변', value: 'response', align:'center'},
          { title: '날짜', value: 'date', align:'center'},
        ],
        getmypageai1:[],
        mypageai:[]
      };
    },
    computed:{
      user(){
        return this.$store.state.user
      }
    },
    created(){
      this.getmypageai()
    },
    methods: {
      async getmypageai() {
        this.mypageai=[];
            try {
              const user_no=this.user.user_no;
              const response = await axios.get(`http://localhost:3000/mypage/mypageai/${user_no}`);
              for(var i=0;i<response.data.length;i++){
                this.mypageai.push({
                    order: i + 1, // 순서를 나타내는 숫자 부여
                    response:response.data[i].ai_response,
                    date:this.formatDateTime(response.data[i].ai_date)

                })
              }
              console.log(this.mypageai)
            } catch (error) {
              console.error(error);
            }
          },
          formatDateTime(dateTime) {
            const date = new Date(dateTime);
            let yyyy = date.getFullYear().toString().substring(2,4);
            let mm = date.getMonth() + 1;
            let dd = date.getDate();
            let hh = date.getHours();
            let mi = date.getMinutes();
            let ss = date.getSeconds();

            const formattedDateTime = yyyy+"년"+mm+"월"+dd+"일";
            return formattedDateTime;
        },
      },
  };
  </script>
  <style scoped>
  table {
    border-collapse: separate;
    border-spacing: 0 10px;
    margin-top: -10px; /* correct offset on first border spacing if desired */
  }

  th {
    border: none !important;
    box-shadow: none !important;
  }

  td {
    padding: 20px;
    height: 60px !important;
  }

  td:first-child {
    border-left-style: solid;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  td:last-child {
    border-right-style: solid;
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
  }
  </style>

