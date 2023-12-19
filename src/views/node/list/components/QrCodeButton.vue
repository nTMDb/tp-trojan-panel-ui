<template>
  <div>
    <el-dropdown @command="handleQRCode">
      <el-button type="primary" size="mini">
        {{ $t('table.nodeQRCode') }}
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          :key="clientType"
          v-for="clientType in clientTypes"
          :command="clientType"
          >{{ clientType }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <NodeQrcode
      :qr-code-src-props="qrCodeSrc"
      :dialog-visible-props.sync="dialogQRCodeVisible"
    />
  </div>
</template>

<script>
import { nodeQRCode } from '@/api/node'
import NodeQrcode from '@/views/node/list/components/NodeQrcode.vue'
import { clientTypes } from '@/utils/node'

export default {
  name: 'QrCodeButton',
  components: { NodeQrcode },
  props: {
    nodeId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      clientTypes,
      qrCodeSrc: '',
      dialogQRCodeVisible: false
    }
  },
  methods: {
    handleQRCode(command) {
      this.qrCodeSrc = ''
      nodeQRCode({ id: this.nodeId, clientType: command }).then((response) => {
        this.qrCodeSrc = 'data:image/png;base64,' + response.data
        this.dialogQRCodeVisible = true
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
