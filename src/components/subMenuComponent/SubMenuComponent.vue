<template>
  <div :id="id" class="sub-menu" :style="getSubMenuStyle()">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Axis } from "@/enum/Axis";

class Position {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  setLeft(v: number) {
    this.left = `${v}px`;
  }
  setTop(v: number) {
    this.top = `${v}px`;
  }
  setRight(v: number) {
    this.right = `${v}px`;
  }
  setBottom(v: number) {
    this.bottom = `${v}px`;
  }
}

/**
 * サブメニューコンポーネントです。
 * サブメニューのサブメニューでは動作しません。(動作確認はしていないが、サブメニューのサブメニューをクリックすると親側が閉じてしまう)
 */
@Component
export default class SubMenuComponent extends Vue {
  @Prop({ default: Axis.VERTICAL })
  private direction: Axis | undefined;

  @Prop()
  private isOpened: boolean = false;

  @Prop()
  private parentElement: HTMLElement | undefined;

  @Prop()
  private width: number | undefined;

  @Prop()
  private height: number | undefined;

  @Prop()
  private id: string | undefined;

  @Prop({ default: null })
  private parentMenuId: string | undefined;

  private position: Position | null = null;

  mounted() {
    //他の要素をクリックした時に閉じる処理
    window.addEventListener(
      "click",
      new (class implements EventListenerObject {
        readonly subMenuComponent: SubMenuComponent;
        constructor(subMenuComponent: SubMenuComponent) {
          this.subMenuComponent = subMenuComponent;
        }
        handleEvent(evt: Event): void {
          if (!evt.target) this.subMenuComponent.$emit("close");
          const target: HTMLElement = <HTMLElement>evt.target;

          let currentNode: HTMLElement | null = target;
          while (currentNode) {
            if (currentNode.id == this.subMenuComponent.id) return;
            if (currentNode == this.subMenuComponent.parentElement) return;
            currentNode = currentNode.parentElement;
          }
          this.subMenuComponent.$emit("close");
        }
      })(this)
    );

    //Windowのりサイズ時に位置を調整
    window.addEventListener(
      "resize",
      new (class implements EventListenerObject {
        readonly subMenuComponent: SubMenuComponent;
        constructor(subMenuComponent: SubMenuComponent) {
          this.subMenuComponent = subMenuComponent;
        }
        handleEvent(evt: Event): void {
          this.subMenuComponent.position = this.subMenuComponent.calcPosition();
        }
      })(this)
    );
  }

  @Watch("isOpened")
  private onIsOpenedChanged() {
    if (!this.isOpened) return;
    this.position = this.calcPosition();
  }

  private _windowResizeEventHandler() {
    this.position = this.calcPosition();
  }

  private getSubMenuStyle() {
    if (!this.isOpened || !this.position)
      return {
        visibility: "hidden",
        width: "0px",
        height: "0px",
        maxWidth: "0px",
        maxHeight: "0px",
        opacity: 0
      };

    return {
      ...this.position,
      visibility: "visible",
      width: `${this.width}px`,
      height: `${this.height}px`,
      maxWidth: `${this.width}px`,
      maxHeight: `${this.height}px`,
      opacity: 1
    };
  }

  private calcPosition(): Position {
    if (!this.direction) throw "Direction is not specified!";
    if (!this.parentElement) throw "ParentElement is not specified!";
    if (!this.width) throw "Width is not specified!";
    const paddingRight = 20;
    const clientRect: DOMRect = this.parentElement.getBoundingClientRect();
    const parentLeftX = window.pageXOffset + clientRect.left;
    const parentRightX = parentLeftX + clientRect.width;
    const parentTopY = window.pageYOffset + clientRect.top;
    const parentBottomY = parentTopY + clientRect.height;

    const parentLeftSpace = clientRect.left;
    const parentRightSpace = window.innerWidth - clientRect.right;
    const parentTopSpace = clientRect.top;
    const parentBottomSpace = window.innerHeight - clientRect.bottom;

    if (this.direction == Axis.VERTICAL) {
      //上下方向に広い方にサブメニューを表示
      //左右方向には親要素の左位置から右側に展開
      //ただし、画面の左右サイズは超えないようにする
      let position: Position = new Position();
      if (parentTopSpace > parentBottomSpace) {
        position.setBottom(parentTopY);
      } else {
        position.setTop(parentBottomY);
      }
      if (parentLeftX + this.width < window.innerWidth - 20) {
        position.setLeft(parentLeftX);
      } else {
        position.setRight(20);
      }
      return position;
    } else if (this.direction == Axis.HORIZONTAL) {
      //左右方向に広い方にサブメニューを表示
      //上下方向には親要素の上位置から下に展開
      //ただし、画面の左右サイズは超える可能性がある
      let position: Position = new Position();
      if (parentLeftSpace > parentRightSpace) {
        position.setRight(parentLeftX);
      } else {
        position.setLeft(parentRightX);
      }
      position.setTop(parentTopY);
      return position;
    }
    return new Position();
  }
}
</script>

<style lang="scss" scoped>
.sub-menu {
  box-sizing: border-box;
  margin: 0.5rem 0;
  overflow-x: hidden;
  position: absolute;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
  transition: max-width 0.2s cubic-bezier(0, 0, 0.2, 1),
    max-height 0.2s cubic-bezier(0, 0, 0.2, 1),
    opacity 0.2s cubic-bezier(0, 0, 0.2, 1);
}

ul {
  display: flex;
  list-style: none;
  flex-flow: column;
  align-items: flex-start;
  justify-content: space-around;
  height: 100%;
  margin: 0;
  padding: 0;

  li {
    user-select: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0.5rem 0 0.5rem 1rem;
    transition: background-color 0.2s ease;
    &.hr {
      height: 0px;
      padding: 0;
      border-bottom: 1px solid #e9e9e9;
    }
    &:hover {
      background-color: #eeeeee;
    }
  }
}
</style>