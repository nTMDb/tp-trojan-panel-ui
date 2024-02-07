<template>
  <div>
    <el-tag
      :key="item"
      v-for="item in arrayProps"
      closable
      @close="handleClose(tag)"
    >
      {{ item }}
    </el-tag>
    <el-input
      v-model="pathItem"
      @keyup.enter="handleConfirm"
      @blur="handleConfirm"
    />
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    arrayProps: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      pathItem: ''
    }
  },
  methods: {
    handleConfirm() {
      this.arrayProps.push(this.pathItem)
    }
  }
}
</script>

<style scoped></style>
