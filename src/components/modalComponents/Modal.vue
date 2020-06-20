<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class Modal extends Vue {
  @Prop()
  isOpened: Readonly<boolean> = false;

  close(): void {
    this.$emit('close');
  }
}
</script>