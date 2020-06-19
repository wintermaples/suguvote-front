<template>
  <form id="votingContainer">
    <div class="voting-of-one-question" v-for="(question, questionIndex) in vote.questions">
      <div class="question-title">Q{{ questionIndex + 1}}.&nbsp;{{ question.title }}</div>
      <component
        class="voting-of-one-question-view"
        :is="toVotingOfOneQuestionView(question)"
        :question="question"
        :voteAnswer="voteAnswers[questionIndex]"
        :questionIndex="questionIndex"
      />
    </div>
    <div id="voteButtonContainer">
      <a @click="showConfirmationVoteAnswerDialog()" id="voteButton">以上の内容で回答する</a>
    </div>

    <div
      id="confirmationDialog"
      class="dialog"
      :class="{ 'dialog-show': isShowingConfimationDialog }"
    >
      <div class="dialog-contents">
        <div id="voteButtonContainer">
          <a id="voteButton" @click="sendVoteAnswer()">回答を送信</a>
        </div>
        <div class="recaptcha-brand">
          This site is protected by reCAPTCHA and the Google
          <a
            href="https://policies.google.com/privacy"
          >Privacy Policy</a> and
          <a href="https://policies.google.com/terms">Terms of Service</a> apply.
        </div>
      </div>
      <div class="dialog-margin" @click="isShowingConfimationDialog=false"></div>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Vote, VotingResult } from "@/models/VoteModels";
import { VoteAnswersFactory, VoteAnswer } from "@/models/VoteAnswerModels";
import { classToPlain } from "class-transformer";
import SuguvoteVue from "@/utils/SuguvoteVue.vue";
import { SuguvoteComponentVue } from "@/SuguvoteVue";
import { ReCAPTCHAHelpers } from "@/helpers/ReCAPTCHAHelpers";
import { api } from "@/requests/requests";

@Component
export default class VotingComponent extends SuguvoteComponentVue {
  @Prop()
  vote?: Readonly<Vote>;
  @Prop()
  votingResults?: Readonly<VotingResult[]>;

  voteAnswers: VoteAnswer[] | null = null;

  isShowingConfimationDialog: boolean = false;

  created() {
    if (!this.vote || !this.votingResults) return;

    this.voteAnswers = VoteAnswersFactory.generate(this.vote.questions);
  }

  showConfirmationVoteAnswerDialog() {
    const form: HTMLFormElement|null = <HTMLFormElement> document.getElementById('votingContainer') ?? null;
    if (!form?.reportValidity()) 
      return;

    this.isShowingConfimationDialog = true;
  }

  async sendVoteAnswer() {
    if (!this.vote || !this.votingResults || !this.voteAnswers) return;

    const recaptcha_token: string = await ReCAPTCHAHelpers.getReCAPTCHAToken();
    const votingResults: VotingResult[] = await api.votes.votingResults.post(parseInt(this.vote.pk ?? '-1'), this.voteAnswers, recaptcha_token);
    this.reload({left: 0, top: 0});
  }
}
</script>

<style lang="scss" scoped>
@import "./detailVotePage";

.voting-of-one-question {
  margin-top: 75px;
}

.question-title {
  font-size: 130%;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>