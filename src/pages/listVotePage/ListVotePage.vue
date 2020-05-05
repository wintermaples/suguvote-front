<template>
  <div id="container">
    <div id="subtitleContainer">
      <div id="subtitle">投稿された投票</div>
      <div
        id="sortButton"
        @click="isActiveSortingMenu=!isActiveSortingMenu"
        :class="{ 'is-active-sorting-menu': isActiveSortingMenu }"
      >
        <i class="fas fa-list"></i>
        {{ getOrderingUserString() }}
        <div id="sortButtonSubMenu">
          <ul>
            <li
              @click="query.ordering='-created_at';reflectQuery();"
            >新着順</li>
            <li
              @click="query.ordering='-vote_count';reflectQuery();"
            >投票数が多い順</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="right" id="searchWindowContainer">
      <input type="text" class="field-input" v-model="query.like" @keyup.enter="reflectQuery(resetPageNumber=true)"/><button class="search-button" @click="reflectQuery(resetPageNumber=true)"><i class="fas fa-search"></i></button>
    </div>
    <div class="clear"></div>
    <ul id="voteList" v-if="votes">
      <li class="voteContainer" v-for="vote in votes">
        <div class="vote">
          <div class="vote-header">
            <router-link :to="`/detail/${vote.pk}`" class="vote-title">
              <h3>{{ vote.title }}</h3>
            </router-link>
          </div>
          <div class="vote-main multiline-text">{{ vote.description }}</div>
          <div class="vote-footer">
            <div>
              <div class="vote-tags">
                タグ:&nbsp;
                <a class="vote-tag" v-for="tag in vote.tags" :key="tag" @click="query.like=tag;reflectQuery(resetPageNumber=true);" style="cursor:pointer;">{{ tag }}</a>
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
    <paginate
    :value="getPageNumber()"
    @input="setPageNumber"
    :page-count="pageCount"
    :prev-text="'＜'"
    :next-text="'＞'"
    :container-class="'pagination-container'"
    :page-class="'page-li'"
    :prev-class="'pagination-prev'"
    :next-class="'pagination-next'"
    :click-handler="paginationClickCallback"
    ></paginate>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { api } from "@/requests/requests";
import HelperMixin from "@/utils/HelperMixin.vue";
import { OneSelectQuestion, Vote } from "@/models/VoteModels";
import { OneSelectOption } from "@/models/VoteModels";
import { VoteModelWrappedInPagination, ModelWrappedInPageNumberPagination } from "@/models/ModelWrappedInPagination";
import SuguvoteVue from "@/utils/HelperMixin.vue";
import { Dictionary } from "vue-router/types/router";
import { DEFAULT_PAGE_SIZE } from "@/const/CommonConst";

// TODO: Change a design of this page
// TODO: Implement showing creator's user name
// TODO: Implement feature of chaning page size
@Component
export default class ListVotePageComponent extends SuguvoteVue {
  votes: Readonly<Vote[]> | null = null;
  isActiveSortingMenu: boolean = false;
  pageCount: number = -1;
  query: Dictionary<string | (string | null)[] | null | undefined> = {
    size: undefined,
    ordering: undefined,
    like: '',
    page: undefined
  }

  async created() {
    this.query = {
      size: this.$route.query?.size ?? undefined,
      ordering: this.$route.query?.ordering ?? undefined,
      like: this.$route.query?.like ?? undefined,
      page: this.$route.query?.page ?? undefined
    };
    //範囲外のページが指定された時に、指定されたページ数になるようにするために代入
    this.pageCount = this.getPageNumber();

    try {
      this.fetchVotes();
    } catch (err) {
      console.log(err);
    }
  }

  async fetchVotes() {
    this.votes = [];
    const votes: VoteModelWrappedInPagination = await api.votes.list(this.query);
    this.votes = votes.results ?? [];
    this.pageCount = this.calcPageCount(votes);
  }

  async reflectQuery(resetPageNumber: boolean=false) {
    if (resetPageNumber)
      this.query['page'] = undefined;

    this.$router.push(
      {
        path: this.$route.path,
        query: this.query
      },
      () => {},
      () => {}
    );
    await this.fetchVotes();
  }

  getOrderingUserString(): string {
    switch(this.query['ordering']) {
      case '-created_at':
        return '新着順';
      case '-vote_count':
        return '投票数が多い順';
      case undefined:
        return '新着順';
      default:
        return 'カスタム';
    }
  }

  async paginationClickCallback() {
    await this.reflectQuery();
  }

  getPageNumber(): number {
    return parseInt(this.query['page']?.toString() ?? '0');
  }

  setPageNumber(input: any): void {
    this.query['page'] = input;
  }

  calcPageCount(modelWrappedInPagination: ModelWrappedInPageNumberPagination): number {
    if (!modelWrappedInPagination.count)
      return this.query['page'] ? parseInt(this.query['page']?.toString() ?? 0) : 0;

    const size: number = this.query['size'] ? parseInt(this.query['size']?.toString() ?? NaN) : DEFAULT_PAGE_SIZE;
    if (size == NaN)
      return this.query['page'] ? parseInt(this.query['page']?.toString() ?? 0) : 0;

    return Math.ceil(modelWrappedInPagination.count / size);
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
  margin-top: 2em;
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
  width: 12em;
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
      .vote-title {
        font-size: 150%;
        color: inherit;
        text-decoration: inherit;
        &:hover {
          text-decoration: underline;
        }
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

      .vote-count,
      .vote-closing-at,
      .vote-created-at {
        margin: auto 1em;
      }
    }
  }
}

.search-button {
  margin: 0 5px;
  font-size: 1.5em;
  border: 0;
  background-color: #f0f0f0;
  transition: background-color 0.1s;

  &:hover {
    background-color: #e0e0e0;
  }
}
</style>
