import {
  Component,
  OnInit,
  Input,
  ContentChild,
  EventEmitter,
  Output,
} from "@angular/core";
import { TabLabelComponent } from "../tab-label/tab-label.component";
import { TabBodyComponent } from "../tab-body/tab-body.component";
import { TabCloseComponent } from "../tab-close/tab-close.component";

@Component({
  selector: "app-tab-item",
  templateUrl: "./tab-item.component.html",
})
export class TabItemComponent<T> implements OnInit {
  @Input()
  label: string;

  @Input()
  isActive: boolean;

  @Output()
  onTabRemove = new EventEmitter();

  @ContentChild(TabBodyComponent)
  bodyComponent: TabBodyComponent<T>;

  @ContentChild(TabLabelComponent)
  labelComponent: TabLabelComponent<T>;

  @ContentChild(TabCloseComponent)
  closeComponent: TabCloseComponent<T>;

  constructor() {}

  ngOnInit(): void {}
}
