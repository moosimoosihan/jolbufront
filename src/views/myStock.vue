<template>
<div class="logo">
        <img :src="require('../assets/logo.png')" @click="gotoMain()">
        </div>
    <main class="mt-3">
        <div class="container">
            <div class="myinfo">
                <div class="buylist_title">
                    <span class="title">MY종목</span>
                    <select class="form-select" aria-label="Default select example" v-model="sort" @change="getOrderList(sort,page)">
                        
                    </select>
                </div>
                <div class="goods">
                    <table class="table" style="width: 100%;">
                        <thead>
                            <tr>
                                <th>종목</th>
                                <th>차트</th>
                                <th>AI</th>
                                <th>현재가</th>
                                <th>시작가</th>
                                <th>등락률</th>
                                <th></th>
                                <th>고가</th>
                                <th>저가</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <p>{{ }}</p>
                                </td>
                                <td>
                                    
                                </td>
                                <td>
                                    <p>{{ }}</p>
                                </td>
                                <td>
                                    <p>{{  }}</p>
                                </td>
                                <td>
                                    <span></span><br>
                                    <span></span><br>
                                    <span style="">최고입찰 : {{  }}</span>
                                    <span >낙찰가 :{{ }}</span><br>
                                </td>
                                <td>
                                    <p>{{  }}</p>
                                </td>
                                <td>
                                    <p>{{  }}</p>
                                </td>
                                <td>
                                    <span>거래 완료</span>
                                 
                                   
                                    
                                </td>
                            </tr>
                            <tr v-if="orderList.length === 0">
                                <td colspan="8">입찰 상품이 없습니다.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="page_container">
                    <button v-if="page>0" class="pageNum" @click="prev()">이전</button>
                    <button v-for="num in getPageNumbers()" :key="num" :id="num==page? 'select':''" class="pageNum" @click="getOrderList(sort,num)">{{num+1}}</button>
                    <button v-if="page<(pageCount-1)" class="pageNum" @click="next()">다음</button>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import axios from 'axios'

    export default {
        name: "buylist",
        data() {
            return {
                // 상품 정보 데이터
                orderList: [],
                succ_bidList: [],
                succ_bid_user_no: [],
                review_count: [],
                order_count: [],

                // 페이지네이션
                page: 0,
                pageCount: 0,

                // 정렬
                sort: 'none',
            }
        },
        computed: {
            user() {
                return this.$store.state.user;
            },
        },
        created() {
            this.getOrderList(this.sort, this.page)
        },
        methods: {
            // 페이지네이션 리밋 5페이지
            getPageNumbers() {
                const groupSize = 5; // 페이지 그룹 크기
                const groupIndex = Math.floor(this.page / groupSize); // 현재 페이지 그룹 인덱스
                const start = groupIndex * groupSize; // 현재 페이지 그룹의 시작 페이지 번호
                const end = Math.min(start + groupSize, this.pageCount); // 현재 페이지 그룹의 마지막 페이지 번호
                return Array.from({length: end - start}, (v, i) => start + i); // 페이지 번호 배열 생성
            },
            // 상품 상세 페이지로 이동
            gotoProduct(index) {
                this.$router.push(`/product/${index}`);
            },
            // 상품 총 갯수
            async getBuyCount() {
                try {
                    const response = await axios.get(`http://localhost:3000/mypage/orderCount/${this.user.user_no}/${this.sort}`);
                    this.pageCount = Math.ceil(response.data.length/10);
                } catch (error) {
                    console.error(error);
                }
            },
            // 상품 정보 가져오기
            async getOrderList(sort, page) {
                try {
                    const response = await axios.get(`http://localhost:3000/mypage/orderlist/${this.user.user_no}/${sort}/${page}`);
                    this.orderList = response.data;
                } catch (error) {
                    console.error(error);
                }
                this.page = page;
                await this.getSuccBid()
                await this.getReviewCount()
                await this.getBuyCount()
                await this.getOrderCount()
            },
            // 낙찰가 가져오기
            async getSuccBid() {
                for(let i=0; i<this.orderList.length; i++){
                    try {
                        const response = await axios.get(`http://localhost:3000/goods/goodsSuccBid/${this.orderList[i].goods_no}`);
                        this.succ_bidList.push(response.data[0].succ_bid)
                        this.succ_bid_user_no.push(response.data[0].user_no)
                    } catch (error) {
                        console.error(error);
                    }
                }
            },
            // 리뷰 갯수 가져오기
            async getReviewCount() {
                for(let i=0; i<this.orderList.length; i++){
                    try {
                        const response = await axios.get(`http://localhost:3000/goods/reviewCount/${this.orderList[i].goods_no}/${this.user.user_no}`);
                        this.review_count.push(response.data[0].count)
                    } catch (error) {
                        console.error(error);
                    }
                }
            },
            // 주문 갯수 가져오기
            async getOrderCount() {
                for(let i=0; i<this.orderList.length; i++){
                    try {
                        const response = await axios.get(`http://localhost:3000/goods/orderCount/${this.orderList[i].goods_no}/${this.user.user_no}`);
                        this.order_count.push(response.data[0].count)
                    } catch (error) {
                        console.error(error);
                    }
                }
            },
            // 가격 콤마 찍기
            formatPrice(price) {
                if (price !== undefined) {
                    const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return `${formattedPrice} 원`;
                }
                return "";
            },
            // 날짜 포맷
            formatDateTime(dateTime) {
                const date = new Date(dateTime);
                const options = {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                };
                const formattedDateTime = date.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });

                return formattedDateTime;
            },
            // 상품 상태 텍스트
            getOrderStatusText(status) {
                switch (status) {
                    case 0:
                        return "경매 중";
                    case 1:
                        return "거래 중";
                    case 2:
                        return "거래 완료";
                    case 3:
                        return "유찰";
                    case 4:
                        return "삭제";
                    default:
                        return "";
                }
            },
            // 리뷰 작성 페이지 이동
            writeReview(goods_no) {
                this.$router.push(`/review/${goods_no}/none`);
            },
            // 거래 완료 처리
            async saleComp(i){
                this.$swal.fire({
                    title: '거래 완료 처리 하시겠습니까?',
                    text: "거래 완료 처리 시 거래완료 상태로 변경됩니다.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '거래 완료 처리',
                    cancelButtonText: '취소'
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.post(`http://localhost:3000/goods/saleComp/${this.orderList[i].goods_no}`);
                            this.$swal({
                                icon: "success",
                                title: "거래 완료 처리 되었습니다.",
                                showConfirmButton: false,
                                timer: 1500,
                            })
                            .then(() => {
                                this.getOrderList(this.sort,this.page);
                                window.location.reload();
                            })
                        } catch (error) {
                            console.error(error);
                        }
                    } else {
                        this.$swal("거래 완료 처리가 취소되었습니다.");
                    }
                })
            },
            // 결제 페이지 이동
            gotoPay(index) {
                this.$router.push(`/payment/${this.orderList[index].goods_no}`);
            },
            // 이전 페이지 이동 버튼
            prev() {
                this.page -= 1;
                this.getOrderList(this.sort,this.page);
            },
            // 다음 페이지 이동 버튼
            next(){
                this.page += 1;
                this.getOrderList(this.sort,this.page)
            },
        }
    }
