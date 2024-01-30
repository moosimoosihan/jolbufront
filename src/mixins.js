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
  }
}
