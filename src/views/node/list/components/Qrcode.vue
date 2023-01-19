<template>
  <el-dialog
    :title="$t('table.nodeQRCode')"
    :visible.sync="dialogQRCodeVisible"
  >
    <el-image style="width: 256px; height: 256px" :src="qrCodeSrc"></el-image>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="$emit('update:dialogQRCodeVisible', false)"
      >
        {{ $t('table.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Qrcode',
  props: {
    dialogQRCodeVisible: {
      type: Boolean,
      required: true
    },
    qrCodeSrc: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped></style>