</script>
<style scoped>
* {
    margin: 0;
    padding: 0;
    border-spacing: 0px;
}

.container {
    margin: 40px 30px;
}
.myinfo{
    margin-top: 30px;
}

.goods .table {
    max-width: 1300px;
    text-align: center;
    background-color: #ffffff;
    border-radius: 10px;
}

.goods .table th {
    text-align: center;
    padding: 20px 0;
}

.goods p {
    width: 120px;
    font-size: 1rem;
    display: inline-block;
    vertical-align: middle;
    padding: 2px;
    padding-top: 10px;
    margin: 20px 30px 16px 0px;
    /* border: 1px solid red; */
}

.goods .detail {
    display: flex;
}

.title {
    font-size: 24px;
}

table {
  border-collapse: collapse;
  width: 500px;
  margin-top: 20px;
  background-color: white;
}

thead{
  box-shadow: 4px 4px 10px rgba(0,0,0,0.1);
}

/* 테이블 행 */
td {
  padding: 1px;
  text-align: left;
  border-bottom: 1px solid black;
  text-align: center;
  height: 40px;
  font-size: 13px;
}

th {
  padding: 3px;
  text-align: left;
  text-align: center;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  color: black;
}
th p {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    grid-area: text;
}

/* 테이블 올렸을 때 */
tbody tr:hover {
  background-color: whitesmoke;
  opacity: 0.9;
  cursor: pointer;
}

/* 테이블 비율 */
th:nth-child(1),
td:nth-child(1) {
  width: 12.5%;
}

th:nth-child(2),
td:nth-child(2) {
  width: 12.5%;
}

th:nth-child(3),
td:nth-child(3) {
  width: 12.5%;
}
th:nth-child(4),
td:nth-child(4) {
  width: 12.5%;
}
th:nth-child(5),
td:nth-child(5) {
  width: 15%;
}
th:nth-child(6),
td:nth-child(6) {
  width: 12.5%;
}
th:nth-child(7),
td:nth-child(7) {
  width: 12.5%;
}
th:nth-child(8),
td:nth-child(8) {
  width: 12.5%;
}

th, td {
  border-left: none;
  border-right: none;
  color: black;
}

tr {
    height: 80px;
}
.form-select {
    width: 100px;
    height: 30px;
    margin-left: 20px;
}
.page_container {
  width: 400px;
  height: 100px;
  margin-left: 50%;
  margin-top: 20px;
}
.page_container button {
  min-width:32px;
  width: 50px;
  height: 40px;
  padding:2px 6px;
  text-align:center;
  margin:0 3px;
  border-radius: 6px;
  border:1px solid #eee;
  color:#666;
  cursor: pointer;
}
#select {
    font-weight: bold;
    font-size: 15px;
}
</style>