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
  name: 'Dashboard',
  components: { adminDashboard, userDashboard },
  data() {
    return {
      currentRole: 'userDashboard'
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    if (this.roles.includes('admin')) {
      this.currentRole = 'adminDashboard'
    }
  }
}
</script>

<style scoped></style>
