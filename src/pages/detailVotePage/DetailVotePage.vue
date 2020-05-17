<template>
  <div id="container" v-if="vote && votingResults.length > 0">
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
    <div id="voteCount" class="right">回答数:&nbsp;{{ vote.vote_count }}</div>
    <div class="clear"></div>
    <!-- VoteButtonContainer Start -->
    <template v-if="vote.isClosed()">
      <div id="voteButtonContainer">
        <span id="voteButton" class="disabled">回答受付は終了しました</span>
      </div>
    </template>
    <template v-else>
      <template v-if="vote.is_voted_by_you">
        <div id="voteButtonContainer">
          <span id="voteButton" class="disabled">回答済み</span>
        </div>
      </template>
      <template v-else>
        <div id="voteButtonContainer" v-if="mode=='VOTING_RESULTS'">
          <a @click="toggleMode();scrollToVotingView();" id="voteButton">このアンケートに回答する</a>
        </div>
        <div id="voteButtonContainer" v-if="mode=='VOTING'">
          <a @click="toggleMode();" id="voteButton">アンケート結果に戻る</a>
        </div>
      </template>
    </template>
    <!-- VoteButtonContainer End -->
    <div id="sharingButtonsContainer">
      <div class="sharingButtonsInnerContainer">
        <a :href="`https://twitter.com/intent/tweet?text=${getTweetText()}`" target="_blank">
          <img src="/static/images/share_twitter.png" alt id="sharingButton" />
        </a>
        <span id="sharingButton">
          <a
            href="https://b.hatena.ne.jp/entry/"
            class="hatena-bookmark-button"
            data-hatena-bookmark-layout="touch"
            data-hatena-bookmark-width="32"
            data-hatena-bookmark-height="32"
            title="このエントリーをはてなブックマークに追加"
          >
            <img
              src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png"
              alt="このエントリーをはてなブックマークに追加"
              width="32"
              height="32"
              style="border: none;"
            />
          </a>
        </span>
      </div>
      <div class="sharingButtonsInnerContainer">
        <a
          target="_blank"
          :href="`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(getHref())}`"
        >
          <img src="/static/images/share_line.png" alt id="sharingButton" />
        </a>
        <a
          target="_blank"
          :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getHref())}`"
        >
          <img src="/static/images/share_facebook.png" alt id="sharingButton" />
        </a>
      </div>
    </div>
    <div id="manageLink">
      <router-link :to="`/manage/${vote.pk}`">このアンケートを編集</router-link>
    </div>
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
    <div id="sharingDialog" class="dialog" :class="{ 'dialog-show': isOpenedSharingModal() }">
      <div class="dialog-contents">
        <div id="sharingModalTitle">アンケートをシェア</div>
        <div id="sharingButtonsContainer">
          <div class="sharingButtonsInnerContainer">
            <a :href="`https://twitter.com/intent/tweet?text=${getTweetText()}`" target="_blank">
              <img src="/static/images/share_twitter.png" alt id="sharingButton" />
            </a>
            <span id="sharingButton">
              <a
                href="https://b.hatena.ne.jp/entry/"
                class="hatena-bookmark-button"
                data-hatena-bookmark-layout="touch"
                data-hatena-bookmark-width="48"
                data-hatena-bookmark-height="48"
                title="このエントリーをはてなブックマークに追加"
              >
                <img
                  src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png"
                  alt="このエントリーをはてなブックマークに追加"
                  width="48"
                  height="48"
                  style="border: none;"
                />
              </a>
            </span>
          </div>
          <div class="sharingButtonsInnerContainer">
            <a
              target="_blank"
              :href="`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(getHref())}`"
            >
              <img src="/static/images/share_line.png" alt id="sharingButton" />
            </a>
            <a
              target="_blank"
              :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getHref())}`"
            >
              <img src="/static/images/share_facebook.png" alt id="sharingButton" />
            </a>
          </div>
        </div>
        <div id="sharingModalCaption">アイコンをクリックして今すぐこのアンケートをシェアできます</div>
      </div>
      <div class="dialog-margin" @click="toggleIsOpenedSharingModal()"></div>
    </div>
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
import { suguvoteUIModule } from "@/store/modules/SuguvoteUIModule";

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

  isOpenedSharingModal(): boolean {
    return suguvoteUIModule.isOpenedSharingModal;
  }

  toggleIsOpenedSharingModal() {
    suguvoteUIModule.toggleIsOpenedSharingModal();
  }

  getHref() {
    return window.location.href;
  }

  getTweetText() {
    return encodeURIComponent(`アンケートをシェアしました！
${this.vote?.title}
${this.getHref()}
#suguvote
#アンケート`);
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
  a {
    text-decoration: none;
    color: #999;
  }
}

#sharingModalTitle {
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  margin: 1rem;
}

#sharingModalCaption {
  text-align: center;
  margin: 1rem;
}

#sharingButtonsContainer {
  margin: 0.5rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
}

#sharingButton {
  width: 32px;
  margin: 0.25rem;
}

#sharingDialog #sharingButtonsContainer {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

#sharingDialog #sharingButton {
  width: 48px;
  margin: 1rem;
}

.sharingButtonsInnerContainer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>