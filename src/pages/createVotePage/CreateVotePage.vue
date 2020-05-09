<template>
  <form id="createVoteForm">
    <div id="title">アンケートを作成</div>
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
      <input type="text" name="tag" id="form-tag" class="field-input" v-model="tagField" />
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
      <input
        type="datetime-local"
        name="closingAt"
        id="form-closingAt"
        class="field-input"
        v-model="vote.closing_at"
      />
    </div>
    <div class="field">
      <label class="field-title" for="password">編集用パスワード</label>
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
    <div class="border"></div>
    <div id="questionsContainer">
      <div class="field">
        <template v-for="question in vote.questions">
          <component :is="toEditQuestionView(question)" :question="question" />
        </template>
      </div>
      <div
        id="addQuestionButtonContainer"
        class="right"
        @click="addQuestion()"
        v-if="canAddQuestion()"
      >
        <div id="addQuestionButton">+</div>
        <div id="addQuestionButtonLabel">質問を追加</div>
      </div>
      <div class="clear"></div>
      <div id="createVoteButtonContainer">
        <a @click="createVote()" id="createVoteButton">アンケートを作成する</a>
      </div>
    </div>
    <div class="recaptcha-brand">
      This site is protected by reCAPTCHA and the Google
      <a
        href="https://policies.google.com/privacy"
      >Privacy Policy</a> and
      <a href="https://policies.google.com/terms">Terms of Service</a> apply.
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { OneSelectQuestion, OneSelectOption, Vote } from "@/models/VoteModels";
import axios, { AxiosResponse } from "axios";
import { plainToClass } from "class-transformer";
import { api } from "@/requests/requests";
import SuguvoteVue from "../../utils/HelperMixin.vue";
import { MAX_QUESTION_NUM, MAX_TAG_NUM } from "@/const/LimitConst";
import { getReCAPTCHAToken } from "@/utils/recaptcha";

@Component
export default class CreateVoteComponent extends SuguvoteVue {
  vote: Vote = new Vote();
  tagField: string = "";

  async created() {
    //デフォルト値
    this.vote.questions.push(
      new OneSelectQuestion("選択技", [new OneSelectOption("")])
    );
  }

  async createVote() {
    const form: HTMLFormElement | null =
      <HTMLFormElement>document.getElementById("createVoteForm") ?? null;
    if (!form?.reportValidity()) return;

    const recaptcha_token: string = await getReCAPTCHAToken();

    try {
      const createdVote: Vote = await api.votes.create(
        this.vote,
        recaptcha_token
      );
      const pk = createdVote["pk"];
      this.$router.push(`/detail/${pk}`);
    } catch (err) {
      console.log(err);
    }
  }

  addQuestion() {
    if (!this.canAddQuestion()) return;
    this.vote.questions.push(
      new OneSelectQuestion("選択技", [new OneSelectOption("")])
    );
  }

  canAddQuestion(): boolean {
    return this.vote.questions.length < MAX_QUESTION_NUM;
  }

  addTag() {
    if (!this.tagField) return;
    if (this.vote.tags.some(t => t == this.tagField)) return;
    if (!this.canAddTag()) return;
    this.vote.tags.push(this.tagField);
    this.tagField = "";
  }

  deleteTag(tag: string) {
    this.vote.tags = this.vote.tags.filter(t => t != tag);
  }

  canAddTag(): boolean {
    return this.vote.tags.length < MAX_TAG_NUM;
  }
}
</script>

<style lang="scss" scoped>
#createVoteForm {
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

.question-container {
  margin-top: 75px;
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

#addQuestionButtonContainer {
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
  padding: 10px 0;
  transition: background-color 0.1s;

  &:hover {
    background-color: #e0e0e0;
  }

  #addQuestionButton {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: #1464f6;
    text-align: center;
    line-height: 50px;
    color: #ffffff;
    font-weight: bold;
    font-size: 50px;
  }

  #addQuestionButtonLabel {
    font-size: 75%;
    color: #1464f6;
    margin: 5px auto;
  }
}

#createVoteButtonContainer {
  margin: 132px auto;
  text-align: center;
}

#createVoteButton {
  text-decoration: inherit;
  border-radius: 4px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  padding: 1rem 5rem;
  background-color: #4c7a34;
  color: white;
  font-weight: bold;
  cursor: pointer;

  transition: box-shadow 0.2s, background-color 0.2s;

  &:hover {
    background-color: #5c8a44;
    box-shadow: 5px 5px 7px rgba(39, 33, 33, 0.5);
  }

  &:active {
    background-color: #3c6a24;
    box-shadow: 3px 3px 1px rgba(0, 0, 0, 0.5);
  }
}
</style>