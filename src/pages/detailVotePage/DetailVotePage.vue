<template>
  <div id="container" v-if="vote && votingResults.length > 0">
    <div id="backToPrevious">
      <a href="javascript:history.back();">← 前のページに戻る</a>
    </div>
    <div id="voteTitle">{{ vote.title }}</div>
    <div id="voteDescription" class="multiline-text">{{ vote.description }}</div>
    <!-- UserNameContainer Start -->
    <div id="usernameContainer" class="right" v-if="vote.creator">{{ vote.creator }}</div>
    <div id="usernameContainer" class="right" v-else>
      <img src="/static/images/default-user-icon.png" alt="Anonymus" id="usericon" />
      <div id="username">匿名</div>
    </div>
    <!-- UserNameContainerENd -->
    <div class="clear"></div>
    <div id="createdAt" class="right">作成日時:&nbsp;{{ formatDate(vote.created_at) }}</div>
    <div class="clear"></div>
    <div
      id="closingAt"
      class="right"
    >締切:&nbsp;{{ vote.closing_at ? formatDate(vote.closing_at) : '---' }}</div>
    <div class="clear"></div>
    <div id="voteCount" class="right">投票数:&nbsp;{{ vote.vote_count }}</div>
    <div class="clear"></div>
    <!-- VoteButtonContainer Start -->
    <template v-if="!vote.isClosed()">
      <div id="voteButtonContainer" v-if="mode=='VOTING_RESULTS'">
        <a @click="toggleMode();scrollToVotingView();" id="voteButton">この投票に回答する</a>
      </div>
      <div id="voteButtonContainer" v-if="mode=='VOTING'">
        <a @click="toggleMode();" id="voteButton">投票結果に戻る</a>
      </div>
    </template>
    <template v-else>
      <div id="voteButtonContainer" v-if="mode=='VOTING_RESULTS'">
        <span id="voteButton" class="disabled">投票は終了しました</span>
      </div>
    </template>
    <!-- VoteButtonContainer End -->
    <div id="manageLink"><router-link :to="`/manage/${vote.pk}`">このアンケートを編集</router-link></div>
    <div class="border"></div>
    <VotingResultsComponent
      :vote="vote"
      :votingResults="votingResults"
      v-if="mode=='VOTING_RESULTS'"
      ref="VotingResultsComponent"
    />
    <VotingComponent
      :vote="vote"
      :votingResults="votingResults"
      v-if="mode=='VOTING'"
      ref="VotingComponent"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import HelperMixin from "../../utils/HelperMixin.vue";
import VotingResultsComponent from "./VotingResultsComponent.vue";
import VotingComponent from "./VotingComponent.vue";
import { Vote, VotingResult } from "@/models/VoteModels";
import { api } from "@/requests/requests";
import SuguvoteVue from "../../utils/HelperMixin.vue";

enum Mode {
  VOTING_RESULTS = "VOTING_RESULTS",
  VOTING = "VOTING"
}

@Component({
  components: { VotingResultsComponent, VotingComponent }
})
export default class DetailVotePageComponent extends SuguvoteVue {
  vote: Vote | null = null;
  votingResults: VotingResult[] = [];
  charts: Chart[] = [];
  mode: Mode = Mode.VOTING_RESULTS;

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

  toggleMode(): void {
    this.mode =
      this.mode == Mode.VOTING_RESULTS ? Mode.VOTING : Mode.VOTING_RESULTS;
  }

  scrollToVotingView(): void {
    this.$nextTick().then(() => {
      const VotingComponent: Vue = <Vue>this.$refs.VotingComponent;
      VotingComponent.$nextTick().then(() => {
        document.getElementById("votingContainer")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  }
}
</script>

<style lang="scss" scoped>
@import "./detailVotePage";

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
  word-break: break-all;
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
  margin-right: 2rem;
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

#manageLink {
  text-align: right;
}
</style>