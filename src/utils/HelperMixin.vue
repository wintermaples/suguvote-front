<script lang="ts">
import Vue, { VueConstructor } from "vue";
import Component from "vue-class-component";
import dayjs from "dayjs";
import { Question, VotingResult } from "@/models/VoteModels";
import { EditQuestionViewFactory } from "@/models/EditQuestionViewFactory";
import { VotingResultOfOneQuestionViewFactory } from "@/models/VotingResultOfOneQuestionViewFactory";
import { VotingOfOneQuestionViewFactory } from "@/models/VotingOfOneQuestionViewFactory";

@Component
export default class SuguvoteVue extends Vue {
  reload(scrollTo: ScrollToOptions|undefined = undefined) {
    if (scrollTo) window.scrollTo(scrollTo);
    this.$router.go(0);
  }

  formatDate(date: Date) {
    return dayjs(date).format("YYYY/MM/DD HH:mm");
  }

  toEditQuestionView(question: Question): VueConstructor<Vue> | undefined {
    return EditQuestionViewFactory.findFactory(question)?.generateComponent(
      question
    );
  }

  toVotingResultOfOneQuestionView(
    question: Question
  ): VueConstructor<Vue> | undefined {
    return VotingResultOfOneQuestionViewFactory.findFactory(
      question
    )?.generateComponent(question);
  }

  toVotingOfOneQuestionView(
    question: Question
  ): VueConstructor<Vue> | undefined {
    return VotingOfOneQuestionViewFactory.findFactory(
      question
    )?.generateComponent(question);
  }
}
</script>