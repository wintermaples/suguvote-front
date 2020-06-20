import { DATETIME_FORMAT } from "@/const/CommonConst";
import { EditQuestionViewFactory } from "@/factories/EditQuestionViewFactory";
import { Question } from "@/entities/VoteEntities";
import { VotingOfOneQuestionViewFactory } from "@/factories/VotingOfOneQuestionViewFactory";
import { VotingResultOfOneQuestionViewFactory } from "@/factories/VotingResultOfOneQuestionViewFactory";
import dayjs from "dayjs";
import Vue, { VueConstructor } from "vue"
import { suguvotePageModule } from "@/store/modules/SuguvotePageModule";
import { suguvoteSessionModule } from "@/store/modules/SuguvoteSessionModule";

abstract class AbstractSuguvoteVue extends Vue {
  reload(scrollTo: ScrollToOptions | undefined = undefined) {
    if (scrollTo) window.scrollTo(scrollTo);
    this.$router.go(0);
  }

  formatDate(date: Date) {
    return dayjs(date).format(DATETIME_FORMAT);
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

  omitTooLongLines(
    text: string,
    maxLine: number = 5,
    ellipsis_text = "..."
  ): string {
    const lines: string[] = text.split("\n");
    const linesOmitted: string[] = lines.slice(0, maxLine);
    if (lines.length > maxLine) linesOmitted.push(ellipsis_text);
    return linesOmitted.join("\n");
  }

  omitTooLongString(
    text: string,
    maxLength: number = 48,
    ellipsis_text = "..."
  ): string {
    if (text.length > maxLength)
      return text.substr(0, maxLength) + ellipsis_text;
    else return text;
  }
}

export abstract class SuguvotePageVue extends AbstractSuguvoteVue {

  constructor() {
    super();
    suguvotePageModule.switchCurrentPage(this);
    suguvoteSessionModule.fetchIsLoggedIn();
  }

  getTitleSuffix(): string|null {
    return null;
  }

  getDescription(): string|null {
    return null;
  }

  canSetTitleSuffix(): boolean {
    return true;
  }

  canSetDescription(): boolean {
    return true;
  }
}

export abstract class SuguvoteComponentVue extends AbstractSuguvoteVue {
}