<template>
  <div id="container" v-if="vote && votingResults.length > 0">
    <div id="backToPrevious">
      <a href="javascript:history.back();">← 前のページに戻る</a>
    </div>
    <div id="voteTitle">{{ vote.title }}</div>
    <div id="voteDescription" class="multiline-text">{{ vote.description }}</div>
    <!-- UserNameContainer Start -->
    <div id="usernameContainer" class="right" v-if="vote.creator">
      {{ vote.creator }}
    </div>
    <div id="usernameContainer" class="right" v-else>
      <img src="/static/images/default-user-icon.png" alt="Anonymus" id="usericon">
      <div id="username">匿名</div>
    </div>
    <!-- UserNameContainerENd -->
    <div class="clear"></div>
    <div id="createdAt" class="right">作成日時:&nbsp;{{ formatDate(vote.created_at) }}</div>
    <div class="clear"></div>
    <div id="closingAt" class="right">締切:&nbsp;{{ formatDate(vote.closing_at) }}</div>
    <div class="clear"></div>
    <div id="voteCount" class="right">投票数:&nbsp;{{ vote.vote_count }}</div>
    <div class="clear"></div>
    <div id="voteButtonContainer">
      <router-link to id="voteButton">この投票に回答する</router-link>
    </div>
    <div id="voteBorder"></div>
    <div id="votingResultsContainer">
      <div class="votingResultOfOneQuestion" v-for="(question, questionIndex) in vote.questions">
        <div class="question-title">Q{{ questionIndex + 1}}.&nbsp;{{ question.title }}</div>
        <component
          class="voting-result-of-one-question-view"
          :is="toVotingResultOfOneQuestionView(question)"
          :question="question"
          :votingResult="votingResults[questionIndex]"
          :index="questionIndex"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Vote, VotingResult, Question } from "@/models/VoteModels";
import { api } from "@/requests/requests";
import { plainToClass } from "class-transformer";
import { planningChartBackgroundColorScheme } from "@/utils/ChartUtil";
import Chart, { ChartConfiguration } from "chart.js";
import { VotingResultChartGenerator } from "@/chart/VotingResultChart";
import HelperMixin from "../../utils/HelperMixin.vue";

@Component({
  mixins: [HelperMixin]
})
export default class DetailVotePageComponent extends Vue {
  vote: Vote | null = null;
  votingResults: VotingResult[] = [];
  charts: Chart[] = [];

  async created() {
    try {
      this.vote = await api.votes.retrieve(parseInt(this.$route.params.id));
      this.votingResults = await api.votes.votingResults.retrieve(
        parseInt(this.$route.params.id)
      );
    } catch (err) {
      console.log(err);
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  max-width: 1024px;
  margin: auto;
}

#voteTitle {
  width: 100%;
  border-bottom: 2px solid #7a7a7a;
  margin-top: 50px;
  font-size: 187.5%;
  font-weight: bold;
}

#voteDescription {
  margin: 20px auto;
}

#usernameContainer {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#usericon {
  width: 32px;
  max-width: 32px;
  max-height: 32px;
  height: auto;
  margin-right: 2em;
}

#username {
  font-weight: bold;
  font-size: 130%;
}

#createdAt,
#closingAt,
#voteCount {
  font-size: 87.5%;
  color: #606060;
}

#voteButtonContainer {
  margin: 132px auto;
  text-align: center;
}

#voteButton {
  text-decoration: inherit;
  border-radius: 4px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  padding: 1em 5em;
  background-color: #4c7a34;
  color: white;
  font-weight: bold;

  transition: box-shadow 0.2s, background-color 0.2s;

  &:hover {
    background-color: #5c8a44;
    box-shadow: 5px 5px 7px rgba(0, 0, 0, 0.5);
  }

  &:active {
    background-color: #3c6a24;
    box-shadow: 3px 3px 1px rgba(0, 0, 0, 0.5);
  }
}

#voteBorder {
  width: 100%;
  border-top: 1px solid #c0c0c0;
}

.votingResultOfOneQuestion {
  margin-top: 75px;
}

.question-title {
  font-size: 130%;
  font-weight: bold;
  margin-bottom: 20px;
}

.voting-result-of-one-question-view {
  width: 600px;
}
</style>