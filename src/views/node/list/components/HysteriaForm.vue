<template>
  <div v-if="formVisibleProps">
    <el-form-item
      :label="$t('table.hysteriaProtocol').toString()"
      prop="hysteriaProtocol"
    >
      <el-select
        v-model="nodeProps.hysteriaProtocol"
        :placeholder="$t('table.hysteriaProtocol').toString()"
        controls-position="right"
      >
        <el-option
          :label="item"
          :value="item"
          :key="item"
          v-for="item in hysteriaProtocols"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('table.hysteriaUpMbps').toString()"
      v-if="isHysteria(nodeProps)"
      prop="hysteriaUpMbps"
    >
      <el-input-number
        v-model.number="nodeProps.hysteriaUpMbps"
        controls-position="right"
        type="number"
      />
    </el-form-item>
    <el-form-item
      :label="$t('table.hysteriaDownMbps').toString()"
      v-if="isHysteria(nodeProps)"
      prop="hysteriaDownMbps"
    >
      <el-input-number
        v-model.number="nodeProps.hysteriaDownMbps"
        controls-position="right"
        type="number"
      />
    </el-form-item>
    <el-form-item v-if="isHysteria(nodeProps)">
      <aside>
        {{ $t('table.hysteriaTip') }}
      </aside>
    </el-form-item>
  </div>
</template>

<script>
import { isHysteria } from '@/utils/node'

export default {
  name: 'HysteriaForm',
  props: {
    nodeProps: {
      type: Object,
      require: true
    },
    formVisibleProps: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      hysteriaProtocols: ['udp', 'faketcp']
    }
  },
  methods: {
    isHysteria
  }
}
</script>

<style scoped></style>
