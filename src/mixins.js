import axios from 'axios'

export default {
  methods: {
    async $api(url, data){
      return (await axios({
        method: 'post',
        url,
        data
      }).catch(e => {
        console.log(e)
      })).data
    },
    $base64(file){
      return new Promise(resolve => {
        var a = new FileReader()
        a.onload = e => resolve(e.target.result)
        a.readAsDataURL(file)
      })
    },
    $currencyFormat(value){
      if (value !== undefined) {
        // 소수점이 너무 길다면 소수점 2자리까지만 표시 100원 이상 -100원 이하라면 그대로 콤마 표시
        if(value < 100 && value > -100) {
          const formattedPrice = Number(value).toFixed(2);
          return `${formattedPrice} 원`;
        }
        // 100원 이상 -100원 이하라면 콤마 표시
        const formattedPrice = Number(value).toLocaleString('ko-KR');
        return `${formattedPrice} 원`;
      }
      return "";
    },
    $formatDateTime(dateTime, hour) {
      const date = new Date(dateTime);
      let yyyy = date.getFullYear().toString().substring(2,4);
      let mm = date.getMonth() + 1;
      let dd = date.getDate();
      let hh = date.getHours();
      let mi = date.getMinutes();
      let ss = date.getSeconds();

      if(hour) {
        const formattedDateTime = dd+"."+hh+":"+mi;
        return formattedDateTime;
      } else {
        const formattedDateTime = yyyy+"."+mm+"."+dd;
        return formattedDateTime;
      }
    },
    $usersocial(num){
      switch(num){
        case 0:
          return 'Local'
        case 1:
          return 'Kakao'
        case 2:
          return 'Never'
      }
    }
  }
}
