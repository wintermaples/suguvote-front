<template>
  <div class="question">
    <div class="field">
      <label class="label">{{ question.title }}</label>
    </div>
    <transition-group name="options-list" tag="div">
      <div class="field option" v-for="(option, index) in question.options" :key="option.symbol">
        <input type="text" class="input field-input option-text is-small" v-model="question.options[index].content" :placeholder="'選択技' + (index+1)" required maxlength="32">
        <div class="delete-option-button-container" v-if="canDeleteOption()">
          <button type="button" class="button is-danger is-small delete-option" @click="deleteOption(index)">x</button>
        </div>
      </div>
    </transition-group>
    <div class="field" v-if="canAddOption()" >
      <div class="control">
        <button type="button" class="button is-link" @click="addOption">選択技を追加</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { OneSelectOption, OneSelectQuestion } from "@/models/VoteModels";

  @Component({
    props: ['question']
  })
  export default class OneSelectQuestionComponent extends Vue {
    addOption(): void {
      const question: OneSelectQuestion = this.$props.question;
      question.addOption(new OneSelectOption(''));
    }

    canAddOption(): boolean {
      const question: OneSelectQuestion = this.$props.question;
      return question.canAddOption();
    }

    deleteOption(index: number): void {
      const question: OneSelectQuestion = this.$props.question;
      question.deleteOption(index);
    }

    canDeleteOption(): boolean {
      const question: OneSelectQuestion = this.$props.question;
      return question.canDeleteOption();
    }
  }
</script>

<style lang="scss" scoped>
.option {
  display: flex;
  margin: 0.5em auto;
}

.option-text {
  width: 90%;
}

.delete-option-button-container {
  width: 10%;
  text-align: center;
  margin: auto;
}

.options-list-enter-active, .options-list-leave-active {
  transition: opacity 0.3s, transform 0.3s, height 0.3s;
}

.options-list-enter, .options-list-leave-to  {
  transform: translateX(-50px);
  opacity: 0;
  height: 0;
}

.options-list-leave-active {
  position: absolute;
}

</style>