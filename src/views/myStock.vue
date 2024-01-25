<template>
    <h1>MY 종목</h1>
    <v-data-table
      v-model:expanded="expanded"
      :headers="FinancialHeaders"
      :items="Financial"
      item-value="name"
      show-expand
      show-select
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>난부자야</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">차트 {{ item.name }}</td>
        </tr>
      </template>
    </v-data-table>
  </template>
  
  <script>
    export default {
      data() {
        return {
          expanded: [],
          FinancialHeaders: [
            {
              title: '종목명',
              align: 'start',
              sortable: false,
              key: 'name',
            },
            { title: '현재가', key: 'Current' },
            { title: '전일비', key: 'previous' },
            { title: '등락률', key: 'fluctuation' },
            { title: '시가', key: 'market' },
            { title: '고가', key: 'high' },
            { title: '저가', key: 'low' },
            { title: '', key: 'data-table-expand' },
          ],
          Financial: [
            {
              name: '나이박 주식회사',
              Current: 4000,
              previous: 3323,
              fluctuation: -4.2,
              market: 3502,
              high:5002,
              low:2302,
            },
            {
              name: '고굴',
              Current: 3394,
              previous: 3202,
              fluctuation: 4.3,
              market: 2302,
              high:4929,
              low:2203,
            },
            {
              name: '샘숭',
              Current: 3828,
              previous: 1292,
              fluctuation: 5.2,
              market: 3020,
              high:5020,
              low:2928,
            },
            {
              name: '사과',
              Current: 2020,
              previous: 1828,
              fluctuation: 4.3,
              market: 3932,
              high:4402,
              low:2929,
            },
            {
              name: '국밥천국',
              Current: 9391,
              previous: 3383,
              fluctuation: 3.3,
              market: 3362,
              high:1919,
              low:2902,
            },
            {
              name: '졸부',
              Current: 3733,
              previous: 1911,
              fluctuation: -1.1,
              market: 2822,
              high:2910,
              low:1292,
            },
            {
              name: '고프다',
              Current: 4929,
              previous: 1912,
              fluctuation: 0,
              market: 2293,
              high:2938,
              low:1020,
            },
            {
              name: '뚝스딱스',
              Current: 3932,
              previous: 2929,
              fluctuation: 6.5,
              market: 3930,
              high:4020,
              low:1019,
            },
            {
              name: '고-도넛',
              Current: 2929,
              previous: 2092,
              fluctuation: 4.9,
              market: 2929,
              high:1010,
              low:2029,
            },
            {
              name: '초콜렛공장',
              Current: 5053,
              previous: 4959,
              fluctuation: 7,
              market: 3849,
              high:5605,
              low:4903,
            },
          ],
        }
      },
      methods: {
        deleteItem(item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm() {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      }
    }
  </script>
  