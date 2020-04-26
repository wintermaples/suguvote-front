<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component"
import dayjs from 'dayjs';

@Component
export default class HelperMixin extends Vue {
  formatDate(date: Date) {
    return dayjs(date).format('YYYY/MM/DD HH:mm');
  }
}
</script>