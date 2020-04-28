<script lang="ts">
import Vue, { VueConstructor } from "vue";
import Component from "vue-class-component"
import dayjs from 'dayjs';
import { Question, VotingResult } from "@/models/VoteModels";
import { EditQuestionViewFactory } from "@/models/EditQuestionViewFactory";
import { VotingResultOfOneQuestionViewFactory } from "@/models/VotingResultOfOneQuestionViewFactory";

@Component
export default class HelperMixin extends Vue {
  formatDate(date: Date) {
    return dayjs(date).format('YYYY/MM/DD HH:mm');
  }

  toEditQuestionView(question: Question): VueConstructor<Vue>|undefined {
    return EditQuestionViewFactory.findFactory(question)?.generateComponent(question);
  }

  toVotingResultOfOneQuestionView(question: Question): VueConstructor<Vue>|undefined {
    return VotingResultOfOneQuestionViewFactory.findFactory(question)?.generateComponent(question);
  }
}
</script>