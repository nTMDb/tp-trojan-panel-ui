<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import adminDashboard from './admin'
import userDashboard from './user'
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  components: { adminDashboard, userDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters(['roleNames'])
  },
  created() {
    if (!this.roleNames.includes('admin')) {
      this.currentRole = 'userDashboard'
    }
  }
}
</script>

<style scoped></style>
