<template>
  <div class="question">
    <div class="one-select-question-header">
      <input
        type="text"
        class="one-select-question-title"
        v-model="question.title"
        placeholder="質問のタイトル"
        required
        maxlength="64"
      />
      <span class="delete-question-button" @click="$emit('delete')" v-if="canDeleteQuestion">×</span>
    </div>
    <transition-group name="options-list" tag="div">
      <div class="field option" v-for="(option, index) in question.options" :key="option.symbol">
        <input
          type="text"
          class="input field-input option-text is-small"
          v-model="question.options[index].content"
          :placeholder="'選択技' + (index+1)"
          required
          maxlength="32"
        />
        <div class="delete-option-button-container" v-if="canDeleteOption()">
          <button
            type="button"
            class="button is-danger is-small delete-option"
            @click="deleteOption(index)"
          >x</button>
        </div>
      </div>
    </transition-group>
    <div v-if="canAddOption()">
      <div class="control add-option-button">
        <button type="button" class="button is-link" @click="addOption">選択技を追加</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { OneSelectOption, OneSelectQuestion } from "@/entities/VoteModels";

@Component({
  props: ["question", "canDeleteQuestion"]
})
export default class OneSelectQuestionComponent extends Vue {
  addOption(): void {
    const question: OneSelectQuestion = this.$props.question;
    question.addOption(new OneSelectOption(""));
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
  margin: 0.5rem auto;
}

.option-text {
  width: 90%;
}

.one-select-question-header {
  display: flex;
  justify-content: space-between;
}

.delete-question-button {
  font-size: 2.5rem;
  cursor: pointer;
  color: #666666;
  &:hover {
    color: #333333;
  }
}

.add-option-button {
  padding: 0.5em 0;
}

.delete-option-button-container {
  width: 10%;
  text-align: center;
  margin: auto;
}

.options-list-enter-active,
.options-list-leave-active {
  transition: opacity 0.3s, transform 0.3s, height 0.3s;
}

.options-list-enter,
.options-list-leave-to {
  transform: translateX(-50px);
  opacity: 0;
  height: 0;
}

.options-list-leave-active {
  position: absolute;
}

.one-select-question-title {
  border: none;
  border-bottom: 4px dotted #cccccc;
  width: 24em;
  max-width: 100%;
  font-size: 1.15rem;
  padding: 0.5em 0.5em;
}
</style>