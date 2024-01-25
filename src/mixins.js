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
        // 소수점 제거
        value = Math.floor(value);
        const formattedPrice = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `${formattedPrice} 원`;
      }
      return "";
    },
    $formatDateTime(dateTime) {
      const date = new Date(dateTime);
      const formattedDateTime = date.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });

      return formattedDateTime;
    },
  }
}
