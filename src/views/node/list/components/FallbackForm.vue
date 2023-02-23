<template>
  <el-dialog
    :title="$t('table.add')"
    :visible="dialogFallbackFormVisible"
    @close="$emit('update:dialogFallbackFormVisible', false)"
    width="30%"
  >
    <el-form
      ref="dataForm"
      :rules="createRules"
      :model="fallback"
      label-position="left"
    >
      <el-form-item label="name" prop="name">
        <el-input v-model="fallback.name" clearable />
      </el-form-item>
      <el-form-item label="alpn" prop="alpn">
        <el-input v-model="fallback.alpn" clearable />
      </el-form-item>
      <el-form-item label="path" prop="path">
        <el-input v-model="fallback.path" clearable />
      </el-form-item>
      <el-form-item label="dest" prop="dest">
        <el-input v-model="fallback.dest" clearable />
      </el-form-item>
      <el-form-item label="xver" prop="xver">
        <el-input-number
          v-model.number="fallback.xver"
          controls-position="right"
          type="number"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogFallbackFormVisible', false)"
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
    fallback: {
      type: Object,
      required: true
    },
    createFallback: {
      type: Function,
      required: true
    },
    dialogFallbackFormVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    const pathPrefixValidate = (rule, value, callback) => {
      if (this.fallback.path && !this.fallback.path.startsWith('/')) {
        callback(new Error(this.$t('valid.xrayFallbackPathPrefix')))
      } else {
        callback()
      }
    }
    const xverValidate = (rule, value, callback) => {
      if (
        this.fallback.xver !== 0 &&
        this.fallback.xver !== 1 &&
        this.fallback.xver !== 2
      ) {
        callback(new Error(this.$t('valid.xrayFallbackXver')))
      } else {
        callback()
      }
    }
    return {
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
    clearValidate() {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.createFallback(this.fallback)
          this.$emit('update:dialogFallbackFormVisible', false)
        }
      })
    }
  }
}
</script>

<style scoped></style>
