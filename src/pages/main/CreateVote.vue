<template>
  <form action="" id="createVoteForm">
    <div class="field">
      <label for="createVoteTitle" class="label">タイトル</label>
      <div class="control"><input type="text" class="input" name="createVoteTitle" placeholder="" v-model="vote.title" required maxlength="256"></div>
    </div>
    <div class="field">
      <template v-for="question in vote.questions">
        <component :is="question.toViewComponent()" :question="question" />
      </template>
    </div>
    <div class="field">
      <label for="createVotePassword" class="label">編集用パスワード</label>
      <div class="control"><input type="password" class="input is-small" name="createVotePassword" placeholder="" v-model="createVotePassword" required maxlength="64"></div>
    </div>
    <div class="field">
      <label class="checkbox"><input type="checkbox" id="agreeToS" name="agreeToS" required>利用規約に同意する</label>
    </div>
    <div class="field">
      <button type="button" class="button is-large is-success is-fullwidth">投票を作成する!</button>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Vote, QuestionType, QuestionViewFactory } from '@/models/vote/Vote';
import { OneSelectQuestion, OneSelectOption } from '@/models/vote/Vote';
import axios from 'axios';
import { plainToClass } from "class-transformer";

  @Component
  export default class CreateVoteComponent extends Vue {
    vote: Vote = new Vote();
    createVotePassword: string = '';
    async created() {
      //デフォルト値
      this.vote.questions.push(new OneSelectQuestion(
            '選択技',
            [new OneSelectOption('')]
      ));

      const voteJson = JSON.stringify(this.vote);
      const vote: Vote = plainToClass(Vote, JSON.parse(voteJson));
      console.log(vote);
    }
  }
</script>

<style lang="scss" scoped>
.field {
  margin: 2em auto;
}
</style>