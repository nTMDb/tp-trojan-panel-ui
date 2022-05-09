<template>
  <div class='app-container'>
    <div class='filter-container'>
      <el-input
        v-model='listQuery.toEmail'
        :placeholder="$t('table.toEmail')"
        style='width: 200px'
        class='filter-item'
        clearable
        @keyup.enter.native='handleFilter'
        @clear='handleFilter'
      />
      <el-button
        class='filter-item'
        type='primary'
        icon='el-icon-search'
        @click='handleFilter'
      >
        {{ $t('table.search') }}
      </el-button>
    </div>
    <el-table
      :key='tableKey'
      v-loading='listLoading'
      :data='list'
      border
      fit
      highlight-current-row
      style='width: 100%'
    >
      <el-table-column
        :label="$t('table.id')"
        sortable='custom'
        align='center'
        width='80'
        type='index'
      />
      <el-table-column :label="$t('table.toEmail')" width='180' align='center'>
        <template slot-scope='{ row }'>
          <span>{{ row.toEmail }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.subject')" width='180' align='center'>
        <template slot-scope='{ row }'>
          <span>{{ row.subject }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.content')" width='180' align='center'>
        <template slot-scope='{ row }'>
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.state')"
        width='140'
        align='center'
      >
        <template slot-scope='{ row }'>
          <el-tag :type='row.state | stateFilter'>
            {{ stateDesc(row.state) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.createTime')"
        width='180'
        align='center'
      >
        <template slot-scope='{ row }'>
          <span>{{ timeStampToDate(row.createTime, false) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show='total > 0'
      :total='total'
      :page.sync='listQuery.pageNum'
      :limit.sync='listQuery.pageSize'
      @pagination='getList'
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js'
import { timeStampToDate } from '@/utils'
import { selectEmailRecordPage } from '@/api/email-record'

export default {
  name: 'Record',
  components: { Pagination },
  directives: { permission },
  filters: {
    stateFilter(state) {
      let stateMap = new Map()
      map.set(-1, 'danger')
      map.set(0, 'warn')
      map.set(1, 'success')
      return stateMap[state]
    }
  },
  computed: {
    stateDesc: function(state) {
      let map = new Map()
      map.set(-1, '发送失败')
      map.set(0, '等待发送')
      map.set(1, '发送成功')
      return map[state]
    }
  },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        toEmail: ''
      },
      temp: {
        id: undefined,
        toEmail: '',
        subject: '',
        content: '',
        state: 0,
        createTime: new Date()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    timeStampToDate,
    getList() {
      this.listLoading = true
      selectEmailRecordPage(this.listQuery).then((response) => {
        this.list = response.data.emailRecords
        this.total = response.data.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    }
  }
}
</script>

<style scoped></style>