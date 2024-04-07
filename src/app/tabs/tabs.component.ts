import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  AfterContentChecked,
} from "@angular/core";
import { TabItemComponent } from "./tab-item/tab-item.component";
import { Observable } from "rxjs";
import { startWith, map, delay } from "rxjs/operators";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrl: "tabs.component.css",
})
export class TabsComponent<T> implements AfterContentInit, AfterContentChecked {
  @ContentChildren(TabItemComponent)
  tabs: QueryList<TabItemComponent<T>>;

  tabItems$: Observable<TabItemComponent<T>[]>;

  activeTab: TabItemComponent<T>;

  constructor() {}

  ngAfterContentInit(): void {
    this.tabItems$ = this.tabs.changes
      .pipe(startWith(""))
      .pipe(delay(0))
      .pipe(map(() => this.tabs.toArray()));
  }

  ngAfterContentChecked() {
    if (!this.activeTab && this.tabs.length) {
      Promise.resolve().then(() => {
        this.activeTab = this.tabs.first;
      });
    }
  }

  selectTab(tabItem: TabItemComponent<T>) {
    if (this.activeTab === tabItem) {
      return;
    }

    if (this.activeTab) {
      this.activeTab.isActive = false;
    }

    this.activeTab = tabItem;

    tabItem.isActive = true;
  }

  removeTab(tabItem: TabItemComponent<T>, index: number) {
    tabItem.onTabRemove.emit();

    if (this.tabs.toArray().length === 1) {
      this.activeTab = null;
      return;
    }

    const activeTabIndex = this.tabs.toArray().findIndex((tab) => tab.isActive);

    if (activeTabIndex !== index) return;

    let newActiveTabItem: TabItemComponent<T>;

    if (index === 0) {
      newActiveTabItem = this.tabs.toArray()[index + 1];
    }

    if (index !== 0 && index === activeTabIndex) {
      newActiveTabItem = this.tabs.toArray()[index - 1];
    }

    this.activeTab = newActiveTabItem;
    newActiveTabItem.isActive = true;
  }
}
