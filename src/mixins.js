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
        const formattedPrice = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `${formattedPrice} 원`;
      }
      return "";
    }
  }
}
