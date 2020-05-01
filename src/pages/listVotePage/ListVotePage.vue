<template>
  <div id="container">
    <div id="subtitleContainer">
      <div id="subtitle">投稿された投票</div>
      <div
        id="sortButton"
        @click="isActiveSortingMenu=!isActiveSortingMenu"
        :class="{ 'is-active-sorting-menu': isActiveSortingMenu }"
      >
        <i class="fas fa-list"></i>新着順
        <div id="sortButtonSubMenu">
          <ul>
            <li @click="changeQuery(size=null, ordering='-created_at')">新着順</li>
            <li @click="changeQuery(size=null, ordering='-vote_count')">投票数が多い順</li>
          </ul>
        </div>
      </div>
    </div>
    <ul id="voteList" v-if="votes">
      <li class="voteContainer" v-for="vote in votes">
        <div class="vote">
          <div class="vote-header">
            <router-link :to="`/detail/${vote.pk}`">
              <h3 class="vote-title">{{ vote.title }}</h3>
            </router-link>
          </div>
          <div class="vote-main multiline-text">{{ vote.description }}</div>
          <div class="vote-footer">
            <div>
              <div class="vote-tags">
                タグ:&nbsp;
                <router-link class="vote-tag" v-for="tag in vote.tags" to :key="tag">{{ tag }}</router-link>
              </div>
            </div>
            <div>
              <span class="vote-count">
                <i class="fas fa-vote-yea"></i>
                {{ vote.vote_count }}
              </span>
              <span class="vote-closing-at">
                <i class="far fa-calendar-alt"></i>
                {{ vote.closing_at ? formatDate(new Date(vote.closing_at)) : "---" }}
              </span>
              <span class="vote-created-at">
                <i class="fas fa-pen"></i>
                {{ formatDate(new Date(vote.created_at)) }}
              </span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { api } from "@/requests/requests";
import HelperMixin from "@/utils/HelperMixin.vue";
import { OneSelectQuestion, Vote } from "@/models/VoteModels";
import { OneSelectOption } from "@/models/VoteModels";
import { VoteModelWrappedInPagination } from "@/models/ModelWrappedInPagination";
import SuguvoteVue from "@/utils/HelperMixin.vue";

// TODO: Implement sorting
// TODO: Change a design of this page
// TODO: Implement showing creator's user name
// TODO: Implement searching
// TODO: Implement pagination
// TODO: Implement feature of chaning page size
@Component
export default class ListVotePageComponent extends SuguvoteVue {
  votes: Readonly<Vote[]> | null = null;
  isActiveSortingMenu: boolean = false;

  async created() {
    try {
      this.fetchVotes();
    } catch (err) {
      console.log(err);
    }
  }

  async fetchVotes() {
    const size: number =
      parseInt(this.$route.query?.size?.toString() ?? "20");
    const ordering: string = this.$route.query?.ordering?.toString() ?? undefined;
    const votes: VoteModelWrappedInPagination = await api.votes.list({
      size: size,
      ordering: ordering
    });
    this.votes = votes.results ?? [];
  }

  async changeQuery(size: number | null, ordering: string | null) {
    this.$router.push({
      path: this.$route.path,
      query: {
        size: size ? size.toString() : this.$route.query?.size,
        ordering: ordering ? ordering.toString() : this.$route.query?.ordering
      }
    }, () => {}, () => {});
    await this.fetchVotes();
  }
}
</script>

<style lang="scss" scoped>
#container {
  margin: auto;
  width: 100%;
  max-width: 1024px;
}

#subtitleContainer {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
  margin: 2em auto;
  border-bottom: 2px solid #999;
}

#subtitle {
  font-size: 150%;
  font-weight: bold;
}

#sortButton {
  font-size: 110%;
  margin-right: 3em;
  padding: 0.5em 0;
  text-decoration: none;
  color: #000;
  transition: background-color 0.2s;
  width: 6em;
  cursor: pointer;
  &:hover {
    background-color: #f9f9f9;
  }
  #sortButtonSubMenu {
    position: absolute;
    transition: opacity 0.2s, visibility 0.2s;
    a {
      color: #000;
      text-decoration: none;
    }
    ul {
      list-style: none;
      margin: 0.5em 0 0 0;
      padding: 0;
    }
    li {
      width: 10em;
      margin: 0;
      background-color: #f9f9f9;
      padding: 0.5em 0;
      transition: background-color 0.2s;
      &:hover {
        background-color: #ccc;
      }
    }
  }
  &:not(.is-active-sorting-menu) #sortButtonSubMenu {
    visibility: hidden;
    opacity: 0;
  }
  &.is-active-sorting-menu #sortButtonSubMenu {
    visibility: visible;
    opacity: 1;
  }
}

ul#voteList {
  list-style-type: none;
  padding: 0;

  li.voteContainer {
    padding: 1em 0 0 0;
    min-height: 100px;
    border-bottom: 1px solid #cccccc;

    .vote {
      a {
        color: inherit;
        text-decoration: inherit;
      }
      a:hover {
        text-decoration: underline;
      }

      .vote-title {
        font-size: 150%;
      }

      .vote-main {
        margin: 1em auto;
      }

      .vote-footer {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin: 0.5em auto;
      }

      .vote-tag {
        color: #505050;
        padding: 0.5em;
        display: inline-block;
        line-height: 1.1;
        background: #dedede;
        vertical-align: middle;
        border-radius: 25px 0px 0px 25px;
        margin: auto 0.5em;
      }

      .vote-tag:before {
        content: "●";
        color: white;
        margin-right: 8px;
      }

      a.vote-tag {
        text-decoration: inherit;
      }

      .vote-count,
      .vote-closing-at,
      .vote-created-at {
        margin: auto 1em;
      }
    }
  }
}
</style>
