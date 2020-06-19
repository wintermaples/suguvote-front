<template>
  <form id="manageVoteForm">
    <div id="title">アンケートを編集</div>
    <template v-if="vote">
      <div class="field">
        <label class="field-title" for="title">タイトル</label>
        <br />
        <input
          type="text"
          name="title"
          id="form-title"
          class="field-input wide-input"
          required
          maxlength="256"
          v-model="vote.title"
        />
      </div>
      <div class="field">
        <label class="field-title" for="description">説明文</label>
        <br />
        <textarea
          name="desctiption"
          id="form-description"
          class="field-input wide-input"
          required
          maxlength="512"
          v-model="vote.description"
        ></textarea>
      </div>
      <div class="field">
        <label class="field-title" for="tag">タグ</label>
        <br />
        <input
          type="text"
          name="tag"
          id="form-tag"
          class="field-input"
          maxlength="10"
          v-model="tagField"
        />
        <button class="tag-button" @click="addTag()" type="button">+</button>
        <div class="vote-tags">
          <span class="vote-tag" v-for="tag in vote.tags" :key="tag">
            {{ tag }}
            <span class="tag-delete-button" @click="deleteTag(tag)">×</span>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="field-title" for="closingAt">締切</label>
        <br />
        <datetime
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          :min-datetime="`${(new Date()).toISOString()}`"
          :value="vote.closing_at"
          @input="vote.closing_at = $event ? $event : null"
        ></datetime>
      </div>
      <div class="field">
        <label class="field-title" for="password">
          編集用パスワード
          <span class="required">※</span>
        </label>
        <br />
        <input
          type="password"
          name="password"
          id="form-password"
          class="field-input wide-input"
          required
          maxlength="256"
          v-model="vote.password"
        />
      </div>
      <div id="submitButtonsContainer">
        <a id="updateButton" @click="updateVote()">
          <div class="btn btn-small btn-color-green filled shadow m1">アンケートを更新する</div>
        </a>
        <a id="deleteButton" @click="isShowingConfimationDialog = !isShowingConfimationDialog">
          <div class="btn btn-small btn-color-red m1">アンケートを削除する</div>
        </a>
      </div>
    </template>
    <div
      id="confirmationDialog"
      class="dialog"
      :class="{ 'dialog-show': isShowingConfimationDialog }"
    >
      <div class="dialog-contents">
        <div id="confirmDeletingButtonContainer">
          本当に削除しますか？
          <a id="confirmDeletingButton" @click="deleteVote()">
            <div class="btn btn-small btn-color-red m1">アンケートを削除する</div>
          </a>
        </div>
      </div>
      <div class="dialog-margin" @click="isShowingConfimationDialog=false"></div>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Vote, VotingResult } from "@/entities/VoteEntities";
import { api } from "@/requests/requests";
import { MAX_TAG_NUM } from "@/const/LimitConst";
import { SuguvotePageVue } from "@/SuguvoteVue";

@Component
export default class ManageVotePageComponent extends SuguvotePageVue {
  vote: Vote | null = null;
  votingResults: VotingResult[] = [];
  tagField: string = "";
  isShowingConfimationDialog: boolean = false;

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

  async updateVote() {
    if (!this.vote) return;
    const form: HTMLFormElement | null =
      <HTMLFormElement>document.getElementById("manageVoteForm") ?? null;
    if (!form?.reportValidity()) return;

    try {
      const updatedVote: Vote = await api.votes.update(this.vote);
      const pk = updatedVote["pk"];
      this.$router.push(`/detail/${pk}`);
    } catch (err) {
      console.log(err);
    }
  }

  async deleteVote() {
    if (!this.vote) return;
    if (!this.vote.pk) return;
    if (!this.vote.password) return;

    try {
      await api.votes.delete(parseInt(this.vote.pk), this.vote.password);
      this.$router.push("/list/");
    } catch (err) {
      console.log(err);
    }
  }

  addTag() {
    if (!this.vote) return;
    if (!this.tagField) return;
    if (this.vote.tags.some(t => t == this.tagField)) return;
    if (!this.canAddTag()) return;
    this.vote.tags.push(this.tagField);
    this.tagField = "";
  }

  deleteTag(tag: string) {
    if (!this.vote) return;
    this.vote.tags = this.vote.tags.filter(t => t != tag);
  }

  canAddTag(): boolean {
    if (!this.vote) return false;
    return this.vote.tags.length < MAX_TAG_NUM;
  }
}
</script>

<style lang="scss" scoped>
#manageVoteForm {
  max-width: 1024px;
  margin: auto;
}

#title {
  width: 100%;
  border-bottom: 2px solid #7a7a7a;
  margin-top: 50px;
  font-size: 187.5%;
  font-weight: bold;
}

.tag-button {
  margin: 0 5px;
  font-size: 1.5rem;
  border: 0;
  background-color: #f0f0f0;
  transition: background-color 0.1s;

  &:hover {
    background-color: #e0e0e0;
  }
}

#submitButtonsContainer {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

#confirmDeletingButtonContainer {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>