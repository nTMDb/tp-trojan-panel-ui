<template>
  <div class="app-container">
    <el-upload
      class="upload-demo"
      ref="upload"
      action=""
      :file-list="fileList"
      :http-request="uploadFile"
      :auto-upload="false"
      accept=".zip"
      :on-change="handleChange"
      :before-upload="beforeUpload"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="submitUpload"
        :disabled="fileList.length === 0"
        >上传到服务器
      </el-button>
      <div slot="tip" class="el-upload__tip">
        文件格式只支持.zip，且大小不能超过10MB
      </div>
    </el-upload>
  </div>
</template>

<script>
import { uploadWebFile } from '@/api/system'
import { Message } from 'element-ui'

export default {
  name: 'web-file',
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    uploadFile(params) {
      let formData = new FormData()
      formData.append('file', params.file)
      uploadWebFile(formData).then(() => {
        this.$notify({
          title: 'Success',
          message: '上传成功',
          type: 'success',
          duration: 2000
        })
      })
      this.fileList = []
    },
    handleChange(file, fileList) {
      // 上传自动覆盖
      this.fileList = [file]
    },
    beforeUpload(file) {
      if (!file.name.endsWith('.zip')) {
        Message({
          message: '文件格式只支持.zip',
          type: 'error',
          duration: 5 * 1000
        })
        return false
      }
      if (file.size / 1024 / 1024 > 10) {
        Message({
          message: '文件大小不能超过10MB',
          type: 'error',
          duration: 5 * 1000
        })
        return false
      }
    }
  }
}
</script>

<style scoped></style>
