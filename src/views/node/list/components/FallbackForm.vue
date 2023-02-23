<template>
  <el-dialog
    :title="textMap[dialogStatus]"
    :visible.sync="dialogFallbackFormVisible"
  >
    <el-form
      ref="dataForm"
      :rules="dialogStatus === 'create' ? createRules : updateRules"
      :model="temp"
      label-position="left"
    >
      <el-form-item label="name" prop="name" clearable>
        <el-input v-model="temp.name" />
      </el-form-item>
      <el-form-item label="alpn" prop="alpn" clearable>
        <el-input v-model="temp.alpn" />
      </el-form-item>
      <el-form-item label="path" prop="path" clearable>
        <el-input v-model="temp.path" />
      </el-form-item>
      <el-form-item label="dest" prop="dest" clearable>
        <el-input v-model="temp.dest" />
      </el-form-item>
      <el-form-item label="xver" prop="xver" clearable>
        <el-input v-model="temp.xver" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'FallbackForm',
  props: {
    temp: {
      type: Object,
      required: true
    },
    dialogStatus: {
      type: String,
      required: true
    },
    dialogFallbackFormVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    const pathPrefixValidate = (rule, value, callback) => {
      if (this.temp.path && !this.temp.path.startsWith('/')) {
        callback(new Error(this.$t('valid.xrayFallbackPathPrefix')))
      } else {
        callback()
      }
    }
    return {
      textMap: {
        update: this.$t('table.edit'),
        create: this.$t('table.add')
      },
      createRules: {
        path: [
          {
            validator: pathPrefixValidate,
            trigger: 'change'
          }
        ],
        dest: [
          {
            required: true,
            message: this.$t('valid.xrayFallbackDest'),
            trigger: 'change'
          }
        ]
      },
      updateRules: {}
    }
  }
}
</script>

<style scoped></style>
