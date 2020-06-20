<template>
  <div id="loginDialog" class="dialog" :class="{ 'dialog-show': isOpened }">
    <div class="dialog-contents">
      <form id="logInForm">
        <div class="center-container">
          <big>
            <strong>Suguvoteにログイン</strong>
          </big>
        </div>
        <div class="field">
          <label class="field-title" for="username">ユーザー名</label>
          <br />
          <input
            type="text"
            name="username"
            id="logInForm-username"
            class="field-input wide-input"
            required
            maxlength="150"
            v-model="username"
          />
        </div>
        <div class="field">
          <label class="field-title" for="password">パスワード</label>
          <br />
          <input
            type="password"
            name="password"
            id="logInForm-password"
            class="field-input wide-input"
            required
            maxlength="256"
            v-model="password"
          />
        </div>
        <div v-if="logInError" class="center-container">
          <div class="error">{{ logInError }}</div>
        </div>
        <div @click="logIn()" class="btn btn-color-green btn-small right">ログイン</div>
        <div class="clear"></div>
      </form>
    </div>
    <div class="dialog-margin" @click="close()"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Modal from '@/components/modalComponents/Modal.vue';
import { api } from '@/requests/requests';
import { suguvoteSessionModule } from '../../store/modules/SuguvoteSessionModule';

@Component
export default class LogInModal extends Modal {
  username: string | null = null;
  password: string | null = null;
  logInError: string | null = null;

  async logIn() {
    if (!this.username || !this.password)
      return;
    await suguvoteSessionModule.logIn({
      username: this.username,
      password: this.password
    });
    if (suguvoteSessionModule.isLoggedIn) {
      this.$router.go(0);
    } else {
      this.logInError = 'ログインに失敗しました。ユーザー名かパスワードが間違っていませんか？';
    }
      
  }
}
</script>