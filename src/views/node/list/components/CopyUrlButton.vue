<template>
  <el-dropdown @command="handleCopyURL">
    <el-button type="primary" size="mini">
      {{ $t('table.nodeURL') }}
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :key="clientType"
        v-for="clientType in clientTypes(nodeProps)"
        :command="clientType"
        >{{ clientType }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { nodeURL } from '@/api/node'
import copy from 'copy-to-clipboard'
import { Message } from 'element-ui'
import { clientTypes } from '@/utils/node'

export default {
  name: 'CopyUrlButton',
  props: {
    nodeId: {
      type: Number,
      require: true
    },
    nodeProps: {
      type: Object,
      require: true
    }
  },
  data() {
    return {}
  },
  methods: {
    clientTypes,
    handleCopyURL(command) {
      nodeURL({ id: this.nodeId, clientType: command }).then((response) => {
        if (copy(response.data)) {
          Message({
            showClose: true,
            message: this.$t('confirm.urlCopySuccess').toString(),
            type: 'success'
          })
        } else {
          Message({
            showClose: true,
            message: this.$t('confirm.urlCopyFail').toString(),
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-button {
  margin-left: 10px;
}

.el-dropdown {
  vertical-align: top;
}

.el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
