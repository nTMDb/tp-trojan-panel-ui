<template>
  <el-dialog
    :title="$t('table.detail')"
    :visible="dialogVisible"
    @close="$emit('update:dialogVisible', false)"
    width="30%"
  >
    <el-form :model="fallback" label-position="left">
      <el-form-item label="name">
        <el-tag>{{ fallback.name }}</el-tag>
      </el-form-item>
      <el-form-item label="alpn">
        <el-tag>{{ fallback.alpn }}</el-tag>
      </el-form-item>
      <el-form-item label="path">
        <el-tag>{{ fallback.path }}</el-tag>
      </el-form-item>
      <el-form-item label="dest">
        <el-tag>{{ fallback.dest }}</el-tag>
      </el-form-item>
      <el-form-item label="xver">
        <el-tag>{{ fallback.xver }}</el-tag>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="$emit('update:dialogVisible', false)"
        >{{ $t('table.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'FallbackInfo',
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    fallback: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
