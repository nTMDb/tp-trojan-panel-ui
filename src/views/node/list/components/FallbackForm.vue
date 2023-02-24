<template>
  <el-dialog
    :title="$t('table.add')"
    :visible="dialogVisible"
    @close="$emit('update:dialogVisible', false)"
    width="30%"
  >
    <el-form
      ref="dataForm"
      :rules="createRules"
      :model="temp"
      label-position="left"
    >
      <el-form-item label="name" prop="name">
        <el-input v-model="temp.name" clearable />
      </el-form-item>
      <el-form-item label="alpn" prop="alpn">
        <el-input v-model="temp.alpn" clearable />
      </el-form-item>
      <el-form-item label="path" prop="path">
        <el-input v-model="temp.path" clearable />
      </el-form-item>
      <el-form-item label="dest" prop="dest">
        <el-input v-model="temp.dest" clearable />
      </el-form-item>
      <el-form-item label="xver" prop="xver">
        <el-input-number
          v-model.number="temp.xver"
          controls-position="right"
          type="number"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogVisible', false)"
        >{{ $t('table.cancel') }}
      </el-button>
      <el-button type="primary" @click="createData()">
        {{ $t('table.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'FallbackForm',
  props: {
    createFallback: {
      type: Function,
      required: true
    },
    dialogVisible: {
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
    const xverValidate = (rule, value, callback) => {
      if (
        this.temp.xver !== 0 &&
        this.temp.xver !== 1 &&
        this.temp.xver !== 2
      ) {
        callback(new Error(this.$t('valid.xrayFallbackXver')))
      } else {
        callback()
      }
    }
    return {
      temp: {
        name: '',
        alpn: '',
        path: undefined,
        dest: '80',
        xver: 0
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
        ],
        xver: [
          {
            validator: xverValidate,
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    resetTemp() {
      this.temp = {
        name: '',
        alpn: '',
        path: undefined,
        dest: '80',
        xver: 0
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = {
            name: this.temp.name,
            alpn: this.temp.alpn,
            dest: this.temp.dest,
            xver: this.temp.xver
          }
          // path以/开头否则不传改字段
          if (
            this.temp.path &&
            this.temp.path !== '' &&
            this.temp.path.startsWith('/')
          ) {
            tempData.path = this.temp.path
          }
          this.createFallback(tempData)
          this.$emit('update:dialogVisible', false)
        }
      })
    }
  }
}
</script>

<style scoped></style>
