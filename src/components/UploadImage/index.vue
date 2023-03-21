<template>
  <el-upload
    list-type="picture-card"
    ref="upload"
    action=""
    :file-list="fileList"
    :auto-upload="false"
    accept=".png"
    :on-change="handleChange"
    :before-upload="beforeUpload"
    :limit="1"
  >
    <i slot="default" class="el-icon-plus"></i>
    <div slot="file" slot-scope="{ file }">
      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
      <span class="el-upload-list__item-actions">
        <span class="el-upload-list__item-delete" @click="handleRemove(file)">
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </div>
    <div slot="tip" class="el-upload__tip">
      {{ $t('config.imageFileTip') }}
    </div>
  </el-upload>
</template>

<script>
import { Message } from 'element-ui'

export default {
  name: 'index',
  props: {
    fileRawList: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      fileList: [{ name: 'logo.png', url: '/api/image/logo' }]
    }
  },
  methods: {
    handleRemove(file) {
      this.fileList = []
      this.$emit('update:fileRawList', [])
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 3

      if (!isJPG) {
        Message({
          message: this.$t('confirm.uploadWebFileFormat'),
          type: 'error',
          duration: 5 * 1000
        })
      }
      if (!isLt2M) {
        Message({
          message: this.$t('confirm.uploadWebFileSize'),
          type: 'error',
          duration: 5 * 1000
        })
      }
      return isJPG && isLt2M
    },
    handleChange(file, fileList) {
      // 上传自动覆盖
      this.$emit('update:fileRawList', [file.raw])
      this.fileList = [file]
    }
  }
}
</script>
<style></style>
